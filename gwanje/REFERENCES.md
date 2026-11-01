# 레퍼런스 역설계: 구조 설계·흐름 관리 게임

꼬물이 에이전트 회사(v2)의 설계와 구조가 얕다는 판단에서 시작했다. 이 장르의 대표작을 같은 틀로 해부해서, 따올 구조와 피할 함정을 뽑는다.

출처는 각 게임의 리뷰, 위키, 공략, 커뮤니티 글(2026-11 확인)과 Claude가 알고 있던 내용이다. 커뮤니티 자료라 세부 수치는 버전마다 다를 수 있다. 확인하지 못한 수치는 적지 않았다.

## 해부 틀
게임마다 같은 여덟 가지를 본다.
1. **설계하는 것**: 플레이어가 놓거나 정하는 부품
2. **부품 규칙**: 입력, 출력, 제약
3. **수요와 목표**: 어떻게 들어오는가
4. **막힘과 실패**
5. **정보와 피드백**: 무엇을 보여 주는가
6. **성장과 해금**
7. **콘텐츠가 늘어나는 방식**
8. **다시 하게 만드는 것**

마지막에 **밥 먹으면서 하기에 맞는지**(혼자 돌아가는가, 한 손 조작인가, 실패가 가혹한가)를 붙인다.

---

## 1. Mini Motorways (Dinosaur Polo Club)
- **설계하는 것**: 길 타일. 그리고 특수 도구(다리, 회전교차로, 고속도로, 터널, 신호등)를 놓는 자리.
- **부품 규칙**: 집(색)의 차는 같은 색 목적지로 간다. 길이 이어져 있어야 한다.
- **수요**
  - 시간이 지나면 집과 목적지가 **빈 땅 아무 데나** 생긴다. 새 색도 생긴다.
  - 목적지가 더 많은 차를 원하는 큰 건물로 커진다.
  - 물과 산이 길을 막는다.
- **막힘과 실패**
  - 목적지에 핀(일감)이 쌓인다.
  - 너무 많이 쌓이면 그 건물 위에 **눈에 보이는 타이머**가 생기고 똑딱 소리가 난다.
  - 타이머가 다 차면 게임 끝이다.
- **피드백**: 점수 = 성공한 이동 수. 차들이 실제로 길을 달리는 모습 자체가 정보다.
- **성장**: **매주 끝에 두 가지 묶음 중 하나를 고른다.**
  - 두 묶음 모두 길 타일을 준다.
  - 그중 하나는 특수 도구도 준다.
  - 좋은 도구일수록 딸려 오는 길이 적다(예: 고속도로는 길 10칸, 회전교차로는 30칸 쪽).
  - 리뷰는 **"길을 화폐로 만든 것"**이 업그레이드 균형을 잡는 핵심이라고 본다.
- **콘텐츠**: 지도(지형)마다 다른 문제. 규칙은 같고 땅만 바뀐다.
- **다시 하게 만드는 것**: 같은 지도를 다른 도구 선택으로 다시 한다.
- **약점**: 신호등은 쓸모없거나 오히려 막히게 한다는 비판을 받는다.
- **밥 먹으면서**: 보는 재미 ◎, 한 손 조작 ◎, 실패 가혹 △(게임 끝).

## 2. shapez / shapez 2 (tobspr)
- **설계하는 것**: 추출기, 기계(자르기, 돌리기, 칠하기, 쌓기), 벨트의 배치.
- **부품 규칙**: 기계 하나는 **모양을 한 가지 방식으로 바꾸는 연산**이다. 연산을 이어 붙여 목표 모양을 만든다.
- **수요**
  - 허브가 "이 모양을 n개" 요구한다.
  - 1편은 26단계가 지나면 무작위 모양을 요구하는 무한 모드가 열린다.
