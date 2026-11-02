// ═════════ 그림(캔버스) ═════════
// 판, 길, 방, 꼬물이, 들고 있는 것, 효과. 글자는 UI(HTML)가 맡는다.
// 기질은 이모지가 아니라 몸에 붙은 도트 소품으로 보여 준다(안경, 선글라스, 수면 모자, 머리띠, 입).
const Render = {
  ctx: null, spr: {},
  init(cv) { Render.ctx = cv.getContext('2d'); },
  rect(c, x, y, w, h) { const g = Render.ctx; g.fillStyle = c; g.fillRect(x, y, w, h); },
  // 작은 도트 그림: 문자열 한 줄 = 한 줄 픽셀, '#' = 칠함
  glyph(rows, x, y, col, out) {
    const R = Render.rect;
    if (out) rows.forEach((row, j) => [...row].forEach((ch, i) => { if (ch === '#') R(out, x + i - 1, y + j - 1, 3, 3); }));
    rows.forEach((row, j) => [...row].forEach((ch, i) => { if (ch === '#') R(col, x + i, y + j, 1, 1); }));
  },
  G: {
    star: ['..#..', '.###.', '#####', '.###.', '.#.#.'],
    bang: ['#', '#', '#', '.', '#'],
    cup: ['.#.#', '#.#.', '....', '###.', '####', '###.'],
    note: ['..##', '..#.', '..#.', '###.', '##..'],
    heart: ['.#.#.', '#####', '#####', '.###.', '..#..'],
    knock: ['#...#', '.#.#.', '..#..', '.#.#.', '#...#'],
  },
  // !환각 말풍선: 빨간 바탕에 흰 느낌표(막힘 표시는 흰 바탕에 빨간 느낌표)
  halBubble(x, y, on) { const R = Render.rect; R('#1b1420', x - 1, y - 1, 7, 10); R(on ? '#ff4d6d' : '#c02848', x, y, 5, 8); R('#fff', x + 2, y + 1, 1, 4); R('#fff', x + 2, y + 6, 1, 1); R(on ? '#ff4d6d' : '#c02848', x, y + 8, 2, 2); },
  // 16px 꼬물이: 코드로 찍고 색·프레임·기질별로 캐시
  critter(tint, frame, quirk) {
    const key = tint + frame + quirk; if (Render.spr[key]) return Render.spr[key];
    const s = 16, cv = document.createElement('canvas'); cv.width = s; cv.height = s; const x = cv.getContext('2d');
    const px = (a, b, col) => { x.fillStyle = col; x.fillRect(a, b, 1, 1); }, box = (a, b, w, h, col) => { x.fillStyle = col; x.fillRect(a, b, w, h); };
    const bot = 13, top = 3, cx = 7.5, rx = 6.4, ry = (bot - top) / 2 + 0.4, cy = top + ry - 0.4 + (frame ? 0.5 : 0);
    const ins = (i, j) => ((i - cx) / rx) ** 2 + ((j - cy) / ry) ** 2 <= 1;
    for (let j = 0; j < s; j++) for (let i = 0; i < s; i++) { if (!ins(i, j)) continue; const edge = !ins(i - 1, j) || !ins(i + 1, j) || !ins(i, j - 1) || !ins(i, j + 1); px(i, j, edge ? '#2b1d2c' : tint); if (!edge && j > cy + ry * 0.35) px(i, j, 'rgba(0,0,0,.18)'); if (!edge && i < cx - 1 && j < cy - ry * 0.35) px(i, j, 'rgba(255,255,255,.28)'); }
    const ey = Math.round(cy - 1), ax = 8 + (frame ? 1 : 0);
    box(4, ey, 2, 3, '#1b1420'); box(10, ey, 2, 3, '#1b1420');
    box(2, ey + 3, 1, 1, '#f08a7a'); box(13, ey + 3, 1, 1, '#f08a7a');
    box(4, 14, 2, frame === 0 ? 1 : 2, '#2b1d2c'); box(10, 14, 2, frame === 1 ? 1 : 2, '#2b1d2c');
    if (quirk === 'dreamer') {          // 수면 모자(더듬이 대신)
      box(5, 3, 7, 1, '#6a4ab0'); box(6, 2, 5, 1, '#8a6ad0'); box(8, 1, 3, 1, '#8a6ad0'); px(11, 0, '#f4f1ff'); px(10, 1, '#f4f1ff');
    } else {
      box(ax, 0, 1, 3, '#2b1d2c'); px(ax, 0, '#7fe0d0');
    }
    if (quirk === 'auditor') {          // 동그란 안경
      const f = '#f4f1ff'; box(3, ey - 1, 4, 1, f); box(3, ey + 3, 4, 1, f); box(3, ey, 1, 3, f); box(6, ey, 1, 3, f);
      box(9, ey - 1, 4, 1, f); box(9, ey + 3, 4, 1, f); box(9, ey, 1, 3, f); box(12, ey, 1, 3, f); box(7, ey, 2, 1, f);
    } else if (quirk === 'loner') {     // 선글라스
      box(3, ey, 10, 2, '#0e0c14'); px(4, ey, '#6a6680'); px(10, ey, '#6a6680');
    } else if (quirk === 'chatty') {    // 동그랗게 벌린 입
      box(7, ey + 3, 2, 2, '#b04060'); px(7, ey + 3, '#ff9ab0');
    } else if (quirk === 'sprinter') {  // 빨간 머리띠
      for (let i = 1; i < 15; i++) if (ins(i, 4)) px(i, 4, '#ff5a5a'); px(14, 5, '#ff5a5a'); px(15, 6, '#ff5a5a');
    }
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
  // Lv.2 탕비실의 커피 향 범위(무정차 충전 구역)
  aura(r, t) {
    const R = DATA.energy.auraRange, g = Render.ctx; g.fillStyle = `rgba(216,160,112,${0.07 + 0.03 * Math.sin(t * 3)})`;
    for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) if (Math.abs(dx) + Math.abs(dy) <= R && Path.isRoad(r.x + dx, r.y + dy)) g.fillRect((r.x + dx) * TILE + 2, (r.y + dy) * TILE + 2, TILE - 4, TILE - 4);
  },
  // 방: 윗면 색 + 기호. 부품 방은 만드는 부품 색 네모가 크게 들어간다(아래 범례와 같은 색). Lv.2는 위층 판이 겹쳐 보인다
  room(r, t, ghost) {
    const R = Render.rect, g = Render.ctx, k = DATA.rooms[r.kind], px = r.x * TILE, py = r.y * TILE, wh = '#f4f1ff';
    g.globalAlpha = ghost ? .55 : 1;
    if (r.lv >= 2) { R('rgba(0,0,0,.4)', px + 4, py, 19, 4); R(k.top, px + 3, py - 2, 18, 3); }
    R('rgba(0,0,0,.4)', px + 2, py + 3, 21, 21); R(k.col, px + 1, py + 1, 22, 21); R(k.top, px + 1, py + 1, 22, 5); R('rgba(0,0,0,.3)', px + 1, py + 6, 22, 1);
    if (r.lv >= 2) { R('#1b1420', px + 16, py + 2, 6, 3); R(wh, px + 17, py + 3, 1, 1); R(wh, px + 20, py + 3, 1, 1); }
    const ix = px + 7, iy = py + 9;
    if (r.kind === 'in') { R(wh, ix, iy + 2, 10, 7); R(k.col, ix + 2, iy + 4, 6, 1); }
    else if (r.kind === 'out') { R(wh, ix + 1, iy, 8, 6); R(wh, ix + 4, iy + 6, 2, 2); R(wh, ix + 2, iy + 8, 6, 1); }
    else if (r.kind === 'asm') { R('#c8a878', ix, iy - 1, 10, 11); R(wh, ix + 1, iy + 1, 8, 8); ['#8ac8ff', '#ff9ad0', '#f0e070', '#f4f1ff'].forEach((c, i) => R(c, ix + 2 + (i % 2) * 3, iy + 2 + Math.floor(i / 2) * 3, 2, 2)); }
    else if (r.kind === 'qa') { R(wh, ix, iy, 10, 10); R('#3aa060', ix + 2, iy + 5, 2, 2); R('#3aa060', ix + 4, iy + 7, 2, 1); R('#3aa060', ix + 6, iy + 3, 2, 4); }
    else if (r.kind === 'pantry') { R('#1b1420', ix, iy - 1, 10, 11); R('#6a6680', ix + 1, iy, 8, 4); R('#ff5a5a', ix + 2, iy + 1, 1, 1); R(wh, ix + 3, iy + 6, 4, 3); R('#8a5a3a', ix + 4, iy + 6, 2, 1); R(wh, ix + 7, iy + 7, 1, 1); if (!ghost && Math.sin(t * 4) > 0) R('rgba(255,255,255,.6)', ix + 4, iy + 4 - (t * 4 % 2 | 0), 1, 1); }
    else if (k.part) { R('#1b1420', ix - 1, iy - 1, 12, 12); R(DATA.parts[k.part].col, ix, iy, 10, 10); }
    if (r.workers.length && !ghost) R(Math.sin(t * 10) > 0 ? k.top : '#fff', px + 19, py + 9, 2, 2);
    g.globalAlpha = 1;
  },
  // 들고 있는 것: 주문서 / 부품(★ 금테, ! 빨간 테 + 느낌표) / 상자(일반 노랑, 명작 무지개 테, 오류 빨강)
  carry(c, x, y, t) {
    const R = Render.rect, k = c.carry; if (!k) return;
    const blink = Math.sin(t * 9 + c.i) > 0;
    if (k.slip) { R('#2b1d2c', x - 3, y - 5, 7, 7); R('#e9e2cc', x - 2, y - 4, 5, 5); R('#6b6258', x - 1, y - 3, 3, 1); R('#6b6258', x - 1, y - 1, 3, 1); return; }
    if (k.part) {
      const tg = k.tag, edge = tg === 'inspired' ? DATA.tags.inspired.col : tg === 'hallucinated' ? DATA.tags.hallucinated.col : '#2b1d2c';
      R(edge, x - 3, y - 4, 6, 6); R(DATA.parts[k.part].col, x - 2, y - 3, 4, 4);
      if (tg === 'inspired' && blink) R('#fff', x + 2, y - 6, 1, 1);
      if (tg === 'hallucinated') Render.halBubble(x + 4, y - 14, blink);
      return;
    }
    const tg = k.result.tag || 'normal', B = DATA.box;
    const edge = tg === 'inspired' ? B.rainbow[Math.floor(t * 8) % B.rainbow.length] : '#2b1d2c';
    R(edge, x - 4, y - 5, 8, 7); R(B[tg], x - 3, y - 4, 6, 5); R(tg === 'hallucinated' ? '#7a1a2a' : '#c8a040', x - 3, y - 2, 6, 1);
    if (tg === 'hallucinated') Render.halBubble(x + 4, y - 15, blink);
    if (tg === 'inspired' && blink) Render.glyph(Render.G.star, x - 2, y - 12, '#ffe27a', '#1b1420');
  },
  crew(c, t) {
    const R = Render.rect, g = Render.ctx, moving = c.path.length > 0;
    const fr = moving ? Math.floor(t * 8 + c.ph) % 2 : c.st === 'work' ? Math.floor(t * 5) % 2 : 0;
    const img = Render.critter(c.tint, fr, c.quirk), x = Math.round(c.x - 8), y = Math.round(c.y - 16);
    // 들고 있는 것의 상태가 발밑 빛으로 보인다: !환각 = 빨강 맥박, ★영감 = 금빛
    const k = c.carry, tg = k && (k.part ? k.tag : k.result && k.result.tag), pulse = Math.sin(t * 8 + c.i) > 0;
    if (tg === 'hallucinated') { R(pulse ? 'rgba(255,77,109,.85)' : 'rgba(255,77,109,.45)', x + 1, y + 14, 14, 3); R('rgba(255,77,109,.35)', x - 1, y + 15, 18, 2); }
    else if (tg === 'inspired') { R(pulse ? 'rgba(255,226,122,.8)' : 'rgba(255,226,122,.45)', x + 1, y + 14, 14, 3); }
    else R('rgba(0,0,0,.3)', x + 3, y + 15, 10, 2);
    if (Crew.rushOn(c)) for (let k = 0; k < 3; k++) R(k % 2 ? '#ffd040' : '#ff7a3a', x + 2 + ((t * 20 + k * 5) % 12 | 0), y + 13 - ((t * 9 + k) % 3 | 0), 1, 2);   // 벼락치기 불꽃
    if (c.buff.praise || c.buff.chat || c.buff.coffee) { const col = c.buff.praise ? '#ff9ab0' : c.buff.chat ? '#ffb0d8' : '#d8a070'; if (Math.sin(t * 12 + c.i) > .3) R(col, x + (t * 30 % 14 | 0), y + 2, 1, 1); }
    if (c.face < 0) { g.save(); g.translate(x + 16, y); g.scale(-1, 1); g.drawImage(img, 0, 0); g.restore(); } else g.drawImage(img, x, y);
    Render.carry(c, Math.round(c.x), y, t);
    if (c.role) { const role = Teams.roleOf(c.role); const col = role.part ? DATA.parts[role.part].col : role.job === 'asm' ? '#a8e0a8' : '#8ac8ff'; R('#1b1420', x + 1, y + 1, 4, 4); R(col, x + 2, y + 2, 2, 2); }
    if (c.energy <= 0 && !c.carry) Render.glyph(Render.G.cup, x + 12, y - 5, '#d8a070', '#1b1420');   // 카페인 바닥
    if (c.st === 'stuck') { R('#fff', x + 11, y - 9, 7, 8); R('#ff5a5a', x + 14, y - 8, 1, 4); R('#ff5a5a', x + 14, y - 3, 1, 1); }
    else if (c.st === 'idle' && c.why && !moving && c.energy > 0) { const b = Math.floor(t * 2 % 2); R('#9a93ad', x + 12, y - 5 - b, 3, 1); R('#9a93ad', x + 14, y - 4 - b, 1, 1); R('#9a93ad', x + 12, y - 3 - b, 3, 1); }
  },
  fx(t) {
    const R = Render.rect, Gl = Render.G;
    for (const f of World.fx) { const q = f.t / f.life, x = Math.round(f.x), y = Math.round(f.y - q * 8);
      if (f.k === 'spark') R(f.col, Math.round(f.x), Math.round(f.y - q * 6), 1, 1);
      else if (f.k === 'pop') R(f.col, x - 1, Math.round(f.y - q * 10), 3, 3);
      else if (f.k === 'star') Render.glyph(Gl.star, x - 2, y, '#ffe27a', '#1b1420');
      else if (f.k === 'bang') Render.glyph(Gl.bang, x, y, '#ff4d6d', '#fff');
      else if (f.k === 'cup') Render.glyph(Gl.cup, x - 2, y, '#d8a070', '#1b1420');
      else if (f.k === 'note') Render.glyph(Gl.note, x - 2 + Math.round(Math.sin(q * 9) * 2), y, '#ffb0d8', '#1b1420');
      else if (f.k === 'heart') Render.glyph(Gl.heart, x - 2, y, '#ff6a8a', '#fff');
      else if (f.k === 'knock') Render.glyph(Gl.knock, x - 2, Math.round(f.y) - 4, q < .5 ? '#fff' : '#ffe27a', '#1b1420');
      else if (f.k === 'burst') { const rr = 3 + q * 12, B = DATA.box.rainbow; for (let k = 0; k < 8; k++) { const a = k / 8 * Math.PI * 2 + q; R(B[k % B.length], Math.round(f.x + Math.cos(a) * rr), Math.round(f.y + 6 + Math.sin(a) * rr * .7), 2, 2); } }
    }
  },
  frame(t) {
    const g = Render.ctx;
    for (let y = 0; y < G.h; y++) for (let x = 0; x < G.w; x++) { Render.tile(x, y); if (Path.isRoad(x, y)) Render.road(x, y); }
    for (const r of World.rooms) if (!r.held && r.kind === 'pantry' && r.lv >= 2) Render.aura(r, t);
    const [hx, hy] = Edit.hover;
    if ((Edit.tool !== 'sel' || Edit.held) && Path.inb(hx, hy)) { g.strokeStyle = Edit.held ? (Edit.stackTarget(hx, hy) ? '#ffe27a' : Edit.canPlace(hx, hy) ? '#7fe0d0' : '#ff5a5a') : Edit.tool === 'road' ? '#7fe0d0' : '#ff8a7a'; g.strokeRect(hx * TILE + .5, hy * TILE + .5, TILE - 1, TILE - 1); }
    // 들고 있는 방과 같은 방은 노란 테두리로 "여기 겹치면 증축" 표시
    if (Edit.held) for (const r of World.rooms) if (!r.held && r.kind === Edit.held.kind && !DATA.rooms[r.kind].fixed && r.lv + Edit.held.lv <= DATA.stack.maxLv && Math.sin(t * 6) > 0) { g.strokeStyle = '#ffe27a'; g.strokeRect(r.x * TILE + 1.5, r.y * TILE + 1.5, TILE - 3, TILE - 3); }
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
