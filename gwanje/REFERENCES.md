# 레퍼런스 조사

다른 게임과 자료에서 **본 것**만 적는다. 우리 게임에 대한 결정은 적지 않는다(결정 → [DESIGN.md](DESIGN.md), 적용 상태 → [BLUEPRINT.md](BLUEPRINT.md) 3장, 경위 → [CONCEPTS.md](CONCEPTS.md)).

출처는 각 게임의 리뷰, 위키, 공략, 커뮤니티 글(2026-11 확인), 직접 해 보거나 잰 것, Claude가 알고 있던 내용이다. 커뮤니티 자료라 세부 수치는 버전마다 다를 수 있다. 확인하지 못한 수치는 적지 않았다.

- **A. 출발점이 된 것**: 기획 초기에 직접 보거나 해 본 것
- **B. 도트 크기 조사**
- **C. 구조 설계·흐름 관리 게임 역설계** (11종)
- **D. 패턴 라이브러리**

---

## A. 출발점이 된 것

### A1. baramutzero-netizen의 속담·사자성어 게임 4종 (직접 해 봄)
같은 만든이가 만든, 한 파일짜리 도트 인크리멘탈 게임이다. 구조가 모두 같다.
- 버튼 하나를 눌러 자원을 모은다.
- 노드 트리로 업그레이드한다.
- 장소를 옮겨 가며 풍자의 대상이 커진다.
- 갈무리 계열 글꼴, 장소마다 악단(배경음)이 쌓이고, 끝나면 결과 카드가 나온다.