- **막힘**: 처리량. 느린 기계 하나가 줄 전체를 막는다. 실패는 없다.
- **피드백**: 벨트 위로 모양이 흘러가는 모습, 허브 초당 납품량.
- **성장**
  - 단계 목표를 채우면 **새 기계가 열린다**. 목표가 곧 해금이다.
  - 업그레이드는 따로 있다. 같은 모양을 바치면 벨트와 기계 속도가 오른다(1편 기준 업그레이드 목표 모양도 점점 커진다).
  - 2편은 직선 업그레이드(속도)와 해금 업그레이드(새 건물)를 나눈다.
- **콘텐츠**: **연산 몇 개 × 모양 조합 = 거의 무한한 목표.** 데이터 한 줄로 새 목표가 생긴다.
- **다시 하게 만드는 것**: 더 깔끔한 공장, 더 빠른 납품.
- **밥 먹으면서**: 보는 재미 ○, 설계는 두 손에 가깝고 집중이 필요하다, 실패 없음 ◎.

## 3. Two Point Hospital (Two Point Studios)
- **설계하는 것**: 방 배치(크기 제한, 필수 가구), 직원 고용과 배치, 훈련.
- **부품 규칙**
  - 환자는 **진단 → 치료** 순서로 방을 돈다.
  - 방마다 필요한 직원 직종이 있다(예: 일반 진단실은 간호사).
  - 일부 방은 **특정 자격**을 가진 직원이 있어야 쓸 수 있다(예: 방사선 자격 → 큰 스캐너).
- **수요**: 병의 종류가 단계마다 새로 나온다. 병마다 필요한 방이 다르다.
- **막힘**: 대기 줄, 진단 확신도 부족, 걷는 거리.
  - 커뮤니티 공략은 **진단실을 모아 둬서 환자가 덜 걷게** 하라고 권한다.
- **피드백**: 줄과 대기 시간, 방 상태, 직원 기분, 병원 등급(별).
- **성장**
  - 직원 훈련으로 자격을 얻는다(예: 일반 진료 자격 단계마다 진단력 +15%라는 공략).
  - 병원(지도)마다 별 목표가 있다.
- **콘텐츠**: 병 = (진단 경로 + 치료 방) 데이터. 웃긴 이름과 묘사가 콘텐츠의 절반이다.
- **약점**: 반복과 방 설계가 아쉽다는 비평.
- **밥 먹으면서**: 보는 재미 ◎(사람들이 그럴듯하게 움직임), 조작 많음 △.

## 4. Little Big Workshop (HandyGames)
- **설계하는 것**: 작업대와 기계 배치, **계획 화면에서 제품 하나를 부품으로 쪼개 각 단계를 어느 기계에서 할지 정하기**.
- **부품 규칙**: 제품 = 부품 여러 개(나무, 금속, 플라스틱), 부품마다 가공 단계, 마지막에 조립.
- **수요**: 계약 게시판에서 고른다. 납기와 보수.
- **막힘**: 작업자 동선, 기계 부족, 납기. 부품이 많을수록 계획, 작업대, 작업자가 더 필요하다.
- **피드백**: 탁자 위 미니어처 공장에서 작은 작업자들이 오가는 모습. 바로 우리가 원하는 장면이다.
- **성장**: 재료 숙련도, 작업자 수, 공장 확장, 협상력. 작업자는 공정의 일부에 특화할 수 있다.
- **약점**
  - 할 일이 있는데 작업자가 서서 노는 AI 문제(사용자 불만).
  - 너무 느리고 수동적이라는 평.
  - 계획 화면에서 일을 나눌 방법이 없다는 아쉬움.
  - 끝 목표가 없다.
- **밥 먹으면서**: 보는 재미 ◎, 계획은 차분히(멈춤 상태에서) ○.

