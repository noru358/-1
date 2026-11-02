# 밥 먹으면서 하는 게임

밥 먹으면서 틀어 두는 게임을 찾고 만드는 프로젝트다. 지금 만들고 있는 것은 **꼬물이 에이전트 회사**(가제)다. 컴퓨터 속 작은 꼬물이들이 인간의 주문을 부품으로 나눠 만들고 조립해 보낸다. 꼬물이마다 기질이 있어서 가끔 그럴듯한 거짓말(!환각)을 섞고, 검수대가 그걸 잡거나 놓친다. 플레이어는 방과 길을 회로처럼 짜고, 지켜보다가 꼬물이를 툭 누른다.

## 문서 지도
**새 세션은 [HANDOFF.md](HANDOFF.md)부터 읽는다.**

| 흐름 | 문서 | 역할 | 담는 것 | 담지 않는 것 |
|---|---|---|---|---|
| 1 | [DESIGN.md](DESIGN.md) | **총괄 기획** | 왜·누구를 위해, 기준과 원칙(기반), 현재 방향, 프로젝트 수준의 열린 질문, 용어 | 규칙 숫자, 코드, 시제품 상세 |
| 2 | [DESIGN_EMBODIMENT.md](DESIGN_EMBODIMENT.md) | **구체화 기록** | 기획을 씨앗과 시제품으로 구체화하며 받은 피드백, 결정, 교훈(시간순) | 현재 명세, 외부 게임 사실 |
| 3 | [BLUEPRINT_TEST2.md](BLUEPRINT_TEST2.md) | **현재 게임 청사진(v5)** | 지금 버전의 규칙, 숫자, 화면, 조작, 코드 구조, 검증, 다음 단계. v4와 같은 부분은 TEST1을 가리킨다 | 결정 경위 |
| 3-이전 | [BLUEPRINT_TEST1.md](BLUEPRINT_TEST1.md) | 이전 청사진(v4) | v4 명세. v5에서 안 바뀐 규칙(길, 배부, 분업, 목표)의 원본 | |
| 근거 | [REFERENCES.md](REFERENCES.md) | **레퍼런스 조사** | 다른 게임과 자료에서 본 사실, 도트 크기 조사, 패턴 | 우리 게임에 대한 결정 |

**내용이 서로 다를 때**: DESIGN이 맞다 → 그다음 BLUEPRINT_TEST2(현재 명세) → BLUEPRINT_TEST1 → DESIGN_EMBODIMENT(지난 기록)이다. 기준을 바꾸려면 DESIGN부터 고치고, 하위 문서를 맞춘다.

**어디에 적나**
- 바꾸지 않을 생각, 원칙 → DESIGN
- 왜 그렇게 됐나, 피드백 → DESIGN_EMBODIMENT
- 지금 게임의 규칙과 숫자 → BLUEPRINT_TEST2
- 남의 게임과 자료에서 본 것 → REFERENCES

## 시제품
| 파일 | 무엇 | 원본 | 바로 해 보기 |
|---|---|---|---|
| `agents.html` | **꼬물이 에이전트 회사 v5 (현재)**: 기질, 환각·영감, 탕비실, 증축, 한 번 누르기 | `agents/`(shell.html + src/*.js 모듈) | [링크](https://claude.ai/artifact/R3qwGUoi3xDEH4YuXE7KUH) (v4 링크를 v5로 갱신) |
| `kkomul.html` | 컴퓨터 속 꼬물이 v0 (옆에서 본 4층 단면) | `kkomul.src.html` | [링크](https://claude.ai/artifact/LFFDCkpmERnDzzuCRnxQEW) |
| `sizes.html` | 꼬물이 도트 크기 비교 판 (8~32px) | `sizes.src.html` | [링크](https://claude.ai/artifact/65eisHsbo1ADKugY8PFCfu) |
| `index.html` | 을지로 관제실 (첫 시제품, 서울나이트워치 세계관) | `game.src.html` | [링크](https://claude.ai/artifact/SuZWfxh6gmf4jff3fEVSFU) |

모든 html은 글꼴까지 한 파일에 들어 있어서 브라우저로 바로 열린다. 링크는 만든 사람 계정에서만 열린다. v4 코드는 git 기록(커밋 `a51d755`)에 있다. `agents.html?seed=숫자`로 열면 같은 판이 다시 나온다.

## 빌드
```
pip install fonttools brotli
python3 build.py <Galmuri11.woff2> agents agents.html             # 모듈 폴더
python3 build.py <Galmuri11.woff2> kkomul.src.html kkomul.html    # 한 파일 원본
python3 build.py <Galmuri11.woff2>                                # game.src.html → index.html
```
`build.py`는 원본에 쓰인 글자만 남긴 갈무리11 글꼴(SIL OFL)을 base64로 넣는다. 폴더를 주면 `shell.html`과 `src/*.js`(파일 이름 순서)를 한 파일로 묶는다. 글꼴 원본은 `noru358/watch`의 `tools/artlab/fonts/Galmuri11.woff2`에 있다.
