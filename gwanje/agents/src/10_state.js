// ═════════ 상태 ═════════
// 저장되는 "사실"만 둔다. 부하·진행 중 개수 같은 파생 값은 Derive가 매 틱 다시 계산한다.
const G = DATA.grid, TILE = G.tile, W = G.w * TILE, H = G.h * TILE;
const World = {
  S: { day: 1, t: 0, speed: 1, paused: false, inDay: true, walk: 1, qaFail: DATA.qa.fail, inboxCap: DATA.inbox.cap, roads: 0, goal: 0, recipes: ['answer'], delivered: {}, yday: null, best: null },
  road: new Uint8Array(G.w * G.h),
  rooms: [], crew: [], orders: [], fx: [], toPlace: [], uid: 0,
  day: null,
};
const newDayStats = () => ({ done: 0, wait: 0, qaPass: 0, qaFail: 0, lost: 0, qwait: {}, stuck: {} });
World.day = newDayStats();

const Make = {
  room(kind, x, y) { const r = { id: World.uid++, kind, x, y, busy: null, queue: [], reject: new Set(), held: false }; World.rooms.push(r); return r; },
  crew() {
    const i = World.crew.length;
    const c = { i, name: DATA.names[i % DATA.names.length], tint: DATA.tints[i % DATA.tints.length], x: (2 + i % 10) * TILE + 12, y: 4 * TILE + 18,
      path: [], fin: null, job: null, st: 'idle', room: null, wt: 0, carry: null, face: 1, ph: Math.random() * 6, look: 0, retry: 0, why: '', skill: {}, role: null, pinned: false };
    World.crew.push(c); return c;
  },
  // 주문 상태: inbox → toAsm(배부 중) → placed(조립실에 있음) → asm(조립 중) → carry(검수·발송 중) → done
  order(recipe) { const o = { id: World.uid++, r: recipe, need: DATA.recipes[recipe].parts, have: {}, making: {}, t0: World.S.t, state: 'inbox', asmRoom: null }; World.orders.push(o); return o; },
};

function setupWorld() {
  const st = DATA.start;
  for (const [k, x, y] of st.rooms) Make.room(k, x, y);
  for (const [x0, x1, y] of st.roadRows) for (let x = x0; x <= x1; x++) World.road[y * G.w + x] = 1;
  World.S.roads = st.roadBudget - World.road.reduce((a, b) => a + b, 0);
  for (let k = 0; k < st.crew; k++) Make.crew();
}
const roomDef = r => DATA.rooms[r.kind];