## 5. Production Line (Positech)
- **설계하는 것**: 자동차 조립 라인의 **슬롯**(공정 칸) 배치와 연결, 연구.
- **부품 규칙**: 슬롯 하나 = 공정 하나. 차가 슬롯을 차례로 지나간다.
- **핵심 장치: 느린 공정을 쪼개는 연구**
  - 예를 들어 "차대" 슬롯 하나를 연구로 "차축 + 롤케이지 + 구동축" 세 슬롯으로 나눈다.
  - 라인은 길어지지만 훨씬 빨라진다.
  - **업그레이드가 숫자가 아니라 구조를 바꾼다.**
- **막힘**: 가장 느린 슬롯. 수출 속도에 라인 속도를 맞추는 게 전략이다.
- **약점**: 처음부터 너무 복잡하다, 기술 트리가 과하다(사용자 평).
- **밥 먹으면서**: 보는 재미 ○, 처음 진입이 어렵다 ✕.

## 6. Big Pharma (Twice Circled / Positech)
- **설계하는 것**: 공장 바닥의 기계와 벨트(좁은 바닥 면적이 핵심 제약).
- **부품 규칙**
  - 재료마다 농도, 효능, 부작용이 있다.
  - 기계가 **농도를 +1(증발기), −1(희석기)** 같은 식으로 바꾼다.
  - 높은 단계 효과는 **촉매**가 있어야 하고, 촉매는 부작용을 데려온다.
- **콘텐츠**: 재료 × 농도 범위 × 기계 연산 = 퍼즐. 시장 가격과 경쟁사가 경영 층을 얹는다.
- **가져올 점**: **숫자 하나(농도)를 범위 안에 맞추는** 아주 직관적인 변환 퍼즐. 촉매처럼 **좋은 것에 대가가 붙는 규칙**.

## 7. Opus Magnum (Zachtronics)
- **설계하는 것**: 연금술 기계(팔, 궤도, 명령 순서).
- **점수**: 해법마다 **비용(G), 속도(사이클), 면적(칸)** 세 지표를 따로 매긴다.
- **피드백: 히스토그램**
  - 순위표 대신, 모든 플레이어 해법의 분포에서 내 해법이 어디쯤인지 보여 준다.
  - "순위표보다 훨씬 똑똑하다"는 평.
- **긴장**: 면적과 비용은 함께 좋아지는 편이고, 속도는 둘과 반대로 간다. 그래서 **같은 퍼즐을 다른 지표로 다시 푼다.**
- **숨은 네 번째 지표**: 기계가 얼마나 보기 좋은가. 예쁜 기계 자체가 보상이라는 평.
- **가져올 점**: 하루 보고를 "처리 수" 하나가 아니라 **서로 당기는 지표 2~3개**로.

## 8. Islanders (Grizzly Games)
- **설계하는 것**: 건물 하나를 어디에 놓을지.
- **부품 규칙**: 건물마다 **반경 안의 다른 건물과 자연물로 점수**를 얻는다. 건물마다 반경이 다르다.
- **피드백**: **놓기 전에 점수를 미리 보여 준다.** 옮겨 보며 최선의 자리를 찾는다.
- **약점**: 자유 배치라 한 픽셀 자리 찾기가 답답하다는 평 → **격자 배치**가 낫다는 근거.
- **가져올 점**: 이웃 효과의 **미리보기**. 규칙이 단순해도 놓는 자리가 판단이 된다.

## 9. Rusty's Retirement (Mister Morris Games)
- **형태**: **화면 아래 띠에 붙어 있는** 방치형 농장. 다른 일을 하면서 돌린다.
- **구조**
  - 처음엔 손으로 심고 거둔다.
  - 작물 → 바이오연료 → 부품 → 로봇과 건물.
  - 로봇이 심기, 물 주기, 거두기를 맡는다.
  - 로봇은 살수록 비싸지고, 업그레이드는 **적재량과 속도** 두 가지다.
- **피드백**: 확대와 축소, 덜 신경 쓰이게 하는 집중 모드(작물 생산이 느려짐).
- **가져올 점**: **"손으로 시작 → 자동화"**의 단계. 옆 창이나 띠 화면 형식. 업그레이드 축을 두 개로 단순하게.
- **밥 먹으면서**: ◎. 이 형식이 이미 시장에서 검증됐다.

