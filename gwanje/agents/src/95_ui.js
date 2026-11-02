// ═════════ 화면(HTML) ═════════
// 읽어야 하는 정보는 모두 HTML 글자로: 목표 카드, 주문 카드, 조립실 진행판, 분업판, 꼬물이 목록, 툴팁, 방송 띠, 하루 보고.
const $ = id => document.getElementById(id);
const tagCls = { inspired: ' ins', hallucinated: ' hal' };
const chip = (p, filled = true, tag) => `<i class="chip${filled ? '' : ' empty'}${tagCls[tag] || ''}" style="--c:${DATA.parts[p].col}">${DATA.parts[p].ch}</i>`;
const recipeChips = r => Object.entries(DATA.recipes[r].parts).map(([p, n]) => Array.from({ length: n }, () => chip(p)).join('')).join('');
const quirkTag = q => `<i class="qt" style="--c:${DATA.quirks[q].col}">${DATA.quirks[q].short}</i>`;
const UI = {
  // 방송 띠: 최근 몇 줄을 쌓아 보여 준다(단골 반응, 사고, 명작)
  log(s, cls = '') { World.log.unshift({ s, cls }); World.log.length = Math.min(World.log.length, 5); $('ticker').innerHTML = World.log.map((l, i) => `<div class="${l.cls}${i ? ' old' : ''}">${l.s}</div>`).join(''); },
  tools() { for (const [id, t] of [['tSel', 'sel'], ['tRoad', 'road'], ['tErase', 'erase']]) $(id).classList.toggle('on', Edit.tool === t); $('tSpeed').innerHTML = `<kbd>F</kbd>빠르게 ×${World.S.speed}`; $('tPause').innerHTML = `<kbd>Space</kbd>${World.S.paused ? '계속' : '멈춤'}`; },
  hud() {
    const S = World.S, m = Flow.metrics();
    $('day').textContent = `${S.day}일째`; $('done').textContent = m.done; $('master').textContent = m.master;
    $('avg').textContent = m.avg == null ? '-' : m.avg.toFixed(1) + '초'; $('trust').textContent = m.trust == null ? '-' : Math.round(m.trust * 100) + '%'; $('cost').textContent = m.cost;
    $('trust').classList.toggle('bad', m.oops > 0);
    const ph = (S.t - (S.day - 1) * DATA.day.length) / DATA.day.length;
    $('dayFill').style.width = Math.min(100, ph * 100) + '%'; $('daybar').classList.toggle('rush', Derive.rush());
    const idle = World.crew.filter(c => c.st === 'idle' && c.why).length;
    $('inv').innerHTML = `남은 길 <b>${S.roads}</b>칸 · 꼬물이 <b>${World.crew.length}</b>${idle ? ` (노는 ${idle})` : ''}${World.toPlace.length ? ` · 놓을 방 <b>${World.toPlace.length}</b>` : ''}`;
    $('poke').innerHTML = S.pokeCd > 0 ? `손 쉬는 중 ${Math.ceil(S.pokeCd)}초` : '<b>꼬물이를 눌러 보세요</b> · !환각 든 애는 꿀밤, 나머지는 칭찬';
    $('poke').classList.toggle('ready', S.pokeCd <= 0);
    const md = $('mode'), h = Edit.held; md.hidden = !h && !S.paused && Edit.tool === 'sel';
    md.textContent = h ? `${DATA.rooms[h.kind].n} 놓을 칸을 누르세요 (같은 방 위 = 증축)${h.from ? ' · Esc 취소' : ''}` : S.paused ? '멈춤' : Edit.tool === 'road' ? '길 깔기: 누르거나 끌기' : '길 지우기: 누르거나 끌기';
  },
  // 목표: 주문마다 칩과 진행 칸, 보상
  goal() {
    const S = World.S, g = DATA.goals[S.goal];
    if (!g) { $('goal').innerHTML = '<span class="gl">목표</span><b>모두 달성</b>'; return; }
    $('goal').innerHTML = `<span class="gl">다음 목표</span>` + Object.entries(g.need).map(([r, n]) => { const v = Math.min(n, S.delivered[r] || 0); return `<span class="gi"><b>${DATA.recipes[r].n}</b> ${recipeChips(r)} <span class="cnt">${v}/${n}</span><span class="mini"><i style="width:${v / n * 100}%"></i></span></span>`; }).join('') + `<span class="gr">★명작은 2칸 · 열림 → ${g.n}</span>`;
  },
  // 주문 카드: 무엇이 몇 개 필요한지 색 칩으로
  recipes() {
    $('recipes').innerHTML = World.S.recipes.map(r => `<div class="rc"><b>${DATA.recipes[r].n}</b><span>${recipeChips(r)}</span></div>`).join('') +
      `<div class="rc how">${Object.keys(DATA.parts).filter(p => World.rooms.some(x => x.kind === DATA.parts[p].room)).map(p => `${chip(p)} ${DATA.rooms[DATA.parts[p].room].n}`).join(' · ')} → 조립실 → 검수대 → 발송구<br>${chip('doc', true, 'inspired')} ★영감 → 명작 상자 · ${chip('doc', true, 'hallucinated')} !환각 → 오류 상자(검수대가 고침)</div>`;
  },
  // 판 위 글자: 방 이름(층), 줄, 조립실 진행판(★/! 칩), 접수함 개수, 막힘
  overlays() {
    const pct = (x, y) => `left:${x / W * 100}%;top:${y / H * 100}%`;
    let h = '';
    for (const r of World.rooms) {
      if (r.held) continue; const cx = r.x * TILE + 12;
      h += `<div class="lab" style="${pct(cx, r.y * TILE + TILE)}">${DATA.rooms[r.kind].n}${r.lv > 1 ? `<em>Lv.${r.lv}</em>` : ''}</div>`;
      if (r.kind === 'qa' && r.queue.length >= DATA.qa.skipQueue - 1) h += `<div class="badge hot" style="${pct(cx, r.y * TILE)}">줄 ${r.queue.length} · 곧 건너뜀</div>`;
      else if (r.queue.length >= 2) h += `<div class="badge" style="${pct(cx, r.y * TILE)}">줄 ${r.queue.length}</div>`;
      if (r.kind === 'asm' && r.slots && r.slots.length) h += `<div class="board" style="${pct(cx, r.y * TILE)}">${r.slots.map(o => `<div><span>${DATA.recipes[o.r].n}</span>${Object.entries(o.need).map(([p, n]) => Array.from({ length: n }, (_, i) => chip(p, i < Derive.have(o, p), (o.got[p] || [])[i])).join('')).join('')}${o.state === 'toAsm' ? '<em>오는 중</em>' : ''}</div>`).join('')}</div>`;
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
    const rows = mode === 'free' ? '<p class="hint">누구나 아무 일이나 합니다. 분업을 켜면 역할마다 인원을 나눕니다(감사관은 조립·검수, 몽상가는 부품 방을 먼저).</p>' : `<div class="roles">${avail.map(r => { const n = World.crew.filter(c => c.role === r.id).length; return `<div class="role"><span>${r.part ? chip(r.part) : ''}${r.n}</span>${mode === 'manual' ? `<button type="button" data-role="${r.id}" data-d="-1">−</button>` : ''}<b>${n}</b>${mode === 'manual' ? `<button type="button" data-role="${r.id}" data-d="1">+</button>` : ''}</div>`; }).join('')}</div>`;
    $('teams').innerHTML = `<div class="modes">${modes}</div>${rows}<p class="hint">목록에서 이름을 누르면 역할을 하나씩 바꿔 고정합니다. 머리 위 작은 색 점이 역할입니다.</p>`;
    $('teams').querySelectorAll('[data-mode]').forEach(b => b.onclick = () => { Teams.setMode(b.dataset.mode); UI.crewPanel(); });
    $('teams').querySelectorAll('[data-role]').forEach(b => b.onclick = () => { Teams.inc(b.dataset.role, +b.dataset.d); UI.crewPanel(); });
    UI.crewList();
  },
  energy: c => `<i class="en">${Array.from({ length: DATA.energy.max }, (_, k) => k < c.energy ? '▮' : '▯').join('')}</i>`,
  crewList() {
    $('crew').innerHTML = World.crew.map(c => {
      const top = Object.entries(c.skill).sort((a, b) => b[1] - a[1])[0], star = top ? Derive.star(c, top[0]) : 0;
      const role = c.role ? Teams.roleOf(c.role).n + (c.pinned ? ' 고정' : '') : '자유';
      const cls = c.st === 'stuck' ? 'stuck' : c.st === 'idle' && c.why ? 'idle' : '';
      return `<button type="button" data-i="${c.i}"><b style="color:${c.tint}">${c.name}</b><span class="rl">${quirkTag(c.quirk)}${role}${star ? ` · ${DATA.rooms[top[0]].n.slice(0, 2)}★${star}` : ''} ${UI.energy(c)}</span><span class="${cls}">${UI.doing(c)}</span></button>`;
    }).join('');
    $('crew').querySelectorAll('[data-i]').forEach(b => b.onclick = () => { Teams.cyclePin(World.crew[+b.dataset.i]); UI.crewPanel(); });
  },
  doing(c) {
    if (c.st === 'stuck') return c.why; if (c.st === 'queue') return `${DATA.rooms[c.room.kind].n} 줄`;
    if (c.st === 'work') return c.act.what === 'coffee' ? '커피 마시는 중' : `${DATA.rooms[c.room.kind].n}에서 일함`;
    if (c.st === 'walk' || c.st === 'enter') {
      const k = c.carry, tg = k && (k.part ? k.tag : k.result && k.result.tag), mark = tg && tg !== 'normal' ? DATA.tags[tg].n + ' ' : '';
      return k ? (k.part ? `${mark}${DATA.parts[k.part].n} 나름` : k.slip ? '주문서 나름' : `${mark}상자 나름`) : c.job && c.job.type === 'coffee' ? '탕비실로' : `${DATA.rooms[c.room.kind].n}로`;
    }
    return c.why || '쉼';
  },
  // 툴팁: 방이나 꼬물이 위에 마우스를 올리면
  tooltip(px, py, cx, cy) {
    const tip = $('tip'); let html = '';
    const c = Crew.at(px, py);
    const [tx, ty] = [Math.floor(px / TILE), Math.floor(py / TILE)], r = Path.roomAt(tx, ty);
    if (c) { const q = DATA.quirks[c.quirk]; html = `<b>${c.name}</b> · ${q.n} · ${c.role ? Teams.roleOf(c.role).n : '자유'}<br><i>${q.d}</i><br>카페인 ${UI.energy(c)} · ${UI.doing(c)}<br>${Object.keys(c.skill).filter(k => Derive.star(c, k)).map(k => `${DATA.rooms[k].n} ★${Derive.star(c, k)}`).join(', ') || '숙련 쌓는 중'}`; }
    else if (r) {
      const k = DATA.rooms[r.kind];
      html = `<b>${k.n}${r.lv > 1 ? ' Lv.' + r.lv : ''}</b><br>${k.d}${k.work ? `<br>${DATA.lvText[r.lv]} · 지금 일함 ${r.workers.length}, 줄 ${r.queue.length}` : ''}`;
      if (r.kind === 'asm') html += `<br>맡은 주문 ${r.slots.length}/${Derive.slotsOf(r)} · ${DATA.prioModes[r.prio]}${r.reject.size ? `<br>안 받음: ${[...r.reject].map(x => DATA.recipes[x].n).join(', ')}` : ''}`;
      if (r.kind === 'qa') html += `<br>줄이 ${DATA.qa.skipQueue}마리 넘으면 건너뛰고 그냥 보낸다`;
      if (!k.fixed && r.lv < DATA.stack.maxLv) html += `<br><i>같은 방을 위에 놓으면 Lv.${r.lv + 1}</i>`;
    }
    tip.hidden = !html; if (html) { tip.innerHTML = html; tip.style.left = Math.min(66, cx) + '%'; tip.style.top = Math.min(70, cy + 4) + '%'; }
  },
  openPop(r) {
    const p = $('pop'), k = DATA.rooms[r.kind];
    let body = `<i>${k.d}</i>`;
    if (r.kind === 'asm') body += `<div>먼저 만들 주문</div><div class="row"><button type="button" data-a="prio" class="on">${DATA.prioModes[r.prio]}</button></div><div>받을 주문 <i>(끄면 이 조립실은 그 주문을 안 받음)</i></div><div class="row">${World.S.recipes.map(x => `<button type="button" data-r="${x}" class="${r.reject.has(x) ? '' : 'on'}">${DATA.recipes[x].n}</button>`).join('')}</div>`;
    p.innerHTML = `<b>${k.n}${r.lv > 1 ? ' Lv.' + r.lv : ''}</b>${body}<div class="row">${k.fixed ? '<i>고정된 칸</i>' : '<button type="button" data-a="move">옮기기</button>'}<button type="button" data-a="close">닫기</button></div>`;
    p.style.left = Math.min(62, (r.x * TILE + TILE) / W * 100) + '%'; p.style.top = Math.min(45, r.y * TILE / H * 100) + '%'; p.hidden = false;
    p.querySelectorAll('[data-r]').forEach(b => b.onclick = () => { Edit.toggleReject(r, b.dataset.r); UI.openPop(r); });
    p.querySelectorAll('[data-a]').forEach(b => b.onclick = () => { const a = b.dataset.a; if (a === 'move') Edit.lift(r); else if (a === 'prio') { Edit.cyclePrio(r); UI.openPop(r); } else UI.closePop(); });
  },
  closePop() { $('pop').hidden = true; },
  report(m, y, b, diag, pick) {
    const fmt = { done: v => v + '개', master: v => v + '개', avg: v => v.toFixed(1) + '초', trust: v => Math.round(v * 100) + '%', cost: v => v };
    const better = { done: (a, b) => a > b, master: (a, b) => a > b, avg: (a, b) => a < b, trust: (a, b) => a > b, cost: (a, b) => a < b };
    const rowsDef = [['done', '처리한 주문'], ['master', '그중 ★명작'], ['avg', '평균 걸린 시간 (속도)'], ['trust', '신뢰도 (무사고율)'], ['cost', '유지비 (길 + 방 Lv.1 3 · Lv.2 4)']];
    const cell = (v, f) => v == null ? '-' : f(v);
    const rows = rowsDef.map(([k, n]) => { const v = m[k], yv = y && y[k]; const arrow = v == null || yv == null || v === yv ? '' : better[k](v, yv) ? ' <span class="up">▲</span>' : ' <span class="down">▼</span>'; return `<tr><td>${n}</td><td>${cell(v, fmt[k])}${arrow}</td><td>${y ? cell(yv, fmt[k]) : '-'}</td><td>${b ? cell(b[k], fmt[k]) : '-'}</td></tr>`; }).join('');
    const bonus = m.perfect ? `<p class="good">오늘 환각 사고 0건. ${DATA.text.perfect(DATA.perfect.roads)} (내일 지급)</p>` : m.oops ? `<p class="bad">환각 사고 ${m.oops}건 → 무사고 보너스 없음</p>` : '';
    $('rep').innerHTML = `<h2>${World.S.day}일째 보고</h2><table><tr><th>지표</th><th>오늘</th><th>어제</th><th>최고</th></tr>${rows}<tr><td>놓친 주문</td><td>${m.lost}</td><td>${y ? y.lost : '-'}</td><td></td></tr></table>
      ${bonus}<p class="diag">${diag}</p><p>하나를 고르세요 (1, 2). 강한 카드일수록 길이 적게 옵니다.</p>
      <div class="cards">${pick.map((c, i) => `<button type="button" class="card" data-i="${i}"><b>${i + 1}. ${c.n}</b><i>${c.d || (c.room ? '방 하나. 같은 방 위에 놓으면 Lv.2로 증축' : '길을 넉넉히')}</i></button>`).join('')}</div>`;
    $('repOv').hidden = false; $('rep').querySelectorAll('.card').forEach(bt => bt.onclick = () => Flow.choose(pick[+bt.dataset.i]));
  },
  hideReport() { $('repOv').hidden = true; },
};
