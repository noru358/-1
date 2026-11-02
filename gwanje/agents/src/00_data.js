// ═════════ 데이터 표 ═════════
// 게임의 숫자와 글은 모두 여기에만 둔다. 새 방·부품·주문·목표·카드·역할은 표에 한 줄을 더하면 된다.
const DATA = {
  grid: { tile: 24, w: 16, h: 9 },
  day: { length: 60 },
  speeds: [1, 2, 3],
  start: {
    roadBudget: 30, crew: 5,
    rooms: [['in', 0, 4], ['out', 15, 4], ['search', 3, 3], ['write', 6, 5], ['asm', 9, 3], ['qa', 12, 5]],
    roadRows: [[1, 14, 4]],                 // [x0, x1, y]
  },
  inbox: { cap: 8, warnBefore: 2 },
  asm: { slots: 3, base: 1.0, perPart: 0.4, rework: 0.8 },
  qa: { fail: 0.18 },
  upkeep: { room: 3, road: 1 },
  walk: { pxPerSec: 62, tilesPerSec: 2.6 },
  skill: { perStar: 5, maxStar: 3, speedBonus: 0.12, pickBias: 6 },
  arrival: { base: 0.13, perDay: 0.025, perGoal: 0.02, wave: 0.3 },
  think: { idleLook: 0.3, stuckRetry: 0.5 },
  teams: { autoEvery: 5, dispatchCost: 3, asmCost: 3 },

  // 부품: 이름, 한 글자 기호, 색, 만드는 방
  parts: {
    doc:  { n: '자료', ch: '자', col: '#8ac8ff', room: 'search' },
    text: { n: '글',   ch: '글', col: '#f4f1ff', room: 'write' },
    pic:  { n: '그림', ch: '그', col: '#ff9ad0', room: 'draw' },
    tab:  { n: '표',   ch: '표', col: '#f0e070', room: 'calc' },
  },
  // 방: work = 기본 일하는 시간(초). part = 만드는 부품. fixed = 옮길 수 없음
  rooms: {
    in:     { n: '접수함', col: '#3e5878', top: '#8ac8ff', fixed: true, d: '인간의 주문서가 쌓인다.' },
    out:    { n: '발송구', col: '#335a4c', top: '#7fe0d0', fixed: true, d: '검수를 마친 결과물이 인간에게 간다.' },
    search: { n: '검색실', col: '#34406a', top: '#9ab0ff', work: 2.0, part: 'doc', d: '자료를 만든다.' },
    write:  { n: '작성실', col: '#5e5032', top: '#ffd38a', work: 2.4, part: 'text', d: '글을 만든다.' },
    draw:   { n: '그림실', col: '#5e3450', top: '#ff9ad0', work: 3.0, part: 'pic', d: '그림을 만든다.' },
    calc:   { n: '계산실', col: '#545228', top: '#f0e070', work: 2.0, part: 'tab', d: '표를 만든다.' },
    asm:    { n: '조립실', col: '#3a4a3a', top: '#a8e0a8', work: 1.0, d: '주문서를 맡아 두고, 필요한 부품이 다 모이면 하나로 조립한다.' },
    qa:     { n: '검수대', col: '#583434', top: '#ff8a7a', work: 1.0, d: '조립된 결과물을 확인한다. 틀리면 조립실로 돌아가 다시 조립한다.' },
  },
  // 주문 = 부품 조립식
  recipes: {
    answer: { n: '질문 답변', parts: { doc: 1, text: 1 }, say: ['"이거 왜 안 돼?"', '"이메일 좀 다듬어 줘"', '"점심 뭐 먹지"'] },
    art:    { n: '그림 요청', parts: { doc: 1, pic: 1 }, say: ['"고양이 그려 줘"', '"프로필 사진 만들어 줘"'] },
    budget: { n: '가계부',   parts: { tab: 2 }, say: ['"이번 달 가계부 정리"', '"더치페이 계산해 줘"'] },
    slides: { n: '발표 자료', parts: { doc: 2, tab: 1, pic: 1 }, say: ['"내일 발표인데..."', '"회의 자료 만들어 줘"'] },
    report: { n: '보고서',   parts: { doc: 2, tab: 1, text: 1 }, say: ['"시장 조사 좀 해 줘"', '"내일까지 보고서..."'] },
    blog:   { n: '블로그 글', parts: { text: 2, pic: 1 }, say: ['"여행 후기 써 줘"', '"맛집 리뷰 올려 줘"'] },
  },
  // 목표 = 해금
  goals: [
    { need: { answer: 8 }, room: 'draw', recipe: 'art', n: '그림실 + 그림 요청' },
    { need: { art: 6 }, room: 'calc', recipe: 'budget', n: '계산실 + 가계부' },
    { need: { budget: 6 }, room: 'asm', recipe: 'slides', n: '조립실 하나 더 + 발표 자료' },
    { need: { slides: 5 }, room: 'search', recipe: 'report', n: '검색실 하나 더 + 보고서' },
    { need: { report: 5 }, room: 'write', recipe: 'blog', n: '작성실 하나 더 + 블로그 글' },
    { need: { blog: 8, slides: 8, report: 8 }, n: '이 컴퓨터의 마지막 목표' },
  ],
  // 분업 역할: job = 일감 종류, part = 부품 일감이면 어느 부품
  roles: [
    { id: 'dispatch', n: '배부', d: '접수함 → 조립실로 주문서 나르기', job: 'dispatch' },
    { id: 'doc', n: '자료', job: 'part', part: 'doc' },
    { id: 'text', n: '글', job: 'part', part: 'text' },
    { id: 'pic', n: '그림', job: 'part', part: 'pic' },
    { id: 'tab', n: '표', job: 'part', part: 'tab' },
    { id: 'asm', n: '조립·검수', d: '조립 → 검수 → 발송', job: 'asm' },
  ],
  teamModes: { free: '자유', auto: '알아서 분업', manual: '직접 분업' },
  // 하루 끝 카드: 강한 카드 = 특수 하나 + 길 조금, 무난한 카드 = 길 많이
  cards: {
    strongRoads: 3, bottleneckChance: 0.65,
    specials: [
      { n: '검색실 하나', room: 'search' }, { n: '작성실 하나', room: 'write' }, { n: '조립실 하나', room: 'asm' }, { n: '검수대 하나', room: 'qa' },
      { n: '그림실 하나', room: 'draw', needPart: 'pic' }, { n: '계산실 하나', room: 'calc', needPart: 'tab' },
      { n: '꼬물이 둘', crew: 2 }, { n: '검수 교육', d: '검수 실패 40% 감소', mul: { qaFail: 0.6 } },
      { n: '작은 운동화', d: '모두 30% 빨리 걷기', mul: { walk: 1.3 } }, { n: '큰 접수함', d: '주문서 4장 더', add: { inboxCap: 4 } },
    ],
    alts: [{ n: '길 12칸', roads: 12 }, { n: '꼬물이 하나 + 길 5칸', roads: 5, crew: 1 }],
  },
  names: ['꼬미', '물이', '삑이', '도리', '콩이', '비트', '바이', '클로', '모리', '찌리', '토리', '나노', '포포', '두두', '말랑', '쪼꼬'],
  tints: ['#f2b46d', '#9fd88a', '#8ac8ff', '#f2a0c8', '#e8d870', '#c8a8ff', '#ff9a6a', '#7fe0d0', '#f4f1ff', '#d8b890', '#b0e0ff', '#ffc0a0', '#a0f0c0', '#ffb0d8', '#d0b0ff', '#ffd0a0'],
  text: {
    lost: '<b>인간</b> 대답이 없자 다른 AI를 열었다.',
    noRoad: k => `${k} 가는 길 없음`,
    noAsm: r => `${r}을(를) 받는 조립실 없음`,
    idle: '일 없음', roleIdle: r => `맡은 일(${r}) 없음`,
    asmFull: '조립실 자리 없음',
  },
};
