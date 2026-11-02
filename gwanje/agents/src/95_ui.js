// ═════════ 화면(HTML) ═════════
// 읽어야 하는 정보는 모두 HTML 글자로: 목표 카드, 주문 카드, 조립실 진행판, 분업판, 꼬물이 목록, 툴팁, 하루 보고.
const $ = id => document.getElementById(id);
const chip = (p, filled = true) => `<i class="chip${filled ? '' : ' empty'}" style="--c:${DATA.parts[p].col}">${DATA.parts[p].ch}</i>`;
const recipeChips = r => Object.entries(DATA.recipes[r].parts).map(([p, n]) => Array.from({ length: n }, () => chip(p)).join('')).join('');
const UI = {
  ticker(s) { $('ticker').innerHTML = s; },
  tools() { for (const [id, t] of [['tSel', 'sel'], ['tRoad', 'road'], ['tErase', 'erase']]) $(id).classList.toggle('on', Edit.tool === t); $('tSpeed').innerHTML = `<kbd>F</kbd>빠르게 ×${World.S.speed}`; $('tPause').innerHTML = `<kbd>Space</kbd>${World.S.paused ? '계속' : '멈춤'}`; },
  hud() {
    const S = World.S, m = Flow.metrics();
    $('day').textContent = `${S.day}일째`; $('done').textContent = m.done;
    $('avg').textContent = m.avg == null ? '-' : m.avg.toFixed(1) + '초'; $('qual').textContent = m.qual == null ? '-' : Math.round(m.qual * 100) + '%'; $('cost').textContent = m.cost;
    $('dayFill').style.width = Math.min(100, (S.t - (S.day - 1) * DATA.day.length) / DATA.day.length * 100) + '%';
    const idle = World.crew.filter(c => c.st === 'idle' && c.why).length;
    $('inv').innerHTML = `남은 길 <b>${S.roads}</b>칸 · 꼬물이 <b>${World.crew.length}</b>${idle ? ` (노는 ${idle})` : ''}${World.toPlace.length ? ` · 놓을 방 <b>${World.toPlace.length}</b>` : ''}`;
    const md = $('mode'), h = Edit.held; md.hidden = !h && !S.paused && Edit.tool === 'sel';
    md.textContent = h ? `${DATA.rooms[h.kind].n} 놓을 칸을 누르세요${h.from ? ' (Esc 취소)' : ''}` : S.paused ? '멈춤' : Edit.tool === 'road' ? '길 깔기: 누르거나 끌기' : '길 지우기: 누르거나 끌기';
  },
  // 목표: 주문마다 칩과 진행 칸, 보상
  goal() {
    const S = World.S, g = DATA.goals[S.goal];
    if (!g) { $('goal').innerHTML = '<span class="gl">목표</span><b>모두 달성</b>'; return; }
    $('goal').innerHTML = `<span class="gl">다음 목표</span>` + Object.entries(g.need).map(([r, n]) => { const v = Math.min(n, S.delivered[r] || 0); return `<span class="gi"><b>${DATA.recipes[r].n}</b> ${recipeChips(r)} <span class="cnt">${v}/${n}</span><span class="mini"><i style="width:${v / n * 100}%"></i></span></span>`; }).join('') + `<span class="gr">열림 → ${g.n}</span>`;
  },
  // 주문 카드: 무엇이 몇 개 필요한지 색 칩으로
  recipes() {
    $('recipes').innerHTML = World.S.recipes.map(r => `<div class="rc"><b>${DATA.recipes[r].n}</b><span>${recipeChips(r)}</span></div>`).join('') +
      `<div class="rc how">${Object.keys(DATA.parts).filter(p => World.rooms.some(x => x.kind === DATA.parts[p].room)).map(p => `${chip(p)} ${DATA.rooms[DATA.parts[p].room].n}`).join(' · ')} → 조립실에서 조립 → 검수대 → 발송구</div>`;
  },
  // 판 위 글자: 방 이름, 줄, 조립실 진행판, 접수함 개수, 막힘
  overlays() {
    const pct = (x, y) => `left:${x / W * 100}%;top:${y / H * 100}%`;
    let h = '';
    for (const r of World.rooms) {
      if (r.held) continue; const cx = r.x * TILE + 12;
      h += `<div class="lab" style="${pct(cx, r.y * TILE + TILE)}">${DATA.rooms[r.kind].n}</div>`;
      if (r.queue.length >= 2) h += `<div class="badge" style="${pct(cx, r.y * TILE)}">줄 ${r.queue.length}</div>`;
      if (r.kind === 'asm' && r.slots && r.slots.length) h += `<div class="board" style="${pct(cx, r.y * TILE)}">${r.slots.map(o => `<div><span>${DATA.recipes[o.r].n}</span>${Object.entries(o.need).map(([p, n]) => Array.from({ length: n }, (_, i) => chip(p, i < (o.have[p] || 0))).join('')).join('')}${o.state === 'toAsm' ? '<em>오는 중</em>' : ''}</div>`).join('')}</div>`;
    }
    const inn = Jobs.room('in'), n = Derive.inboxList().length, warn = n >= World.S.inboxCap - DATA.inbox.warnBefore;
    h += `<div class="badge ${warn ? 'hot' : 'inbox'}" style="${pct(inn.x * TILE + 12, inn.y * TILE)}">주문 ${n}/${World.S.inboxCap}${warn ? ' 곧 넘침' : ''}</div>`;
    const st = World.crew.find(c => c.st === 'stuck'); if (st) h += `<div class="badge hot" style="${pct(st.x, st.y - 24)}">${st.why}</div>`;
    $('labels').innerHTML = h;
  },
  // 분업판 + 꼬물이 목록
  crewPanel() {
    const avail = Teams.available(), mode = Teams.mode;
    const modes = Object.entries(DATA.teamModes).map(([k, n]) => `<button type="button" data-mode="${k}" class="${mode === k ? 'on' : ''}">${n}</button>`).join('');
    const rows = mode === 'free' ? '<p class="hint">누구나 아무 일이나 합니다. 분업을 켜면 역할마다 인원을 나눕니다.</p>' : `<div class="roles">${avail.map(r => { const n = World.crew.filter(c => c.role === r.id).length; return `<div class="role"><span>${r.part ? chip(r.part) : ''}${r.n}</span>${mode === 'manual' ? `<button type="button" data-role="${r.id}" data-d="-1">−</button>` : ''}<b>${n}</b>${mode === 'manual' ? `<button type="button" data-role="${r.id}" data-d="1">+</button>` : ''}</div>`; }).join('')}</div>`;
    $('teams').innerHTML = `<div class="modes">${modes}</div>${rows}<p class="hint">꼬물이를 누르면 역할을 하나씩 바꿔 고정합니다. 한 바퀴 돌면 고정이 풀립니다. 머리 위 작은 색 점이 역할입니다.</p>`;
    $('teams').querySelectorAll('[data-mode]').forEach(b => b.onclick = () => { Teams.setMode(b.dataset.mode); UI.crewPanel(); });
    $('teams').querySelectorAll('[data-role]').forEach(b => b.onclick = () => { Teams.inc(b.dataset.role, +b.dataset.d); UI.crewPanel(); });
    UI.crewList();
  },
  crewList() {
    $('crew').innerHTML = World.crew.map(c => {
      const top = Object.entries(c.skill).sort((a, b) => b[1] - a[1])[0], star = top ? Derive.star(c, top[0]) : 0;
      const role = c.role ? Teams.roleOf(c.role).n + (c.pinned ? ' 고정' : '') : '자유';
      const cls = c.st === 'stuck' ? 'stuck' : c.st === 'idle' && c.why ? 'idle' : '';
      return `<button type="button" data-i="${c.i}"><b style="color:${c.tint}">${c.name}</b><span class="rl">${role}${star ? ` · ${DATA.rooms[top[0]].n.slice(0, 2)}★${star}` : ''}</span><span class="${cls}">${UI.doing(c)}</span></button>`;
    }).join('');
    $('crew').querySelectorAll('[data-i]').forEach(b => b.onclick = () => { Teams.cyclePin(World.crew[+b.dataset.i]); UI.crewPanel(); });
  },
  doing(c) {
    if (c.st === 'stuck') return c.why; if (c.st === 'queue') return `${DATA.rooms[c.room.kind].n} 줄`;
    if (c.st === 'work') return `${DATA.rooms[c.room.kind].n}에서 일함`;
    if (c.st === 'walk' || c.st === 'enter') { const k = c.carry; return k ? (k.part ? `${DATA.parts[k.part].n} 나름` : k.slip ? '주문서 나름' : '결과물 나름') : `${DATA.rooms[c.room.kind].n}로`; }
    return c.why || '쉼';
  },
  // 툴팁: 방이나 꼬물이 위에 마우스를 올리면
  tooltip(px, py, cx, cy) {
    const tip = $('tip'); let html = '';
    const c = World.crew.find(c => Math.abs(c.x - px) < 8 && Math.abs(c.y - 8 - py) < 9);
    const [tx, ty] = [Math.floor(px / TILE), Math.floor(py / TILE)], r = Path.roomAt(tx, ty);
    if (c) html = `<b>${c.name}</b> · ${c.role ? Teams.roleOf(c.role).n : '자유'}<br>${UI.doing(c)}<br>${Object.entries(c.skill).map(([k, v]) => `${DATA.rooms[k].n} ★${Derive.star(c, k)} (${v}번)`).join(', ') || '아직 숙련 없음'}`;
    else if (r) { const k = DATA.rooms[r.kind]; html = `<b>${k.n}</b><br>${k.d}${k.work ? `<br>기본 ${k.work}초 · 지금 일함 ${r.busy ? 1 : 0}, 줄 ${r.queue.length}` : ''}${r.kind === 'asm' ? `<br>맡은 주문 ${r.slots.length}/${DATA.asm.slots}${r.reject.size ? ` · 안 받음: ${[...r.reject].map(x => DATA.recipes[x].n).join(', ')}` : ''}` : ''}`; }
    tip.hidden = !html; if (html) { tip.innerHTML = html; tip.style.left = Math.min(70, cx) + '%'; tip.style.top = Math.min(80, cy + 4) + '%'; }
  },
  openPop(r) {
    const p = $('pop'), k = DATA.rooms[r.kind];
    let body = `<i>${k.d}</i>`;
    if (r.kind === 'asm') body += `<div>받을 주문 <i>(끄면 이 조립실은 그 주문을 안 받음)</i></div><div class="row">${World.S.recipes.map(x => `<button type="button" data-r="${x}" class="${r.reject.has(x) ? '' : 'on'}">${DATA.recipes[x].n}</button>`).join('')}</div>`;
    p.innerHTML = `<b>${k.n}</b>${body}<div class="row">${k.fixed ? '<i>고정된 칸</i>' : '<button type="button" data-a="move">옮기기</button>'}<button type="button" data-a="close">닫기</button></div>`;
    p.style.left = Math.min(62, (r.x * TILE + TILE) / W * 100) + '%'; p.style.top = Math.min(55, r.y * TILE / H * 100) + '%'; p.hidden = false;
    p.querySelectorAll('[data-r]').forEach(b => b.onclick = () => { Edit.toggleReject(r, b.dataset.r); UI.openPop(r); });
    p.querySelectorAll('[data-a]').forEach(b => b.onclick = () => { if (b.dataset.a === 'move') Edit.lift(r); else UI.closePop(); });
  },
  closePop() { $('pop').hidden = true; },
  report(m, y, b, diag, pick) {
    const fmt = { done: v => v + '개', avg: v => v.toFixed(1) + '초', qual: v => Math.round(v * 100) + '%', cost: v => v };
    const better = { done: (a, b) => a > b, avg: (a, b) => a < b, qual: (a, b) => a > b, cost: (a, b) => a < b };
    const rowsDef = [['done', '처리한 주문'], ['avg', '평균 걸린 시간 (속도)'], ['qual', '검수 통과율 (품질)'], ['cost', `유지비 (길 + 방×${DATA.upkeep.room})`]];
    const cell = (v, f) => v == null ? '-' : f(v);
    const rows = rowsDef.map(([k, n]) => { const v = m[k], yv = y && y[k]; const arrow = v == null || yv == null || v === yv ? '' : better[k](v, yv) ? ' <span class="up">▲</span>' : ' <span class="down">▼</span>'; return `<tr><td>${n}</td><td>${cell(v, fmt[k])}${arrow}</td><td>${y ? cell(yv, fmt[k]) : '-'}</td><td>${b ? cell(b[k], fmt[k]) : '-'}</td></tr>`; }).join('');
    $('rep').innerHTML = `<h2>${World.S.day}일째 보고</h2><table><tr><th>지표</th><th>오늘</th><th>어제</th><th>최고</th></tr>${rows}<tr><td>놓친 주문</td><td>${m.lost}</td><td>${y ? y.lost : '-'}</td><td></td></tr></table>
      <p class="diag">${diag}</p><p>하나를 고르세요 (1, 2). 강한 카드일수록 길이 적게 옵니다.</p>
      <div class="cards">${pick.map((c, i) => `<button type="button" class="card" data-i="${i}"><b>${i + 1}. ${c.n}</b><i>${c.d || (c.room ? '방 하나를 더 놓을 수 있다' : '길을 넉넉히')}</i></button>`).join('')}</div>`;
    $('repOv').hidden = false; $('rep').querySelectorAll('.card').forEach(bt => bt.onclick = () => Flow.choose(pick[+bt.dataset.i]));
  },
  hideReport() { $('repOv').hidden = true; },
};
