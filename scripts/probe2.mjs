import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const DEBUG_PORT = 9335;
const BASE = "http://localhost:3000";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const userDataDir = mkdtempSync(join(tmpdir(), "fb-probe2-"));

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

try {
  await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await send("Page.navigate", { url: BASE });
  await sleep(3000);

  const detail = await evaluate(`(async () => {
    const toggle = document.querySelector('header button[aria-controls="mobile-menu"]');
    toggle.click();
    await new Promise(r => setTimeout(r, 1200));
    const menu = document.getElementById('mobile-menu');
    const nav = menu.querySelector('nav');
    // force reflow
    void menu.offsetHeight;
    const cs = getComputedStyle(menu);
    const out = {
      inlineStyle: menu.getAttribute('style'),
      rect: (() => { const r = menu.getBoundingClientRect(); return { top: Math.round(r.top), h: Math.round(r.height), w: Math.round(r.width) }; })(),
      offsetHeight: menu.offsetHeight,
      scrollHeight: menu.scrollHeight,
      csHeight: cs.height,
      csMinHeight: cs.minHeight,
      csOverflow: cs.overflow,
      csDisplay: cs.display,
      csBoxSizing: cs.boxSizing,
      navRectH: Math.round(nav.getBoundingClientRect().height),
      docClientHeight: document.documentElement.clientHeight,
    };
    // measure again after a tick
    await new Promise(r => setTimeout(r, 300));
    const r2 = menu.getBoundingClientRect();
    out.rectSecond = { top: Math.round(r2.top), h: Math.round(r2.height) };
    return out;
  })()`);
  console.log("MENU-DETAIL:", JSON.stringify(detail));
} catch (err) {
  console.error("PROBE FAILED:", err.message);
} finally {
  try { await send("Browser.close"); } catch {}
  chrome.kill();
  await sleep(500);
  try { rmSync(userDataDir, { recursive: true, force: true }); } catch {}
  process.exit(0);
}
