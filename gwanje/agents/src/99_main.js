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
    Main.last = performance.now(); requestAnimationFrame(Main.loop);
  },
};
// 확인용 봇: __sim(초, {mode, place}) — 카드는 늘 1번, 새 방은 가운데 길 위·아래 빈 칸, 길과 규칙은 안 고침
window.__sim = (sec, o = {}) => {
  if (o.mode && Teams.mode !== o.mode) Teams.setMode(o.mode);
  const dt = 0.1, out = []; let stuckMax = 0, idleMax = 0;
  for (let k = 0; k < sec / dt; k++) {
    Flow.step(dt);
    stuckMax = Math.max(stuckMax, World.crew.filter(c => c.st === 'stuck').length);
    if (Derive.inboxList().length >= World.S.inboxCap - 1) idleMax = Math.max(idleMax, World.crew.filter(c => c.st === 'idle').length);
    if (!$('repOv').hidden) { const m = World.S.yday; out.push(`day${World.S.day} done${m.done} avg${m.avg == null ? '-' : m.avg.toFixed(1)} qual${m.qual == null ? '-' : Math.round(m.qual * 100)} cost${m.cost} lost${m.lost} goal${World.S.goal} crew${World.crew.length} stuckMax${stuckMax} idleWhenFull${idleMax} roles${JSON.stringify(Teams.counts)}`); stuckMax = idleMax = 0; Flow.choose(Flow.pick[0]); }
    while (Edit.held) { let ok = false; for (let d = 0; d < G.w && !ok; d++) for (const x of [7 + d, 7 - d]) for (const y of [3, 5]) if (!ok && x > 0 && x < G.w - 1 && Edit.canPlace(x, y)) ok = Edit.drop(x, y); if (!ok) break; }
  }
  return out.join('\n');
};
Main.start();
