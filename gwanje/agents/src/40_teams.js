// ═════════ 분업 ═════════
// 자유: 누구나 아무 일. 직접 분업: 역할마다 인원을 정함. 알아서 분업: 밀린 일만큼 인원을 자동 배정.
// 꼬물이 하나를 눌러 역할을 고정(핀)할 수도 있다. 고정된 꼬물이는 자동 배정에서 빠진다.
const Teams = {
  mode: 'free', counts: {}, autoT: 0,
  roleOf: id => DATA.roles.find(r => r.id === id),
  allows(c, job) {
    if (!c.role || job.type === 'coffee') return true;
    const r = Teams.roleOf(c.role);
    return r.job === job.type && (!r.part || r.part === job.part);
  },
  // 역할별 인원 수 → 꼬물이에게 배정 (그 일 숙련이 높은 꼬물이부터, 지금 역할은 되도록 유지)
  apply() {
    const free = World.crew.filter(c => !c.pinned);
    if (Teams.mode === 'free') { for (const c of free) c.role = null; return; }
    const want = { ...Teams.counts }, keep = [];
    for (const c of free) if (c.role && want[c.role] > 0) { want[c.role]--; keep.push(c); }
    const rest = free.filter(c => !keep.includes(c));
    for (const c of rest) c.role = null;
    for (const role of DATA.roles) {
      while (want[role.id] > 0) {
        const cand = rest.filter(c => !c.role).sort((a, b) => Teams.skillFor(b, role) - Teams.skillFor(a, role))[0];
        if (!cand) break; cand.role = role.id; want[role.id]--;
      }
    }
  },
  // 배정 점수 = 숙련 + 기질 궁합(감사관 → 조립·검수, 몽상가 → 부품 방)
  skillFor(c, role) {
    const sk = role.job === 'part' ? c.skill[DATA.parts[role.part].room] || 0 : role.job === 'asm' ? (c.skill.asm || 0) + (c.skill.qa || 0) : 0;
    return sk + (DATA.quirks[c.quirk].likes === role.job ? DATA.teams.quirkPull : 0);
  },
  inc(id, d) {
    const total = World.crew.filter(c => !c.pinned).length, sum = Object.values(Teams.counts).reduce((a, b) => a + b, 0);
    const v = (Teams.counts[id] || 0) + d; if (v < 0 || (d > 0 && sum >= total)) return;
    Teams.counts[id] = v; Teams.apply();
  },
  setMode(m) { Teams.mode = m; if (m === 'manual' && !Object.keys(Teams.counts).length) Teams.counts = {}; if (m === 'auto') Teams.autoT = 0; Teams.apply(); },
  cyclePin(c) { const ids = [null, ...Teams.available().map(r => r.id)]; const i = ids.indexOf(c.pinned ? c.role : null); const next = ids[(i + 1) % ids.length]; c.pinned = !!next; c.role = next; Teams.apply(); },
  available: () => DATA.roles.filter(r => r.job !== 'part' || World.rooms.some(x => x.kind === DATA.parts[r.part].room)),
  // 알아서 분업: 역할마다 밀린 일의 양(초)을 재서 인원을 비례 배분한다
  tick(dt) {
    if (Teams.mode !== 'auto') return;
    Teams.autoT -= dt; if (Teams.autoT > 0) return; Teams.autoT = DATA.teams.autoEvery;
    const dem = Jobs.demand(), roles = Teams.available(), total = World.crew.filter(c => !c.pinned).length;
    const sum = roles.reduce((a, r) => a + (dem[r.id] || 0), 0); if (!sum) { Teams.counts = {}; Teams.apply(); return; }
    const raw = roles.map(r => ({ id: r.id, v: (dem[r.id] || 0) / sum * total })), counts = {};
    let left = total; for (const x of raw) { counts[x.id] = Math.floor(x.v); left -= counts[x.id]; }
    raw.sort((a, b) => (b.v % 1) - (a.v % 1)); for (const x of raw) if (left > 0 && x.v > 0) { counts[x.id]++; left--; }
    Teams.counts = counts; Teams.apply();
  },
};