## 10. RimWorld의 작업 탭 (Ludeon)
- **설계하는 것**: 정착민 × 작업 종류 **우선순위 표**. 숫자 1이 먼저다. 못 하는 일은 칸 자체가 없다.
- **가져올 점**: **"누가 무엇을 먼저"**를 표 한 장으로 설계하게 하는 방식. 규칙 설계(다)를 가장 간단하게 구현하는 형태다.
- **경고**: 세부 작업까지 우선순위를 쪼개면 **교착(데드락)**이 생길 수 있다고 모드 제작자가 경고한다. 우리 v1의 멈춤 버그와 같은 종류다.

## 11. Good Company (Chasing Carrots) — 경고 사례
- 제품을 설계하고 생산 라인을 돌리는 경영 공장 게임. Factorio 느낌이라는 평.
- **불만**
  - 라인을 다시 짜고 재고를 다루는 일이 지나치게 손이 많이 간다.
  - 생산 테이블을 하나하나 손으로 바꿔야 한다.
  - 물류가 감당이 안 된다.
- **교훈**: **설계를 바꾸는 비용(손이 가는 정도)이 크면 "다시 설계" 고리가 귀찮음이 된다.** 옮기기, 복사, 일괄 변경은 싸야 한다.

---

## 패턴 라이브러리

| # | 패턴 | 출처 | 우리 게임에서 |
|---|---|---|---|
| P1 | **길(연결)을 화폐로**: 연결에 드는 자원이 한정되어 모든 선택이 트레이드오프가 된다 | Mini Motorways | 길 타일 예산(v2에 있음). 이걸 업그레이드 저울의 추로 쓴다 |
| P2 | **둘 중 하나 + 대가**: 좋은 도구일수록 딸려 오는 기본 자원이 적다 | Mini Motorways | 하루 카드에 "강한 방 + 길 적게" 대 "길 많이" |
| P3 | **수요가 판을 흔든다**: 새 수요가 예측 못 한 곳에 생긴다 | Mini Motorways | 새 요청 종류, 입구가 다른 쪽에도 생김 |
| P4 | **보이는 경고 타이머**: 실패 전에 눈과 귀로 예고 | Mini Motorways | 접수함 위 타이머 → 넘치면 "인간이 다른 AI로 감"(게임 끝 대신 점수 손실) |
| P5 | **연산 조합 = 콘텐츠**: 방 하나 = 변환 하나, 요청 = 변환들의 조합 | shapez, Big Pharma | 요청을 "만들 결과물의 조립식"으로. 데이터 한 줄 = 새 요청 |
| P6 | **목표가 곧 해금** | shapez | "보고서 20건 납품" 같은 목표를 채우면 새 방이 열림 |
| P7 | **느린 단계를 쪼개는 연구**: 업그레이드가 구조를 바꾼다 | Production Line | "작성" → "초안 + 퇴고"로 나누기. 줄은 길어지고 빨라짐 |
| P8 | **경로 + 자격**: 일마다 정해진 방 순서, 방마다 필요한 직원 자격 | Two Point Hospital | 꼬물이 특기(검색 숙련 등), 특기가 있어야 쓰는 고급 방 |
| P9 | **계획 화면**: 제품을 부품으로 쪼개고 단계마다 담당 기계를 정함 | Little Big Workshop | 새 요청 종류가 오면 "어느 방들을 거칠지" 경로를 플레이어가 정함 |
| P10 | **서로 당기는 다중 지표 + 분포** | Opus Magnum | 하루 보고: 속도(평균 대기), 비용(길과 방), 품질(검수 통과) + 어제와 비교 |
| P11 | **놓기 전 미리보기** | Islanders | 방을 들면 "이 자리면 평균 거리 −3칸" 같은 예상치 |
| P12 | **우선순위 표** | RimWorld | 꼬물이 × 방 종류 표, 또는 방마다 "먼저 받을 요청" 순서 |
| P13 | **손으로 시작 → 자동화** | Rusty's Retirement | 1일째는 분류를 손으로(클릭), 분류 규칙과 분류대가 열리면 자동 |
| P14 | **다시 설계하는 비용은 싸게** | Good Company(반면교사) | 들어서 옮기기, 끌어서 길, 규칙 복사. 젓가락 기준과도 같은 방향 |
| P15 | **작업자가 놀면 안 된다** | Little Big Workshop(반면교사) | 놀고 있는 꼬물이와 이유를 표시("일이 없음", "길 없음", "자격 없음") |

