const t = await (await fetch('http://127.0.0.1:9222/json/list')).json();
const ws = new WebSocket(t.find(x => x.type === 'page').webSocketDebuggerUrl);
let id = 0; const pending = new Map();
const send = (m, p) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method: m, params: p })); });
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } };
await new Promise(r => ws.onopen = r);
await send('Page.enable', {});
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: process.argv[2] });
await new Promise(r => setTimeout(r, 12000));
const r = await send('Runtime.evaluate', { returnByValue: true, expression: `(() => {
  const row = document.querySelector('.hero-actions');
  const badges = document.querySelector('.badges');
  const tfm = document.querySelector('.tfm-list');
  const rb = row.getBoundingClientRect(), bb = badges.getBoundingClientRect(), tb = tfm.getBoundingClientRect();
  return JSON.stringify({
    labels: [...row.querySelectorAll('gilde-support, gilde-contact')].map(e => e.shadowRoot.querySelector('button').textContent.trim()),
    gapAboveButtons: Math.round(rb.top - bb.bottom),
    gapBelowButtons: Math.round(tb.top - rb.bottom),
    buttonHeights: [...row.querySelectorAll('gilde-support, gilde-contact')].map(e => Math.round(e.getBoundingClientRect().height)),
    overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
  });
})()` });
console.log(r.result.value);
ws.close(); process.exit(0);
