// ═════════ 상태 ═════════
// 저장되는 "사실"만 둔다. 부하·진행 중 개수·방 정원 같은 파생 값은 Derive가 매 틱 다시 계산한다.
const G = DATA.grid, TILE = G.tile, W = G.w * TILE, H = G.h * TILE;
// 시드 난수(본편 합칠 때 규칙). 주소 뒤에 ?seed=숫자 를 붙이면 같은 판이 다시 나온다.
const Rand = (() => {
  let s = (+new URLSearchParams(location.search).get('seed') || (Date.now() % 1e9)) >>> 0;
  const f = () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  f.seed = v => { s = v >>> 0; };
  f.pick = a => a[Math.floor(f() * a.length)];
  return f;
})();
const World = {
  S: { day: 1, t: 0, speed: 1, paused: false, inDay: true, inboxCap: DATA.inbox.cap, roads: 0, goal: 0, recipes: ['answer'], delivered: {}, yday: null, best: null,
       // 카드로 바뀌는 세계 배율
       walk: 1, pace: 1, halluAdd: 0, halluMul: 1, skillMul: 1, chatInspire: 0, pokeCd: 0 },
  road: new Uint8Array(G.w * G.h),
  rooms: [], crew: [], orders: [], fx: [], toPlace: [], log: [], uid: 0,
  day: null,
};
const newDayStats = () => ({ done: 0, master: 0, oops: 0, wait: 0, lost: 0, made: { normal: 0, inspired: 0, hallucinated: 0 }, madeBy: {}, qa: { pass: 0, fix: 0, alchemy: 0, skip: 0, miss: 0 }, halBy: {}, knock: 0, praise: 0, coffee: 0, chats: 0, qwait: {}, stuck: {} });
World.day = newDayStats();

const Make = {
  room(kind, x, y) { const r = { id: World.uid++, kind, x, y, lv: 1, workers: [], queue: [], reject: new Set(), prio: 'fifo', held: false }; World.rooms.push(r); return r; },
  crew(quirk) {
    const i = World.crew.length, q = quirk || Rand.pick(Object.keys(DATA.quirks));
    const c = { i, name: DATA.names[i % DATA.names.length], tint: DATA.tints[i % DATA.tints.length], quirk: q, x: (2 + i % 10) * TILE + 12, y: 4 * TILE + 18,
      path: [], fin: null, job: null, st: 'idle', room: null, wt: 0, carry: null, face: 1, ph: Rand() * 6, look: 0, retry: 0, why: '', skill: {}, role: null, pinned: false,
      energy: DATA.energy.max, buff: {}, chatCd: 0 };   // buff = {이름: 남은 초}
    World.crew.push(c); return c;
  },
  // 주문 상태: inbox → toAsm(배부 중) → placed(조립실에 있음) → asm(조립 중) → carry(검수·발송 중) → done
  // got = 도착한 부품마다 상태(tag). tag = 조립된 상자의 상태
  order(recipe) {
    const R = DATA.recipes[recipe];
    const o = { id: World.uid++, r: recipe, need: R.parts, have: {}, got: {}, making: {}, t0: World.S.t, state: 'inbox', asmRoom: null, client: Rand.pick(R.clients), tag: null };
    World.orders.push(o); return o;
  },
};

function setupWorld() {
  const st = DATA.start;
  for (const [k, x, y] of st.rooms) Make.room(k, x, y);
  for (const [x0, x1, y] of st.roadRows) for (let x = x0; x <= x1; x++) World.road[y * G.w + x] = 1;
  World.S.roads = st.roadBudget - World.road.reduce((a, b) => a + b, 0);
  for (const q of st.crewQuirks) Make.crew(q);
}
const roomDef = r => DATA.rooms[r.kind];
