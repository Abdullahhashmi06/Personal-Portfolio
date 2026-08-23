/**
 * Temporary QA script — drives headless Chrome over the DevTools Protocol
 * to verify responsive layouts, carousel geometry, mobile menu, loader
 * timing, and reduced-motion behavior.
 */
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const DEBUG_PORT = 9333;
const BASE = "http://localhost:3000";

const log = (m) => console.log("[audit]", m);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const withTimeout = (p, ms, what) =>
  Promise.race([
    p,
    sleep(ms).then(() => {
      throw new Error("timeout: " + what);
    }),
  ]);

const userDataDir = mkdtempSync(join(tmpdir(), "fb-audit-"));
const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-port=" + DEBUG_PORT,
    "--user-data-dir=" + userDataDir,
    "about:blank",
  ],
  { stdio: "ignore" }
);

async function getJson(url) {
  const res = await fetch(url);
  return res.json();
}

let tabs;
for (let i = 0; i < 40; i++) {
  try {
    tabs = await getJson(`http://localhost:${DEBUG_PORT}/json/list`);
    if (tabs.some((t) => t.type === "page")) break;
  } catch {
    /* not up yet */
  }
  await sleep(250);
}
log("targets:", tabs.length);

const target = tabs.find((t) => t.type === "page");
const ws = new WebSocket(target.webSocketDebuggerUrl);
let msgId = 0;
const pending = new Map();

function send(method, params = {}) {
  return withTimeout(
    new Promise((resolve, reject) => {
      const id = ++msgId;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    }),
    15000,
    method
  );
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
  const res = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (res.exceptionDetails) throw new Error("eval: " + res.exceptionDetails.text);
  return res.result.value;
}

async function setViewport(width, height, mobile) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile,
  });
}

async function setReducedMotion(reduce) {
  await send("Emulation.setEmulatedMedia", {
    features: [
      { name: "prefers-reduced-motion", value: reduce ? "reduce" : "no-preference" },
    ],
  });
}

const METRICS = `(() => {
  const doc = document.documentElement;
  const h1 = document.querySelector('h1');
  const toggle = document.querySelector('header button[aria-controls="mobile-menu"]');
  const slides = [...document.querySelectorAll('[data-slide]')];
  const track = slides[0]?.parentElement;
  const marquee = document.querySelector('.animate-marquee');
  const orb = document.querySelector('.animate-orb');
  const first = slides[0]?.getBoundingClientRect();
  const second = slides[1]?.getBoundingClientRect();
  return {
    vw: innerWidth,
    docW: doc.scrollWidth,
    overflow: doc.scrollWidth > innerWidth,
    bodyScrollable: doc.scrollHeight > innerHeight,
    h1Width: h1 ? Math.round(h1.getBoundingClientRect().width) : null,
    h1Height: h1 ? Math.round(h1.getBoundingClientRect().height) : null,
    mobileToggleVisible: toggle ? getComputedStyle(toggle).display !== 'none' : null,
    slideWidths: slides.map(s => Math.round(s.getBoundingClientRect().width)),
    firstCardCenterOffset: first ? Math.round(first.left + first.width / 2 - innerWidth / 2) : null,
    visibleNextPeek: second ? Math.max(0, Math.round(innerWidth - second.left)) : null,
    trackScrollable: track ? track.scrollWidth > track.clientWidth : null,
    marqueePlayState: marquee ? getComputedStyle(marquee).animationPlayState : null,
    orbAnimation: orb ? getComputedStyle(orb).animationDuration : null,
  };
})()`;

async function audit(label, width, height, mobile) {
  await setViewport(width, height, mobile);
  await send("Page.navigate", { url: BASE });
  await sleep(450);
  const loaderAt450 = await evaluate(
    `[...document.querySelectorAll('body > div')].some(d => d.className.includes('z-[80]'))`
  );
  await sleep(2400);
  const metrics = await evaluate(METRICS);
  console.log(label, JSON.stringify({ ...metrics, loaderAt450 }));
}

try {
  await audit("AUDIT 390x844 (mobile):", 390, 844, true);
  await audit("AUDIT 375x667 (mobile):", 375, 667, true);
  await audit("AUDIT 320x568 (mobile):", 320, 568, true);
  await audit("AUDIT 768x1024 (tablet):", 768, 1024, true);
  await audit("AUDIT 1440x900 (desktop):", 1440, 900, false);

  // Mobile menu interaction at 390px
  await setViewport(390, 844, true);
  await send("Page.navigate", { url: BASE });
  await sleep(2200);
  const menuTest = await evaluate(`(async () => {
    const toggle = document.querySelector('header button[aria-controls="mobile-menu"]');
    toggle.click();
    await new Promise(r => setTimeout(r, 700));
    const menu = document.getElementById('mobile-menu');
    const rect = menu ? menu.getBoundingClientRect() : null;
    const out = {
      opened: !!menu,
      top: rect ? Math.round(rect.top) : null,
      height: rect ? Math.round(rect.height) : null,
      bodyLocked: document.body.style.overflow === 'hidden',
    };
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await new Promise(r => setTimeout(r, 500));
    out.closed = document.getElementById('mobile-menu') === null;
    out.bodyUnlocked = document.body.style.overflow !== 'hidden';
    return out;
  })()`);
  console.log("MOBILE-MENU:", JSON.stringify(menuTest));

  // Reduced motion at desktop
  await setReducedMotion(true);
  await audit("AUDIT 1440x900 reduced-motion:", 1440, 900, false);
  await setReducedMotion(false);

  // Carousel at desktop + mobile
  for (const [label, w, h, m] of [
    ["CAROUSEL 1440:", 1440, 900, false],
    ["CAROUSEL 390:", 390, 844, true],
  ]) {
    await setViewport(w, h, m);
    await send("Page.navigate", { url: BASE });
    await sleep(2200);
    const carouselTest = await evaluate(`(async () => {
      const track = document.querySelector('[data-slide]').parentElement;
      const max = track.scrollWidth - track.clientWidth;
      document.querySelector('button[aria-label="Next project"]').click();
      await new Promise(r => setTimeout(r, 1000));
      const afterOne = Math.round(track.scrollLeft);
      const active = document.querySelector('button[aria-current="true"]')?.getAttribute('aria-label');
      // go to slide 4 via dots
      const dots = [...document.querySelectorAll('button[aria-label^="Go to slide"]')];
      dots[3].click();
      await new Promise(r => setTimeout(r, 1000));
      return {
        maxScroll: Math.round(max),
        afterOneClick: afterOne,
        active,
        nextDisabledAtEnd: document.querySelector('button[aria-label="Next project"]').getAttribute('aria-disabled'),
        scrollLeftAtEnd: Math.round(track.scrollLeft),
      };
    })()`);
    console.log(label, JSON.stringify(carouselTest));
  }
} catch (err) {
  console.error("AUDIT FAILED:", err.message);
} finally {
  try {
    await send("Browser.close");
  } catch {
    /* already gone */
  }
  chrome.kill();
  rmSync(userDataDir, { recursive: true, force: true });
  process.exit(0);
}