---

## 우리 v2를 이 틀로 진단
| 축 | v2 | 부족한 점 |
|---|---|---|
| 설계하는 것 | 방 위치, 길, 방별 받는 요청 | 방이 "기다리는 곳"일 뿐 규칙이 없다(입력·출력·변환이 없음) |
| 부품 규칙 | 방 = 시간 지연 | 변환과 조합이 없어서 퍼즐이 생기지 않는다(P5) |
| 수요 | 날마다 종류 추가 | 판을 흔드는 공간 변화가 없다(P3) |
| 막힘 | 줄, 길 없음, 넘침 | 넘침 예고가 약하다(P4) |
| 피드백 | 가장 막힌 곳 하나 | 지표가 하나뿐이라 트레이드오프가 없다(P10). 미리보기 없음(P11) |
| 성장 | 카드(숫자 위주) | 구조를 바꾸는 해금이 없다(P6, P7) |
| 콘텐츠 | 요청 4종을 손으로 씀 | 조합으로 불어나지 않는다(P5) |
| 다시 하기 | 없음 | 지도나 조건 변주, 다중 지표 재도전이 없다 |

## 따올 구조 제안 (v3 뼈대, 논의용)
1. **요청 = 조립식(P5, P9)**
   - 예: "발표 자료" = 자료 2 + 표 1 + 그림 1 → 편집 → 검수 → 발송.
   - 방은 **부품을 만드는 방**(검색 → 자료, 계산 → 표, 그림 → 그림)과 **합치는 방**(편집실: 부품이 다 모여야 시작)으로 나뉜다.
   - 여러 갈래가 한 곳으로 모이는 것이 회로의 합류점이다. 비율 설계(그림실 하나에 검색실 둘)가 생긴다.
2. **구조를 바꾸는 해금(P6, P7)**: 목표를 채우면 새 방이 열린다. 느린 방은 연구로 쪼갠다.
3. **다중 지표(P10)**
   - 하루 보고에 속도, 비용(길과 방 유지비), 품질(검수 통과율).
   - 어제의 나, 목표선과 비교한다. 혼자 하는 게임이니 히스토그램 대신 "내 기록 분포"를 쓴다.
4. **길 예산 + 둘 중 하나(P1, P2)**: 카드 두 장에 늘 대가를 붙인다.
5. **보이는 경고(P4)**: 넘침 직전 접수함 타이머. 실패는 게임 끝이 아니라 점수와 기분 손실로 둔다(압박 A 또는 B 유지).
6. **꼬물이 특기(P8, P12)**: 일할수록 그 방 숙련이 오른다. 간단한 우선순위로 "누가 무엇을 먼저"를 정한다.
7. **노는 이유 표시(P15)와 싼 재설계(P14)**.

**인디 규모 점검**: 1~7은 모두 **규칙과 데이터**로 늘어나고, 그림은 방 아이콘 몇 개만 늘어난다. 코드 중심, 그림 최소 조건에 맞는다. 다만 한 번에 다 넣지 말고 1(조립식)과 3(다중 지표)부터 시험하기를 권한다. 이 둘이 깊이의 대부분을 만든다.