| 게임 | 핵심 장치 |
|---|---|
| [소 잃고 외양간 고친다](https://baramutzero-netizen.github.io/barnfix/) (barnfix) | 고칠 때마다 무언가를 잃고, 화면에 "미리 막은 일 0번"이 끝까지 고정된다. 소 → 손님 → 시청자 → 고객 → 신뢰 → 자금 → 가족과의 시간 → 건강 순으로 8곳. 대책 110여 개 |
| [소 귀에 경 읽기](https://baramutzero-netizen.github.io/moktak/) | 목탁을 치면 경이 한쪽 귀로 들어가 반대로 나온다. 장소 10곳, 이름이 '소'로 끝나는 소 59마리, 열반 엔딩 |
| [조삼모사](https://baramutzero-netizen.github.io/josammosa/) | 하루 총량은 늘 7인데 포장만 바뀐다. 장소 7곳, 전략 72개 |
| [앙천이타](https://baramutzero-netizen.github.io/skyspit/) | 위로 뱉은 것이 체공 시간 뒤 전부 돌아온다. 하늘에 떠 있는 양이 계속 불어난다 |

**관찰**
- barnfix는 자동 클릭 봇(초당 약 26회, 가장 싼 것부터 구매)으로 3분 12초에 끝났다. 한 판은 5분 남짓이다.
- 강점: 아이디어와 연출, 풍자, 화면에 땜질 흔적이 쌓이는 것.
- 약점: 가장 싼 것만 사도 막힘이 없다. 고를 거리가 없어서 다시 할 이유가 거의 없다.

### A2. steamcity (odwo.kr/steamcity)
화려한 도시 야경에서 자동차와 비행체가 살아 있는 것처럼 계속 움직인다. 새로운 세계 같은 느낌이고, 규칙 없이 막 만든 게 아니라 사람이 봤을 때 어색하지 않게 만들어졌다. 사용자의 설명이다(이 작업 환경에서는 접속이 막혀 직접 보지 못했다).

### A3. 그 밖에 기준이 된 것
- **Claude Code의 Clawd**: 작은 격자에 그린 8비트 게 마스코트(주황 몸, 검은 눈). 터미널 블록 문자로도 그린다. 아주 작아도 실루엣이 읽힌다. 독(Dock)이나 시스템 트레이에 사는 팬 프로젝트가 여럿 있다.
- **세피리아**(팀 호레이): 탑다운 액션 로그라이트. 귀여운 토끼 도트가 매력으로 꼽힌다. 2025년 정식 출시 뒤 스팀 동시접속 3만 4천 명 이상(게임메카 보도).
- ***No, I'm not a Human***: 매일 TV와 라디오가 새 정보(검사 방법, 전화번호, 단서)를 전한다. 방송을 메인 놀이가 아니라 **세계의 정보를 전하는 매체**로 쓰는 예다.
- ***일하는 세포***: 몸속의 작은 일꾼을 의인화한 작품. "시스템 속 작은 일꾼"이라는 결의 대중성이 검증된 예로 언급했다(작품 사실 외의 수치 없음).
- **바탕 화면 한쪽에 띄워 두는 방치형 흐름**: Rusty's Retirement(2024), Tiny Pasture, Ropuka's Idle Island, Desktop Defender, Cornerpond(2025). 형식은 시장에서 검증됐지만 농장과 낚시가 대부분이다.
- **Microcivilization**: 작은 사람들로 문명을 키우는 인크리멘탈. 재난, 전쟁, 질병이 숫자로 들이닥친다. 단계를 올리고 환생한다.

## B. 도트 크기 조사
- **일반 기준**(제작 가이드와 커뮤니티)
  - 16×16: 여럿이 나오는 탑다운. 실루엣과 색으로 읽힌다.
  - 32×32: 가장 흔한 기본값.
  - 48×48 이상: 표정과 디테일.
  - "16×16 게임"이라고 하면 보통 캐릭터가 아니라 타일 크기를 말한다.
- **세피리아 실측**(사용자가 보낸 스크린샷을 확대해 픽셀을 셈)
  - 토끼 캐릭터: 폭 약 9~10, 키 약 12픽셀.
  - 게임 화면: 대략 320×180을 크게 늘린 것. HUD 글자는 이보다 고해상도로 그려져 있다.
- **크기 비교 판**(`sizes.html`): 같은 꼬물이를 8, 12, 16, 24, 32픽셀로 직접 찍었다. 같은 화면(가로 320×180)에 들어가는 양은 아래와 같다.

| 꼬물이 키 | 층 | 방 | 꼬물이 수 |
|---|---|---|---|
| 8 | 8 | 72 | 101 |
| 12 | 5 | 30 | 42 |
| 16 | 4 | 16 | 22 |
| 24 | 3 | 9 | 13 |
| 32 | 2 | 4 | 6 |

- **작업 방식 비교**(12~16px 기준)
  - AI 그림을 줄여서 도트로 바꾸면 뭉개진 픽셀(믹셀)과 잡음이 남고, 장마다 비율, 선, 색이 달라 통일이 어렵다.
  - 코드로 규칙(팔레트, 외곽선, 빛 방향)을 고정해 찍은 초안은 통일성이 있고, 손볼 양이 "몇 픽셀 바꾸기"로 줄어든다.

---

## C. 구조 설계·흐름 관리 게임 역설계

### 해부 틀
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

### C1. Mini Motorways (Dinosaur Polo Club)
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

### C2. shapez / shapez 2 (tobspr)
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

### C3. Two Point Hospital (Two Point Studios)
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

### C4. Little Big Workshop (HandyGames)
- **설계하는 것**: 작업대와 기계 배치, **계획 화면에서 제품 하나를 부품으로 쪼개 각 단계를 어느 기계에서 할지 정하기**.
- **부품 규칙**: 제품 = 부품 여러 개(나무, 금속, 플라스틱), 부품마다 가공 단계, 마지막에 조립.
- **수요**: 계약 게시판에서 고른다. 납기와 보수.
- **막힘**: 작업자 동선, 기계 부족, 납기. 부품이 많을수록 계획, 작업대, 작업자가 더 필요하다.
- **피드백**: 탁자 위 미니어처 공장에서 작은 작업자들이 오가는 모습.
- **성장**: 재료 숙련도, 작업자 수, 공장 확장, 협상력. 작업자는 공정의 일부에 특화할 수 있다.
- **약점**
  - 할 일이 있는데 작업자가 서서 노는 AI 문제(사용자 불만).
  - 너무 느리고 수동적이라는 평.
  - 계획 화면에서 일을 나눌 방법이 없다는 아쉬움.
  - 끝 목표가 없다.
- **밥 먹으면서**: 보는 재미 ◎, 계획은 차분히(멈춤 상태에서) ○.

### C5. Production Line (Positech)
- **설계하는 것**: 자동차 조립 라인의 **슬롯**(공정 칸) 배치와 연결, 연구.
- **부품 규칙**: 슬롯 하나 = 공정 하나. 차가 슬롯을 차례로 지나간다.
- **핵심 장치: 느린 공정을 쪼개는 연구**
  - 예를 들어 "차대" 슬롯 하나를 연구로 "차축 + 롤케이지 + 구동축" 세 슬롯으로 나눈다.
  - 라인은 길어지지만 훨씬 빨라진다.
  - **업그레이드가 숫자가 아니라 구조를 바꾼다.**
- **막힘**: 가장 느린 슬롯. 수출 속도에 라인 속도를 맞추는 게 전략이다.
- **약점**: 처음부터 너무 복잡하다, 기술 트리가 과하다(사용자 평).
- **밥 먹으면서**: 보는 재미 ○, 처음 진입이 어렵다 ✕.

### C6. Big Pharma (Twice Circled / Positech)
- **설계하는 것**: 공장 바닥의 기계와 벨트(좁은 바닥 면적이 핵심 제약).
- **부품 규칙**
  - 재료마다 농도, 효능, 부작용이 있다.
  - 기계가 **농도를 +1(증발기), −1(희석기)** 같은 식으로 바꾼다.
  - 높은 단계 효과는 **촉매**가 있어야 하고, 촉매는 부작용을 데려온다.
- **콘텐츠**: 재료 × 농도 범위 × 기계 연산 = 퍼즐. 시장 가격과 경쟁사가 경영 층을 얹는다.
- **가져올 점**: **숫자 하나(농도)를 범위 안에 맞추는** 아주 직관적인 변환 퍼즐. 촉매처럼 **좋은 것에 대가가 붙는 규칙**.

### C7. Opus Magnum (Zachtronics)
- **설계하는 것**: 연금술 기계(팔, 궤도, 명령 순서).
- **점수**: 해법마다 **비용(G), 속도(사이클), 면적(칸)** 세 지표를 따로 매긴다.
- **피드백: 히스토그램**
  - 순위표 대신, 모든 플레이어 해법의 분포에서 내 해법이 어디쯤인지 보여 준다.
  - "순위표보다 훨씬 똑똑하다"는 평.
- **긴장**: 면적과 비용은 함께 좋아지는 편이고, 속도는 둘과 반대로 간다. 그래서 **같은 퍼즐을 다른 지표로 다시 푼다.**
- **숨은 네 번째 지표**: 기계가 얼마나 보기 좋은가. 예쁜 기계 자체가 보상이라는 평.
- **가져올 점**: 하루 보고를 "처리 수" 하나가 아니라 **서로 당기는 지표 2~3개**로.

### C8. Islanders (Grizzly Games)
- **설계하는 것**: 건물 하나를 어디에 놓을지.
- **부품 규칙**: 건물마다 **반경 안의 다른 건물과 자연물로 점수**를 얻는다. 건물마다 반경이 다르다.
- **피드백**: **놓기 전에 점수를 미리 보여 준다.** 옮겨 보며 최선의 자리를 찾는다.
- **약점**: 자유 배치라 한 픽셀 자리 찾기가 답답하다는 평 → **격자 배치**가 낫다는 근거.
- **가져올 점**: 이웃 효과의 **미리보기**. 규칙이 단순해도 놓는 자리가 판단이 된다.

### C9. Rusty's Retirement (Mister Morris Games)
- **형태**: **화면 아래 띠에 붙어 있는** 방치형 농장. 다른 일을 하면서 돌린다.
- **구조**
  - 처음엔 손으로 심고 거둔다.
  - 작물 → 바이오연료 → 부품 → 로봇과 건물.
  - 로봇이 심기, 물 주기, 거두기를 맡는다.
  - 로봇은 살수록 비싸지고, 업그레이드는 **적재량과 속도** 두 가지다.
- **피드백**: 확대와 축소, 덜 신경 쓰이게 하는 집중 모드(작물 생산이 느려짐).
- **가져올 점**: **"손으로 시작 → 자동화"**의 단계. 옆 창이나 띠 화면 형식. 업그레이드 축을 두 개로 단순하게.
- **밥 먹으면서**: ◎. 이 형식이 이미 시장에서 검증됐다.

### C10. RimWorld의 작업 탭 (Ludeon)
- **설계하는 것**: 정착민 × 작업 종류 **우선순위 표**. 숫자 1이 먼저다. 못 하는 일은 칸 자체가 없다.
- **가져올 점**: **"누가 무엇을 먼저"**를 표 한 장으로 설계하게 하는 방식. 규칙 설계를 가장 간단하게 구현하는 형태다.
- **경고**: 세부 작업까지 우선순위를 쪼개면 **교착(데드락)**이 생길 수 있다고 모드 제작자가 경고한다.

### C11. Good Company (Chasing Carrots) — 경고 사례
- 제품을 설계하고 생산 라인을 돌리는 경영 공장 게임. Factorio 느낌이라는 평.
- **불만**
  - 라인을 다시 짜고 재고를 다루는 일이 지나치게 손이 많이 간다.
  - 생산 테이블을 하나하나 손으로 바꿔야 한다.
  - 물류가 감당이 안 된다.
- **교훈**: **설계를 바꾸는 비용(손이 가는 정도)이 크면 "다시 설계" 고리가 귀찮음이 된다.** 옮기기, 복사, 일괄 변경은 싸야 한다.

---

## D. 패턴 라이브러리

여러 게임에서 되풀이되는 설계 장치다. 우리 게임에 어떻게 썼는지는 [BLUEPRINT.md](BLUEPRINT.md) 3장에 있다.

| # | 패턴 | 출처 |
|---|---|---|
| P1 | **길(연결)을 화폐로**: 연결에 드는 자원이 한정되어 모든 선택이 트레이드오프가 된다 | Mini Motorways |
| P2 | **둘 중 하나 + 대가**: 좋은 도구일수록 딸려 오는 기본 자원이 적다 | Mini Motorways |
| P3 | **수요가 판을 흔든다**: 새 수요가 예측 못 한 곳에 생긴다 | Mini Motorways |
| P4 | **보이는 경고 타이머**: 실패 전에 눈과 귀로 예고 | Mini Motorways |
| P5 | **연산 조합 = 콘텐츠**: 방 하나 = 변환 하나, 요청 = 변환들의 조합 | shapez, Big Pharma |
| P6 | **목표가 곧 해금** | shapez |
| P7 | **느린 단계를 쪼개는 연구**: 업그레이드가 구조를 바꾼다 | Production Line |
| P8 | **경로 + 자격**: 일마다 정해진 방 순서, 방마다 필요한 직원 자격 | Two Point Hospital |
| P9 | **계획 화면**: 제품을 부품으로 쪼개고 단계마다 담당 기계를 정함 | Little Big Workshop |
| P10 | **서로 당기는 다중 지표 + 분포** | Opus Magnum |
| P11 | **놓기 전 미리보기** | Islanders |
| P12 | **우선순위 표** | RimWorld |
| P13 | **손으로 시작 → 자동화** | Rusty's Retirement |
| P14 | **다시 설계하는 비용은 싸게** | Good Company(반면교사) |
| P15 | **작업자가 놀면 안 된다** | Little Big Workshop(반면교사) |

**공통 고리**: 단순한 부품을 놓는다 → 혼자 돈다 → 막히는 곳이 보인다 → 옮기거나 더한다 → 수요가 바뀌어 다른 곳이 막힌다.

---

## 출처
- 출발점: [게임메카 세피리아](https://www.gamemeca.com/view.php?gid=249498), [Clawd (Stark Insider)](https://www.starkinsider.com/2025/10/clawd-ai-retro-mascot-command-line.html), [Clawd (classmethod)](https://dev.classmethod.jp/en/articles/love-clawd-claude-code/), [바탕 화면 방치형 흐름 (GamePressure)](https://www.gamepressure.com/newsroom/from-rustys-retirement-to-tiny-pasture-the-new-wave-of-desktop-bu/z679b4), [Microcivilization (PC Gamer)](https://pcgamer.com/build-a-big-tower-get-punished-by-god-in-incremental-clicker-microcivilization), [No, I'm not a Human 가이드](https://grindnstrat.com/?p=4378)
- 도트 크기: [Wayline](https://www.wayline.io/learn/pixel-art/0), [OpenGameArt](https://opengameart.org/forumtopic/average-pixel-art-size)
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
