import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const DEBUG_PORT = 9334;
const BASE = "http://localhost:3000";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const userDataDir = mkdtempSync(join(tmpdir(), "fb-probe-"));

const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  "--no-first-run",
  "--remote-debugging-port=" + DEBUG_PORT,
  "--user-data-dir=" + userDataDir,
  "about:blank",
], { stdio: "ignore" });

let tabs;
for (let i = 0; i < 40; i++) {
  try {
    tabs = await (await fetch(`http://localhost:${DEBUG_PORT}/json/list`)).json();
    if (tabs.some((t) => t.type === "page")) break;
  } catch {}
  await sleep(250);
}

const ws = new WebSocket(tabs.find((t) => t.type === "page").webSocketDebuggerUrl);
let msgId = 0;
const pending = new Map();
const consoleErrors = [];

function send(method, params = {}) {
  return Promise.race([
    new Promise((resolve, reject) => {
      const id = ++msgId;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    }),
    sleep(12000).then(() => { throw new Error("timeout " + method); }),
  ]);
}

ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.method === "Runtime.consoleAPICalled" && msg.params.type === "error") {
    consoleErrors.push(msg.params.args.map((a) => a.value ?? a.description).join(" "));
  }
  if (msg.method === "Runtime.exceptionThrown") {
    consoleErrors.push("EXCEPTION: " + (msg.params.exceptionDetails.exception?.description ?? msg.params.exceptionDetails.text));
  }
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
  }
};

await new Promise((r) => (ws.onopen = r));
await send("Page.enable");
await send("Runtime.enable");

async function evaluate(expression) {
  const res = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  return res.result.value;
}

async function setViewport(width, height, mobile) {
  await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile });
}

try {
  await setViewport(390, 844, true);
  await send("Page.navigate", { url: BASE });
  await sleep(300);
  const samples = [];
  for (const t of [300, 900, 1600]) {
    await sleep(t === 300 ? 0 : t - samples.reduce((a, s) => a + s.wait, 0));
    // rework: just sleep incrementally
    const info = await evaluate(`(() => {
      const divs = [...document.querySelectorAll('body > div')].map(d => d.className.split(' ')[2] || d.className.slice(0, 40));
      const hasLoader = divs.some(c => c.includes('z-[80]'));
      const mono = [...document.querySelectorAll('body *')].some(el => el.textContent.trim() === 'YN');
      return { hasLoader, bodyDivCount: document.querySelectorAll('body > div').length };
    })()`);
    samples.push({ at: t, ...info });
    if (t === 300) await sleep(600);
    else await sleep(700);
  }
  console.log("LOADER-SAMPLES:", JSON.stringify(samples));

  // Mobile menu measurement, in detail
  await sleep(500);
  const menuInfo = await evaluate(`(async () => {
    const toggle = document.querySelector('header button[aria-controls="mobile-menu"]');
    toggle.click();
    await new Promise(r => setTimeout(r, 900));
    const menu = document.getElementById('mobile-menu');
    if (!menu) return { opened: false };
    const cs = getComputedStyle(menu);
    const nav = menu.querySelector('nav');
    return {
      opened: true,
      rectTop: Math.round(menu.getBoundingClientRect().top),
      rectHeight: Math.round(menu.getBoundingClientRect().height),
      csTop: cs.top, csBottom: cs.bottom, csHeight: cs.height, csPosition: cs.position,
      childRects: [...menu.children].map(c => Math.round(c.getBoundingClientRect().height)),
      navLinks: nav ? [...nav.querySelectorAll('a')].map(a => a.textContent.trim()) : [],
    };
  })()`);
  console.log("MENU-DETAIL:", JSON.stringify(menuInfo));

  await sleep(300);
  console.log("CONSOLE-ERRORS:", JSON.stringify(consoleErrors));
} catch (err) {
  console.error("PROBE FAILED:", err.message);
} finally {
  try { await send("Browser.close"); } catch {}
  chrome.kill();
  await sleep(500);
  try { rmSync(userDataDir, { recursive: true, force: true }); } catch {}
  process.exit(0);
}
