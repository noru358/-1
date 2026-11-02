// ═════════ 편집: 고르기, 길 깔기·지우기, 방 들어 옮기기·겹쳐 증축, 꼬물이 누르기 ═════════
// 다시 설계하는 손품은 싸게(Good Company 반면교사). 편집 중에도 시간은 흐른다(교착 방지).
const Edit = {
  tool: 'sel', held: null, hover: [0, 0], dragging: false,
  setTool(t) { Edit.tool = t; UI.tools(); if (t !== 'sel') UI.closePop(); },
  paint(x, y) {
    if (!Path.inb(x, y) || Path.roomAt(x, y)) return; const i = y * G.w + x, S = World.S;
    if (Edit.tool === 'road' && !World.road[i] && S.roads > 0) { World.road[i] = 1; S.roads--; Crew.replan(); }
    else if (Edit.tool === 'erase' && World.road[i]) { World.road[i] = 0; S.roads++; Crew.replan(); }
  },
  // 같은 종류 방 위에 놓으면 층이 오른다(Stacklands식 겹치기)
  stackTarget(x, y) { const h = Edit.held, t = h && Path.roomAt(x, y); return t && t !== h && t.kind === h.kind && !DATA.rooms[t.kind].fixed && t.lv + h.lv <= DATA.stack.maxLv ? t : null; },
  canPlace: (x, y) => Path.inb(x, y) && ((!World.road[y * G.w + x] && !Path.roomAt(x, y)) || !!Edit.stackTarget(x, y)),
  drop(x, y) {
    const h = Edit.held; if (!h || !Edit.canPlace(x, y)) return false;
    const t = Edit.stackTarget(x, y);
    if (t) {
      t.lv += h.lv; World.rooms.splice(World.rooms.indexOf(h), 1);
      for (const o of World.orders) if (o.asmRoom === h) o.asmRoom = t;   // 들고 온 조립실의 주문은 아래층으로
      Crew.pull(t); UI.log(DATA.text.stack(DATA.rooms[t.kind].n, t.lv));
    } else { h.x = x; h.y = y; h.held = false; if (!Path.roadNext(h)) UI.log(`<b>${DATA.rooms[h.kind].n}</b> 옆에 길이 없어요. 길을 이어 주세요.`); }
    Edit.held = null; Crew.replan(); Edit.nextPlace(); UI.crewPanel(); return true;
  },
  lift(r) { if (DATA.rooms[r.kind].fixed) return; Crew.release(r); r.held = true; r.from = [r.x, r.y]; Edit.held = r; UI.closePop(); Crew.replan(); },
  cancel() { const h = Edit.held; if (h && h.from) { h.x = h.from[0]; h.y = h.from[1]; h.held = false; Edit.held = null; Crew.replan(); Edit.nextPlace(); } },
  nextPlace() { if (Edit.held || !World.toPlace.length) return; const k = World.toPlace.shift(); const r = Make.room(k, -5, -5); r.held = true; r.from = null; Edit.held = r; Edit.setTool('sel'); UI.log(`새 <b>${DATA.rooms[k].n}</b>: 길 옆 빈 칸, 또는 같은 방 위(증축)를 누르세요.`); },
  // 조립실이 받지 않을 주문(거부 목록). 새로 열리는 주문은 기본으로 받는다.
  toggleReject(r, recipe) { if (r.reject.has(recipe)) r.reject.delete(recipe); else r.reject.add(recipe); },
  cyclePrio(r) { const ks = Object.keys(DATA.prioModes); r.prio = ks[(ks.indexOf(r.prio) + 1) % ks.length]; },
  // 한 번 누르기: !환각을 든 꼬물이 → 꿀밤(★영감으로 뒤집힘), 그 밖 → 칭찬(카페인 완충 + 가속). 쿨타임 공유
  poke(c) {
    const S = World.S, P = DATA.poke; if (S.pokeCd > 0) return false;
    const k = c.carry, item = k && (k.part ? k : k.result);
    S.pokeCd = P.cd;
    if (item && item.tag === 'hallucinated') { item.tag = 'inspired'; World.day.knock++; FX.add(c, 'knock'); FX.add(c, 'burst'); UI.log(DATA.text.knock(c.name)); }
    else { c.energy = DATA.energy.max; c.buff.praise = P.praiseSec; World.day.praise++; FX.add(c, 'heart'); UI.log(DATA.text.praise(c.name)); }
    return true;
  },
};
