// ═════════ 판과 길 ═════════
// 꼬물이는 길 칸으로만 걷고, 목적지 방 칸에만 들어간다(4방향 BFS).
const Path = {
  inb: (x, y) => x >= 0 && y >= 0 && x < G.w && y < G.h,
  isRoad: (x, y) => Path.inb(x, y) && World.road[y * G.w + x] === 1,
  roomAt: (x, y) => World.rooms.find(r => !r.held && r.x === x && r.y === y),
  tileOf: c => [Math.max(0, Math.min(G.w - 1, Math.floor(c.x / TILE))), Math.max(0, Math.min(G.h - 1, Math.floor((c.y - 6) / TILE)))],
  center: (x, y) => [x * TILE + 12, y * TILE + 18],
  bfs(sx, sy, tx, ty) {
    if (sx === tx && sy === ty) return [];
    const w = G.w, prev = new Int16Array(w * G.h).fill(-1), s0 = sy * w + sx, goal = ty * w + tx, q = [s0]; prev[s0] = s0;
    for (let h = 0; h < q.length; h++) {
      const c = q[h], cx = c % w, cy = (c / w) | 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = cx + dx, ny = cy + dy; if (!Path.inb(nx, ny)) continue; const n = ny * w + nx;
        if (prev[n] >= 0 || (n !== goal && !World.road[n])) continue; prev[n] = c;
        if (n === goal) { const out = []; let k = n; while (k !== s0) { out.push([k % w, (k / w) | 0]); k = prev[k]; } return out.reverse(); }
        q.push(n);
      }
    }
    return null;
  },
  to(c, room) { const [x, y] = Path.tileOf(c); return Path.bfs(x, y, room.x, room.y); },
  nearestRoad(x, y) { for (let r = 1; r < 8; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (Path.isRoad(x + dx, y + dy)) return [x + dx, y + dy]; return null; },
  roadNext: r => [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => Path.isRoad(r.x + dx, r.y + dy)),
};
