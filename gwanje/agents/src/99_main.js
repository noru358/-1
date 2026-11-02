// ═════════ 입력, 루프, 확인용 봇 ═════════
const Main = {
  cv: null,
  toTile(e) { const r = Main.cv.getBoundingClientRect(); return [Math.floor((e.clientX - r.left) / r.width * G.w), Math.floor((e.clientY - r.top) / r.height * G.h)]; },
  bind() {
    const cv = Main.cv;
    cv.addEventListener('pointermove', e => {
      Edit.hover = Main.toTile(e); if (Edit.dragging) Edit.paint(...Edit.hover);
      const r = cv.getBoundingClientRect(), fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
      if (Edit.tool === 'sel' && !Edit.held) UI.tooltip(fx * W, fy * H, fx * 100, fy * 100); else $('tip').hidden = true;
    });
    cv.addEventListener('pointerleave', () => { $('tip').hidden = true; });
    cv.addEventListener('pointerdown', e => {
      if (e.button === 2) return; const [x, y] = Edit.hover = Main.toTile(e);
      if (Edit.held) { Edit.drop(x, y); return; }
      if (Edit.tool !== 'sel') { Edit.dragging = true; cv.setPointerCapture(e.pointerId); Edit.paint(x, y); return; }
      // 꼬물이를 누르면 한 번 누르기(꿀밤·칭찬). 손이 쉬는 중이면 그 칸의 방 설정을 연다
      const b = cv.getBoundingClientRect(), c = Crew.at((e.clientX - b.left) / b.width * W, (e.clientY - b.top) / b.height * H);
      if (c && Edit.poke(c)) { UI.closePop(); return; }
      const r = Path.roomAt(x, y); if (r) UI.openPop(r); else UI.closePop();
    });
    addEventListener('pointerup', () => { Edit.dragging = false; });
    cv.addEventListener('contextmenu', e => { e.preventDefault(); Edit.cancel(); UI.closePop(); });
    addEventListener('keydown', e => {
      if (!$('repOv').hidden) { if (e.key === '1' || e.key === '2') { const c = Flow.pick[+e.key - 1]; if (c) Flow.choose(c); } return; }
      const k = e.key.toLowerCase(), S = World.S;
      if (e.code === 'Space') { e.preventDefault(); S.paused = !S.paused; UI.tools(); }
      else if (k === 'r' || k === 'ㄱ') Edit.setTool(Edit.tool === 'road' ? 'sel' : 'road');
      else if (k === 'e' || k === 'ㄷ') Edit.setTool(Edit.tool === 'erase' ? 'sel' : 'erase');
      else if (k === 's' || k === 'ㄴ') Edit.setTool('sel');
      else if (k === 'f' || k === 'ㄹ') Main.cycleSpeed();
      else if (e.key === 'Escape') { Edit.cancel(); UI.closePop(); Edit.setTool('sel'); }
    });
    $('tSel').onclick = () => Edit.setTool('sel'); $('tRoad').onclick = () => Edit.setTool('road'); $('tErase').onclick = () => Edit.setTool('erase');
    $('tPause').onclick = () => { World.S.paused = !World.S.paused; UI.tools(); }; $('tSpeed').onclick = Main.cycleSpeed;
  },
  cycleSpeed() { const sp = DATA.speeds, S = World.S; S.speed = sp[(sp.indexOf(S.speed) + 1) % sp.length]; UI.tools(); },
  last: 0, uiT: 0,
  loop(now) {
    const dt = Math.min(0.1, (now - Main.last) / 1000); Main.last = now;
    for (let k = 0; k < World.S.speed; k++) Flow.step(dt);
    Render.frame(now / 1000);
    Main.uiT -= dt; if (Main.uiT <= 0) { Main.uiT = 0.2; UI.overlays(); UI.crewList(); UI.goal(); if (Teams.mode === 'auto') UI.crewPanel(); }
    UI.hud(); requestAnimationFrame(Main.loop);
  },
  start() {
    setupWorld(); Main.cv = $('cv'); Render.init(Main.cv); Main.bind();
    UI.tools(); UI.recipes(); UI.crewPanel(); UI.goal();
    const [ra, rb] = DATA.day.rush, rz = $('daybar').querySelector('.rushz'); rz.style.left = ra / DATA.day.length * 100 + '%'; rz.style.width = (rb - ra) / DATA.day.length * 100 + '%';
    Main.last = performance.now(); requestAnimationFrame(Main.loop);
  },
};
// 확인용 봇: __sim(초, 옵션) — 카드는 card번(기본 0), 새 방은 stack이면 같은 방 위로 증축, 아니면 가운데 길 위·아래 빈 칸.
// 옵션: mode(분업), quirks(모든 꼬물이 기질 덮어쓰기), pin({quirk, role}: 그 기질을 그 역할로 고정), poke(손이 쉬면 !환각 든 애에게 꿀밤)
window.__sim = (sec, o = {}) => {
  if (o.mode && Teams.mode !== o.mode) Teams.setMode(o.mode);
  const fixQuirks = () => { if (o.quirks) World.crew.forEach((c, i) => c.quirk = o.quirks[i % o.quirks.length]); if (o.pin) for (const c of World.crew) if (c.quirk === o.pin.quirk && !c.pinned) { c.pinned = true; c.role = o.pin.role; } Teams.apply(); };
  fixQuirks();
  const dt = 0.1, out = []; let stuckMax = 0, idleMax = 0, frozen = 0;
  const pos = new Map();
  for (let k = 0; k < sec / dt; k++) {
    Flow.step(dt);
    stuckMax = Math.max(stuckMax, World.crew.filter(c => c.st === 'stuck').length);
    if (Derive.inboxList().length >= World.S.inboxCap - 1) idleMax = Math.max(idleMax, World.crew.filter(c => c.st === 'idle').length);
    // 교착 감시: 일감을 쥔 채 20초 넘게 같은 상태·같은 자리에 있는 꼬물이(줄 서기 제외)
    for (const c of World.crew) { const key = `${c.st}|${Math.round(c.x)}|${Math.round(c.y)}|${c.act && c.act.what}`, p = pos.get(c) || { key, t: 0 }; p.t = p.key === key && c.job && c.st !== 'queue' ? p.t + dt : 0; p.key = key; pos.set(c, p); if (p.t > 20) frozen++; }
    if (o.poke && World.S.pokeCd <= 0) { const c = World.crew.find(c => c.carry && (c.carry.tag === 'hallucinated' || (c.carry.result && c.carry.result.tag === 'hallucinated'))); if (c) Edit.poke(c); }
    if (!$('repOv').hidden) {
      const m = World.S.yday, d = World.day;
      const row = { day: World.S.day, done: m.done, master: m.master, avg: m.avg == null ? null : +m.avg.toFixed(1), trust: m.trust == null ? null : Math.round(m.trust * 100), cost: m.cost, lost: m.lost, oops: m.oops, goal: World.S.goal, crew: World.crew.length,
        made: { ...d.made }, madeBy: JSON.parse(JSON.stringify(d.madeBy)), qa: { ...d.qa }, knock: d.knock, halBy: { ...d.halBy }, coffee: d.coffee, chats: d.chats, stuckMax, idleWhenFull: idleMax, frozen, roles: { ...Teams.counts }, lv2: World.rooms.filter(r => r.lv > 1).map(r => r.kind).join(',') };
      row.card = Flow.pick[o.card || 0].n; out.push(row); stuckMax = idleMax = frozen = 0; Flow.choose(Flow.pick[o.card || 0]); fixQuirks();
    }
    while (Edit.held) {
      let ok = false;
      if (o.stack) { const t = World.rooms.find(r => !r.held && r.kind === Edit.held.kind && Edit.stackTarget(r.x, r.y)); if (t) ok = Edit.drop(t.x, t.y); }
      for (let d = 0; d < G.w && !ok; d++) for (const x of [7 + d, 7 - d]) for (const y of [3, 5]) if (!ok && x > 0 && x < G.w - 1 && Edit.canPlace(x, y) && !Edit.stackTarget(x, y)) ok = Edit.drop(x, y);
      if (!ok) break;
    }
  }
  return out;
};
Main.start();
