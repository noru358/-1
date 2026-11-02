// ═════════ 그림(캔버스) ═════════
// 판, 길, 방, 꼬물이, 들고 있는 것, 효과. 글자는 UI(HTML)가 맡는다.
const Render = {
  ctx: null, spr: {},
  init(cv) { Render.ctx = cv.getContext('2d'); },
  rect(c, x, y, w, h) { const g = Render.ctx; g.fillStyle = c; g.fillRect(x, y, w, h); },
  // 16px 꼬물이: 코드로 찍고 색·프레임별로 캐시
  critter(tint, frame) {
    const key = tint + frame; if (Render.spr[key]) return Render.spr[key];
    const s = 16, cv = document.createElement('canvas'); cv.width = s; cv.height = s; const x = cv.getContext('2d');
    const px = (a, b, col) => { x.fillStyle = col; x.fillRect(a, b, 1, 1); };
    const bot = 13, top = 3, cx = 7.5, rx = 6.4, ry = (bot - top) / 2 + 0.4, cy = top + ry - 0.4 + (frame ? 0.5 : 0);
    const ins = (i, j) => ((i - cx) / rx) ** 2 + ((j - cy) / ry) ** 2 <= 1;
    for (let j = 0; j < s; j++) for (let i = 0; i < s; i++) { if (!ins(i, j)) continue; const edge = !ins(i - 1, j) || !ins(i + 1, j) || !ins(i, j - 1) || !ins(i, j + 1); px(i, j, edge ? '#2b1d2c' : tint); if (!edge && j > cy + ry * 0.35) px(i, j, 'rgba(0,0,0,.18)'); if (!edge && i < cx - 1 && j < cy - ry * 0.35) px(i, j, 'rgba(255,255,255,.28)'); }
    const ey = Math.round(cy - 1); x.fillStyle = '#1b1420'; x.fillRect(4, ey, 2, 3); x.fillRect(10, ey, 2, 3);
    x.fillStyle = '#f08a7a'; x.fillRect(2, ey + 3, 1, 1); x.fillRect(13, ey + 3, 1, 1);
    x.fillStyle = '#2b1d2c'; x.fillRect(8 + (frame ? 1 : 0), 0, 1, 3); px(8 + (frame ? 1 : 0), 0, '#7fe0d0');
    x.fillRect(4, 14, 2, frame === 0 ? 1 : 2); x.fillRect(10, 14, 2, frame === 1 ? 1 : 2);
    return (Render.spr[key] = cv);
  },
  tile(x, y) { const R = Render.rect, px = x * TILE, py = y * TILE; R((x + y) % 2 ? '#24203a' : '#27233e', px, py, TILE, TILE); R('#1a1729', px, py + TILE - 1, TILE, 1); R('#1a1729', px + TILE - 1, py, 1, TILE); R('rgba(255,255,255,.05)', px, py, TILE - 1, 1); R('rgba(255,255,255,.05)', px, py, 1, TILE - 1); },
  road(x, y) {
    const R = Render.rect, px = x * TILE, py = y * TILE, link = (dx, dy) => Path.isRoad(x + dx, y + dy) || !!Path.roomAt(x + dx, y + dy), c = '#3a3552';
    R(c, px + 6, py + 6, 12, 12);
    if (link(1, 0)) R(c, px + 18, py + 6, 6, 12); if (link(-1, 0)) R(c, px, py + 6, 6, 12);
    if (link(0, 1)) R(c, px + 6, py + 18, 12, 6); if (link(0, -1)) R(c, px + 6, py, 12, 6);
    R('rgba(127,224,208,.22)', px + 11, py + 11, 2, 2);
  },
  // 방: 윗면 색 + 기호. 부품 방은 만드는 부품 색 네모가 크게 들어간다(아래 범례와 같은 색).
  room(r, t, ghost) {
    const R = Render.rect, g = Render.ctx, k = DATA.rooms[r.kind], px = r.x * TILE, py = r.y * TILE, wh = '#f4f1ff';
    g.globalAlpha = ghost ? .55 : 1;
    R('rgba(0,0,0,.4)', px + 2, py + 3, 21, 21); R(k.col, px + 1, py + 1, 22, 21); R(k.top, px + 1, py + 1, 22, 5); R('rgba(0,0,0,.3)', px + 1, py + 6, 22, 1);
    const ix = px + 7, iy = py + 9;
    if (r.kind === 'in') { R(wh, ix, iy + 2, 10, 7); R(k.col, ix + 2, iy + 4, 6, 1); }
    else if (r.kind === 'out') { R(wh, ix + 1, iy, 8, 6); R(wh, ix + 4, iy + 6, 2, 2); R(wh, ix + 2, iy + 8, 6, 1); }
    else if (r.kind === 'asm') { R('#c8a878', ix, iy - 1, 10, 11); R(wh, ix + 1, iy + 1, 8, 8); ['#8ac8ff', '#ff9ad0', '#f0e070', '#f4f1ff'].forEach((c, i) => R(c, ix + 2 + (i % 2) * 3, iy + 2 + Math.floor(i / 2) * 3, 2, 2)); }
    else if (r.kind === 'qa') { R(wh, ix, iy, 10, 10); R('#3aa060', ix + 2, iy + 5, 2, 2); R('#3aa060', ix + 4, iy + 7, 2, 1); R('#3aa060', ix + 6, iy + 3, 2, 4); }
    else if (k.part) { R('#1b1420', ix - 1, iy - 1, 12, 12); R(DATA.parts[k.part].col, ix, iy, 10, 10); }
    if (r.busy && !ghost) R(Math.sin(t * 10) > 0 ? k.top : '#fff', px + 19, py + 9, 2, 2);
    g.globalAlpha = 1;
  },
  carry(c, x, y) {
    const R = Render.rect, k = c.carry; if (!k) return;
    if (k.slip) { R('#2b1d2c', x - 3, y - 5, 7, 7); R('#e9e2cc', x - 2, y - 4, 5, 5); R('#6b6258', x - 1, y - 3, 3, 1); R('#6b6258', x - 1, y - 1, 3, 1); }
    else if (k.part) { R('#2b1d2c', x - 3, y - 4, 6, 6); R(DATA.parts[k.part].col, x - 2, y - 3, 4, 4); }
    else if (k.result) { R('#2b1d2c', x - 4, y - 5, 8, 7); R('#ffe27a', x - 3, y - 4, 6, 5); R('#c8a040', x - 3, y - 2, 6, 1); }
  },
  crew(c, t) {
    const R = Render.rect, g = Render.ctx, moving = c.path.length > 0;
    const fr = moving ? Math.floor(t * 8 + c.ph) % 2 : c.st === 'work' ? Math.floor(t * 5) % 2 : 0;
    const img = Render.critter(c.tint, fr), x = Math.round(c.x - 8), y = Math.round(c.y - 16);
    R('rgba(0,0,0,.3)', x + 3, y + 15, 10, 2);
    if (c.face < 0) { g.save(); g.translate(x + 16, y); g.scale(-1, 1); g.drawImage(img, 0, 0); g.restore(); } else g.drawImage(img, x, y);
    Render.carry(c, Math.round(c.x), y);
    if (c.role) { const role = Teams.roleOf(c.role); const col = role.part ? DATA.parts[role.part].col : role.job === 'asm' ? '#a8e0a8' : '#8ac8ff'; R('#1b1420', x + 1, y + 1, 4, 4); R(col, x + 2, y + 2, 2, 2); }
    if (c.st === 'stuck') { R('#fff', x + 11, y - 9, 7, 8); R('#ff5a5a', x + 14, y - 8, 1, 4); R('#ff5a5a', x + 14, y - 3, 1, 1); }
    else if (c.st === 'idle' && c.why && !moving) { const b = Math.floor(t * 2 % 2); R('#9a93ad', x + 12, y - 5 - b, 3, 1); R('#9a93ad', x + 14, y - 4 - b, 1, 1); R('#9a93ad', x + 12, y - 3 - b, 3, 1); }
  },
  fx(t) {
    const R = Render.rect;
    for (const f of World.fx) { const q = f.t / f.life;
      if (f.k === 'spark') R(f.col, Math.round(f.x), Math.round(f.y - q * 6), 1, 1);
      else if (f.k === 'pop') R(f.col, Math.round(f.x - 1), Math.round(f.y - q * 10), 3, 3);
      else if (f.k === 'x') { const x = Math.round(f.x), y = Math.round(f.y - q * 6); for (let k = -2; k <= 2; k++) { R('#ff5a5a', x + k, y + k, 1, 1); R('#ff5a5a', x + k, y - k, 1, 1); } } }
  },
  frame(t) {
    const g = Render.ctx;
    for (let y = 0; y < G.h; y++) for (let x = 0; x < G.w; x++) { Render.tile(x, y); if (Path.isRoad(x, y)) Render.road(x, y); }
    const [hx, hy] = Edit.hover;
    if ((Edit.tool !== 'sel' || Edit.held) && Path.inb(hx, hy)) { g.strokeStyle = Edit.held ? (Edit.canPlace(hx, hy) ? '#7fe0d0' : '#ff5a5a') : Edit.tool === 'road' ? '#7fe0d0' : '#ff8a7a'; g.strokeRect(hx * TILE + .5, hy * TILE + .5, TILE - 1, TILE - 1); }
    for (const r of World.rooms) if (!r.held) Render.room(r, t);
    // 접수함 아래 주문서 더미
    const inn = Jobs.room('in'), n = Derive.inboxList().length; for (let i = 0; i < n; i++) { const x = inn.x * TILE + 3 + (i % 4) * 5, y = inn.y * TILE + 26 + Math.floor(i / 4) * 5; Render.rect('#2b1d2c', x - 1, y - 1, 5, 5); Render.rect('#e9e2cc', x, y, 3, 3); }
    if (n >= World.S.inboxCap - DATA.inbox.warnBefore) { g.strokeStyle = Math.sin(t * 12) > 0 ? '#ff5a5a' : '#ffb0a0'; g.lineWidth = 2; g.strokeRect(inn.x * TILE + 1, inn.y * TILE + 1, TILE - 2, TILE - 2); g.lineWidth = 1; }
    for (const r of World.rooms) r.queue.forEach((c, i) => { if (i > 0) c.x += ((Math.floor(c.x / TILE) * TILE + 12 - i * 3) - c.x) * .15; });
    for (const c of [...World.crew].sort((a, b) => a.y - b.y)) Render.crew(c, t);
    Render.fx(t);
    if (Edit.held && Path.inb(hx, hy)) Render.room({ ...Edit.held, x: hx, y: hy }, t, true);
  },
};
