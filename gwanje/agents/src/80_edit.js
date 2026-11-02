// ═════════ 편집: 고르기, 길 깔기·지우기, 방 들어 옮기기 ═════════
// 다시 설계하는 손품은 싸게(Good Company 반면교사). 편집 중에도 시간은 흐른다(교착 방지).
const Edit = {
  tool: 'sel', held: null, hover: [0, 0], dragging: false,
  setTool(t) { Edit.tool = t; UI.tools(); if (t !== 'sel') UI.closePop(); },
  paint(x, y) {
    if (!Path.inb(x, y) || Path.roomAt(x, y)) return; const i = y * G.w + x, S = World.S;
    if (Edit.tool === 'road' && !World.road[i] && S.roads > 0) { World.road[i] = 1; S.roads--; Crew.replan(); }
    else if (Edit.tool === 'erase' && World.road[i]) { World.road[i] = 0; S.roads++; Crew.replan(); }
  },
  canPlace: (x, y) => Path.inb(x, y) && !World.road[y * G.w + x] && !Path.roomAt(x, y),
  drop(x, y) {
    const h = Edit.held; if (!h || !Edit.canPlace(x, y)) return false;
    h.x = x; h.y = y; h.held = false; Edit.held = null; Crew.replan();
    if (!Path.roadNext(h)) UI.ticker(`<b>${DATA.rooms[h.kind].n}</b> 옆에 길이 없어요. 길을 이어 주세요.`);
    Edit.nextPlace(); UI.crewPanel(); return true;
  },
  lift(r) { if (DATA.rooms[r.kind].fixed) return; Crew.release(r); r.held = true; r.from = [r.x, r.y]; Edit.held = r; UI.closePop(); Crew.replan(); },
  cancel() { const h = Edit.held; if (h && h.from) { h.x = h.from[0]; h.y = h.from[1]; h.held = false; Edit.held = null; Crew.replan(); Edit.nextPlace(); } },
  nextPlace() { if (Edit.held || !World.toPlace.length) return; const k = World.toPlace.shift(); const r = Make.room(k, -5, -5); r.held = true; r.from = null; Edit.held = r; Edit.setTool('sel'); UI.ticker(`새 <b>${DATA.rooms[k].n}</b>: 길 옆 빈 칸을 누르세요.`); },
  // 조립실이 받지 않을 주문(거부 목록). 새로 열리는 주문은 기본으로 받는다.
  toggleReject(r, recipe) { if (r.reject.has(recipe)) r.reject.delete(recipe); else r.reject.add(recipe); },
};