## 출처
- Mini Motorways: [Wikipedia](https://en.wikipedia.org/wiki/Mini_Motorways), [Indie Hell Zone](https://indiehellzone.com/2022/01/24/mini-motorways/), [The Gemsbok](https://thegemsbok.com/mini-motorways), [Twinfinite](https://twinfinite.net/reviews/mini-motorways-review/), [Nook Gaming](https://www.nookgaming.com/mini-motorways-review/), [Game Informer](https://www.gameinformer.com/review/mini-motorways/contemplative-commute), [Scientific Gamer](https://scientificgamer.com/thoughts-mini-motorways/)
- shapez: [shapez 2 wiki — Milestones](https://shapez2.wiki.gg/wiki/Milestones), [shapez 2 wiki — Upgrades](https://shapez2.wiki.gg/wiki/Upgrades), [Steam 토론](https://steamcommunity.com/app/1318690/discussions/0/2519149567496656154), [Archipelago 문서](https://archipelago.gg/games/shapez/info/en)
- Two Point Hospital: [SuperCheats 직원 가이드](https://www.supercheats.com/two-point-hospital-walkthrough-guide/staff-guide), [Common Sense Gamer](https://commonsensegamer.com/two-point-hospital-staff-management-guide-to-specialize-doctors-nurses-and-assistants/), [Gamers Decide](https://gamersdecide.com/articles/two-point-hospital-best-training), [Steam 토론](https://steamcommunity.com/app/535930/discussions/0/1737715419909041491)
- Little Big Workshop: [Xbox Tavern](https://www.xboxtavern.com/little-big-workshop-review/), [Third Coast Review](https://thirdcoastreview.com/2020/10/02/review-little-big-workshop), [Bonus Stage](https://www.bonusstage.co.uk/archives/176389), [Steam 토론](https://steamcommunity.com/app/574720/discussions/0/2948124408725216626)
- Production Line: [Positech FAQ](https://positech.co.uk/productionline/faq.html), [Positech 포럼 시작 가이드](https://forums.positech.co.uk/t/getting-started-guide/9470), [GOG](https://www.gog.com/en/game/production_line?page=3)
- Big Pharma: [Chemistry World](https://www.chemistryworld.com/culture/big-pharma/9195.article), [Game Wisdom](https://game-wisdom.com/?p=13372), [Scientific Gamer](https://scientificgamer.com/thoughts-big-pharma/)
- Opus Magnum: [Wikipedia](https://en.wikipedia.org/wiki/Opus_Magnum), [PC Gamer](https://www.pcgamer.com/perfectly-solving-opus-magnums-puzzles-is-impossible-but-thats-ok), [Game Digest](https://antskilton.github.io/review/opus-magnum), [Steam 토론](https://steamcommunity.com/app/558990/discussions/0/1742229167201633990)
- Islanders: [Wikipedia](https://en.wikipedia.org/wiki/Islanders_(video_game)), [Turn Based Lovers](https://turnbasedlovers.com/review/islanders-new-shores-impressions/), [Vaporlens](https://vaporlens.app/app/1046030/islanders)
- Rusty's Retirement: [Wikipedia](https://en.wikipedia.org/wiki/Rusty%27s_Retirement), [Destructoid](https://www.destructoid.com/cozy-corner-stay-productive-with-this-farming-sim-that-uses-a-fraction-of-your-screen/), [Gameplay.tips 봇 가이드](https://gameplay.tips/guides/rustys-retirement-bots-guide-harvest-biofuel-berry-feeder-and-others.html)
- RimWorld: [RimWorld Wiki — Work](https://rimworldwiki.com/wiki/Work), [WorkTab 모드](https://github.com/MrClon/WorkTab)
- Good Company: [Screen Rant](https://screenrant.com/good-company-game-review/), [CogConnected](https://cogconnected.com/?p=313009), [PC Gamer](https://www.pcgamer.com/theres-some-factorio-dna-in-this-tycoon-game-about-running-a-calculator-factory), [Vaporlens](https://vaporlens.app/app/911430/good_company)
