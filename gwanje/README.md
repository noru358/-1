# 을지로 관제실

밥 먹으면서 틀어 두는 게임 기획과 첫 시제품 "을지로 관제실"(서울나이트워치 세계관). 게임 형태는 아직 열려 있다.

- **설계 청사진(이것 하나로 다시 만들 수 있게)**: [BLUEPRINT.md](BLUEPRINT.md)
- 기획과 생각: [DESIGN.md](DESIGN.md), 씨앗과 시제품 기록: [CONCEPTS.md](CONCEPTS.md), 레퍼런스 역설계: [REFERENCES.md](REFERENCES.md)
- 현재 시제품: `agents.html`(꼬물이 에이전트 회사 v4). 원본은 `agents/`(shell.html + src/*.js 모듈). 빌드: `python3 build.py <Galmuri11.woff2> agents agents.html`
- 플레이: `index.html`을 브라우저로 열면 된다. 글꼴까지 한 파일에 들어 있다.

## 파일
| 파일 | 내용 |
| --- | --- |
| `game.src.html` | 게임 원본. 글꼴 자리에 `__FONT__` 표시가 있다 |
| `build.py` | 원본에 쓰인 글자만 남긴 갈무리11 글꼴을 넣어 `index.html`을 만든다 |
| `index.html` | 완성된 한 파일 |

## 다시 빌드하기
```
pip install fonttools brotli
python3 build.py <Galmuri11.woff2 경로>
```
글꼴 파일은 `noru358/watch`의 `tools/artlab/fonts/Galmuri11.woff2`에 있다(SIL OFL).
