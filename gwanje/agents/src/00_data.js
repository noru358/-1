// ═════════ 데이터 표 ═════════
// 게임의 숫자와 글은 모두 여기에만 둔다. 새 방·부품·주문·목표·카드·역할·기질은 표에 한 줄을 더하면 된다.
const DATA = {
  grid: { tile: 24, w: 16, h: 9 },
  day: { length: 60, rush: [40, 50], rushArrival: 1.4 },   // rush = 마감 러시 구간(초), 그동안 주문이 더 온다
  speeds: [1, 2, 3],
  start: {
    roadBudget: 30,
    crewQuirks: ['dreamer', 'auditor', 'chatty', 'loner', 'sprinter'],   // 처음 5마리는 기질 5종이 하나씩
    rooms: [['in', 0, 4], ['out', 15, 4], ['search', 3, 3], ['write', 6, 5], ['pantry', 7, 3], ['asm', 9, 3], ['qa', 12, 5]],
    roadRows: [[1, 14, 4]],                 // [x0, x1, y]
  },
  inbox: { cap: 8, warnBefore: 2 },
  // 조립실: 맡는 주문 수는 층(lv)마다 다르다
  asm: { slots: [0, 3, 5], base: 1.0, perPart: 0.4 },
  // 검수대: 결과물 상태(tag)에 따라 걸리는 시간과 결과가 정해진다(무작위 실패 없음)
  // catch = 보통 꼬물이가 오류 상자를 알아챌 확률(놓치면 도장만 찍고 보냄 → 사고). Lv.2 검수대와 감사관은 늘 잡는다
  qa: { fastPass: 0.3, fix: 1.6, alchemy: 1.0, skipQueue: 3, catch: 0.7, catchLv2: 1.0 },
  stack: { maxLv: 2 },                      // 같은 방 위에 같은 방을 놓으면 층이 오른다
  upkeep: { road: 1, byLv: [0, 3, 4] },     // 방 유지비: Lv.1 = 3, Lv.2 = 4 (Lv.1 두 개 = 6보다 싸다)
  walk: { pxPerSec: 62, tilesPerSec: 2.6 },
  skill: { perStar: 5, maxStar: 3, speedBonus: 0.12, pickBias: 6, inspirePerStar: 0.03 },
  arrival: { base: 0.13, perDay: 0.025, perGoal: 0.02, wave: 0.3 },
  think: { idleLook: 0.3, stuckRetry: 0.5 },
  teams: { autoEvery: 5, dispatchCost: 3, asmCost: 3, quirkPull: 8 },
  // 카페인(집중력): 일을 maxEnergy번 하면 바닥난다 → 탕비실에 들러 채운다
  energy: { max: 4, emptyWalk: 0.65, coffeeBuff: 1.25, coffeeSec: 3, auraRange: 2 },
  // 한 번 누르기: 꼬물이를 누르면 칭찬(가속) 또는 꿀밤(!환각 → ★영감). 모두 같은 쿨타임
  poke: { cd: 5, praiseMul: 1.5, praiseSec: 5 },
  chat: { mul: 1.35, sec: 6, cd: 8, reach: 12 },
  // 무사고(신뢰도 100%)로 하루를 마치면 다음 날 길을 더 준다
  perfect: { roads: 3 },
  // 목표 진행: 명작은 2칸
  goalCredit: { normal: 1, inspired: 2, hallucinated: 1 },

  // 부품·결과물 상태
  tags: {
    normal:       { n: '정상', mark: '',  col: null },
    inspired:     { n: '★영감', mark: '★', col: '#ffe27a' },
    hallucinated: { n: '!환각', mark: '!', col: '#ff4d6d' },
  },
  box: { normal: '#ffe27a', inspired: '#fff3b0', hallucinated: '#ff4d6d', rainbow: ['#ff9ad0', '#ffe27a', '#7fe0d0', '#8ac8ff'] },

  // 기질 5종. 숫자는 모두 배율이나 확률. 규칙은 60_crew(속도·상태 결정)와 70_flow(검수)가 이 표를 읽는다
  quirks: {
    dreamer:  { n: '몽상가',   short: '몽상', col: '#c8a8ff', workMul: 1.4, inspire: 0.35, hallucinate: 0.30, likes: 'part',
                d: '일이 빠르고 ★영감을 자주 내지만, !환각(뻥카)도 섞는다.' },
    auditor:  { n: '감사관',   short: '감사', col: '#8ac8ff', qaMul: 1.5, alchemy: true, likes: 'asm',
                d: '검수대에서 빠르다. !환각이 든 결과물을 그 자리에서 ★명작으로 뒤집는다.' },
    chatty:   { n: '수다쟁이', short: '수다', col: '#ffb0d8', chatty: true,
                d: '길에서 동료와 마주치면 인사하고, 둘 다 6초 동안 ×1.35 빨라진다.' },
    loner:    { n: '독불장군', short: '독불', col: '#9a93ad', soloMul: 1.6, crowdMul: 0.7, soloInspire: 0.20,
                d: '방 앞에 줄이 없으면 ×1.6에 ★영감 20%. 줄이 있으면 눈치 보느라 ×0.7.' },
    sprinter: { n: '벼락치기', short: '벼락', col: '#ff9a6a', baseMul: 0.85, rushMul: 2.2, rushInbox: 4,
                d: '평소엔 ×0.85. 접수함 4건 이상이거나 마감 러시면 ×2.2로 폭주하고 카페인도 안 쓴다.' },
  },

  // 부품: 이름, 한 글자 기호, 색, 만드는 방
  parts: {
    doc:  { n: '자료', ch: '자', col: '#8ac8ff', room: 'search' },
    text: { n: '글',   ch: '글', col: '#f4f1ff', room: 'write' },
    pic:  { n: '그림', ch: '그', col: '#ff9ad0', room: 'draw' },
    tab:  { n: '표',   ch: '표', col: '#f0e070', room: 'calc' },
  },
  // 방: work = 기본 일하는 시간(초). part = 만드는 부품. fixed = 옮길 수 없음. 동시에 일하는 수 = 층(lv)
  rooms: {
    in:     { n: '접수함', col: '#3e5878', top: '#8ac8ff', fixed: true, d: '인간의 주문서가 쌓인다.' },
    out:    { n: '발송구', col: '#335a4c', top: '#7fe0d0', fixed: true, d: '검수를 마친 결과물이 인간에게 간다.' },
    search: { n: '검색실', col: '#34406a', top: '#9ab0ff', work: 2.0, part: 'doc', d: '자료를 만든다.' },
    write:  { n: '작성실', col: '#5e5032', top: '#ffd38a', work: 2.4, part: 'text', d: '글을 만든다.' },
    draw:   { n: '그림실', col: '#5e3450', top: '#ff9ad0', work: 3.0, part: 'pic', d: '그림을 만든다.' },
    calc:   { n: '계산실', col: '#545228', top: '#f0e070', work: 2.0, part: 'tab', d: '표를 만든다.' },
    asm:    { n: '조립실', col: '#3a4a3a', top: '#a8e0a8', work: 1.0, d: '주문서를 맡아 두고, 부품이 다 모이면 상자로 조립한다. !환각이 하나라도 섞이면 오류 상자, ★영감이 섞이면 명작 상자.' },
    qa:     { n: '검수대', col: '#583434', top: '#ff8a7a', work: 1.0, d: '정상·명작 상자는 도장만 찍고 통과. 오류 상자는 보통 70% 알아채 고쳐 보내고, 놓치면 그대로 나간다. 감사관은 늘 잡아 명작으로 뒤집고, Lv.2 검수대는 늘 잡는다.' },
    pantry: { n: '탕비실', col: '#4a3a30', top: '#d8a070', work: 0.4, coffee: true, d: '카페인이 바닥난 꼬물이가 커피를 마신다. Lv.2면 근처 길을 지나기만 해도 채워진다.' },
  },
  lvText: ['', '한 번에 1마리', '한 번에 2마리'],
  prioModes: { fifo: '먼저 온 주문부터', near: '금방 끝나는 주문부터' },

  // 주문 = 부품 조립식. clients = 단골 발주처, win/oops = 명작·사고 때 방송 띠 반응({c} = 발주처)
  recipes: {
    answer: { n: '질문 답변', parts: { doc: 1, text: 1 }, clients: ['호기심 많은 초등학생', '새벽 라디오 DJ'],
      say: ['"공룡은 왜 없어졌어?"', '"신청곡 사연 다듬어 줘"', '"점심 뭐 먹지"'],
      win: ['[{c}] 답이 너무 좋아서 받아 적어 갔습니다.'], oops: ['[{c}] "고래는 하늘을 난다"는 답을 그대로 믿었습니다.'] },
    art:    { n: '그림 요청', parts: { doc: 1, pic: 1 }, clients: ['인디밴드 보컬', '동네 빵집 사장님'],
      say: ['"앨범 표지 그려 줘"', '"크루아상 간판 그려 줘"'],
      win: ['[{c}] 그림을 가게 앞에 걸었더니 줄이 섰습니다.'], oops: ['[{c}] 받은 크루아상 그림에 손가락이 일곱 개입니다.'] },
    budget: { n: '가계부', parts: { tab: 2 }, clients: ['을지로 인쇄소 김씨', '자취 1년차 대학생'],
      say: ['"이번 달 가계부 정리"', '"더치페이 계산해 줘"'],
      win: ['[{c}] 가계부 덕에 남는 돈을 찾았습니다.'], oops: ['[{c}] 가계부에 3+5=99라고 적혀 있어 뒷목을 잡습니다.'] },
    slides: { n: '발표 자료', parts: { doc: 2, tab: 1, pic: 1 }, clients: ['302호 취준생', '스타트업 김대리'],
      say: ['"내일 면접 발표인데..."', '"투자 회의 자료 만들어 줘"'],
      win: ['[{c}] 발표가 대박 나서 최종 합격했답니다.'], oops: ['[{c}] 발표 자료에 없는 회사 매출을 지어내 식은땀을 흘렸습니다.'] },
    report: { n: '보고서', parts: { doc: 2, tab: 1, text: 1 }, clients: ['시청 야근 공무원', '미스터리 잡지 편집장'],
      say: ['"내일까지 보고서..."', '"이번 호 특집 조사 좀"'],
      win: ['[{c}] 보고서가 그대로 결재됐습니다. 오늘은 칼퇴.'], oops: ['[{c}] 보고서에 실린 "을지로 지하 7층"을 찾아 헤매는 중입니다.'] },
    blog:   { n: '블로그 글', parts: { text: 2, pic: 1 }, clients: ['심야식당 주인', '옥탑방 웹소설 작가'],
      say: ['"오늘 메뉴 소개 글"', '"연재 공지 써 줘"'],
      win: ['[{c}] 글이 퍼져서 오늘 밤 손님이 두 배입니다.'], oops: ['[{c}] 블로그에 없는 메뉴 "용가리 정식"이 올라갔습니다.'] },
  },
  // 목표 = 해금. 명작 납품은 goalCredit만큼 더 찬다
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
  // mul = 세계 배율 곱하기, add = 더하기, room = 놓을 방, crew = [기질...](null = 무작위)
  cards: {
    strongRoads: 3, bottleneckChance: 0.65,
    specials: [
      { n: '검색실 하나', room: 'search' }, { n: '작성실 하나', room: 'write' }, { n: '조립실 하나', room: 'asm' }, { n: '검수대 하나', room: 'qa' },
      { n: '그림실 하나', room: 'draw', needPart: 'pic' }, { n: '계산실 하나', room: 'calc', needPart: 'tab' }, { n: '탕비실 하나', room: 'pantry' },
      { n: '몽상가 + 감사관 영입', crew: ['dreamer', 'auditor'], d: '★영감을 내는 애와 그걸 걸러 명작으로 만드는 애' },
      { n: '수다쟁이 쌍둥이 영입', crew: ['chatty', 'chatty'], d: '복도에서 마주치면 둘 다 빨라진다' },
      { n: '사내 간식: 에스프레소 머신', mul: { pace: 1.25 }, add: { halluAdd: 0.15 }, d: '모두 ×1.25 빨라진다. 대신 누구나 15% 확률로 !환각' },
      { n: '사내 간식: 따뜻한 국화차', mul: { halluMul: 0.5, skillMul: 2 }, d: '!환각 확률 절반, 숙련 ★이 두 배 빨리 오른다' },
      { n: '브레인스토밍 보드', add: { chatInspire: 0.25 }, d: '수다로 신난 꼬물이는 ★영감 확률 +25%' },
      { n: '작은 운동화', mul: { walk: 1.3 }, d: '모두 30% 빨리 걷기' },
      { n: '큰 접수함', add: { inboxCap: 4 }, d: '주문서 4장 더' },
    ],
    alts: [{ n: '길 12칸', roads: 12 }, { n: '꼬물이 하나(기질 무작위) + 길 5칸', roads: 5, crew: [null] }],
  },
  names: ['꼬미', '물이', '삑이', '도리', '콩이', '비트', '바이', '클로', '모리', '찌리', '토리', '나노', '포포', '두두', '말랑', '쪼꼬'],
  tints: ['#f2b46d', '#9fd88a', '#8ac8ff', '#f2a0c8', '#e8d870', '#c8a8ff', '#ff9a6a', '#7fe0d0', '#f4f1ff', '#d8b890', '#b0e0ff', '#ffc0a0', '#a0f0c0', '#ffb0d8', '#d0b0ff', '#ffd0a0'],
  text: {
    lost: '<b>인간</b> 대답이 없자 다른 AI를 열었다.',
    noRoad: k => `${k} 가는 길 없음`,
    noAsm: r => `${r}을(를) 받는 조립실 없음`,
    idle: '일 없음', roleIdle: r => `맡은 일(${r}) 없음`,
    asmFull: '조립실 자리 없음',
    noCoffee: '카페인 부족(탕비실 없음)',
    masterLog: s => `★ 명작 ${s} <i>(목표 +2)</i>`,
    oopsLog: s => `! 환각 사고 ${s} <i>(무사고 깨짐)</i>`,
    skipQa: n => `<b>${n}</b> 검수대 줄이 길어서 그냥 보냈다…`,
    knock: n => `<b>${n}</b> 꿀밤! !환각 → ★영감`,
    praise: n => `<b>${n}</b> 칭찬받고 신났다`,
    alchemy: n => `<b>${n}</b> 오류를 잡아 명작으로 뒤집었다`,
    perfect: r => `무사고 보너스: 길 +${r}칸`,
    stack: (k, lv) => `<b>${k}</b> Lv.${lv}로 증축!`,
  },
};
