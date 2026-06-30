# cursor-demo

Cursor AI 실습 프로젝트입니다.

## 사용한 MCP 서버

이 프로젝트에서 Cursor Agent와 함께 사용한 MCP(Model Context Protocol) 서버 목록입니다.

| MCP 이름 | 종류 | 저장소 / 엔드포인트 | 용도 |
|----------|------|---------------------|------|
| **Sequential Thinking** | stdio (npx 로컬 실행) | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) — 패키지: `@modelcontextprotocol/server-sequential-thinking` | 복잡한 문제를 단계적으로 분석·추론 (예: TODO 앱 기술 스택 선정) |
| **GitHub** | HTTP (원격 MCP) | [github/github-mcp-server](https://github.com/github/github-mcp-server) — 엔드포인트: `https://api.githubcopilot.com/mcp/` | GitHub 저장소 조회, 생성, 파일 업로드 등 Git 작업 자동화 |
| **Context7** | HTTP (원격 MCP) | [upstash/context7](https://github.com/upstash/context7) — 엔드포인트: `https://mcp.context7.com/mcp` | 라이브러리·프레임워크 최신 공식 문서 조회 |

### MCP 종류 설명

- **stdio (npx 로컬 실행)**: Cursor가 `npx`로 MCP 서버 프로세스를 로컬에서 실행하고, 표준 입출력(stdio)으로 통신합니다.
- **HTTP (원격 MCP)**: URL 엔드포인트로 연결하는 호스팅형 MCP 서버입니다. API 키 또는 토큰 인증이 필요할 수 있습니다.

---

## MCP 설치 방법

### 공통 사전 준비

1. **Cursor IDE** 최신 버전 설치
2. **Node.js 18 이상** 설치 (Sequential Thinking, Context7 CLI 사용 시 필요)
3. MCP 설정 파일 위치 확인
   - **전역 설정 (권장)**: Windows `C:\Users\<사용자명>\.cursor\mcp.json`
   - **프로젝트별 설정**: 프로젝트 루트의 `.cursor/mcp.json`
4. 설정 저장 후 **Cursor 재시작** 또는 **Settings → MCP → 서버 새로고침**

---

### 1. Sequential Thinking MCP

복잡한 문제를 단계적으로 분석할 때 사용하는 로컬 MCP 서버입니다. 별도 API 키가 필요 없습니다.

#### 사전 요구사항

- Node.js 18+
- npm / npx (Node.js 설치 시 함께 제공)

#### 설치 단계

**방법 A — Cursor UI에서 추가**

1. `Cursor Settings` → `MCP` 이동
2. `Add new MCP server` 클릭
3. 아래 설정 입력

| 항목 | 값 |
|------|-----|
| Name | `sequential-thinking` |
| Type | `command` (stdio) |
| Command | `npx` |
| Args | `-y`, `@modelcontextprotocol/server-sequential-thinking` |

**방법 B — mcp.json에 직접 추가**

`~/.cursor/mcp.json` 파일에 다음 블록을 추가합니다.

```json
"sequential-thinking": {
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
}
```

#### 동작 확인

1. Cursor Settings → MCP에서 `sequential-thinking` 서버 상태가 **녹색(연결됨)** 인지 확인
2. Agent 채팅에서 *"Sequential Thinking MCP를 사용해서 ~를 분석해줘"* 와 같이 요청
3. `sequentialthinking` 도구가 호출되면 정상 동작

#### 문제 해결

| 증상 | 해결 방법 |
|------|-----------|
| 서버 시작 실패 | `node -v`, `npx -v`로 Node.js/npx 설치 확인 |
| 첫 실행이 느림 | `npx -y @modelcontextprotocol/server-sequential-thinking`을 터미널에서 한 번 실행해 패키지 캐시 |
| 빨간색 오류 표시 | Cursor 재시작 후 MCP 서버 새로고침 |

---

### 2. GitHub MCP

GitHub 저장소·이슈·PR·파일 등을 Agent가 직접 다룰 수 있게 해 주는 원격 MCP 서버입니다.

#### 사전 요구사항

- GitHub 계정
- **Personal Access Token (PAT)** — Fine-grained 또는 Classic 토큰
- Cursor (원격 MCP 지원 버전)

#### 1단계: GitHub Personal Access Token 발급

1. [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens) 접속
2. **Generate new token** 클릭
3. 권한(Scope) 설정 — 최소 권장:
   - `repo` — 저장소 읽기/쓰기
   - `read:org` — 조직 저장소 조회 (필요 시)
4. 토큰 생성 후 **한 번만 표시되는 값을 안전한 곳에 복사** (다시 볼 수 없음)

> Fine-grained token 사용 시: 대상 저장소를 지정하고 Contents, Metadata, Pull requests 등 필요한 권한을 개별 선택하세요.

#### 2단계: Cursor에 GitHub MCP 등록

**방법 A — Cursor UI에서 추가**

1. `Cursor Settings` → `MCP` 이동
2. `Add new MCP server` 클릭
3. Type을 **HTTP / SSE** 로 선택
4. URL: `https://api.githubcopilot.com/mcp/`
5. Header에 `Authorization: Bearer <YOUR_GITHUB_TOKEN>` 추가

**방법 B — mcp.json에 직접 추가**

```json
"github": {
  "url": "https://api.githubcopilot.com/mcp/",
  "headers": {
    "Authorization": "Bearer <YOUR_GITHUB_TOKEN>"
  }
}
```

#### 동작 확인

1. MCP 목록에서 `github` 서버가 **연결됨** 상태인지 확인
2. Agent에게 *"GitHub MCP로 내 저장소 목록을 보여줘"* 요청
3. `get_me`, `search_repositories`, `push_files` 등 도구가 사용 가능하면 성공

#### 문제 해결

| 증상 | 해결 방법 |
|------|-----------|
| Tool not found | MCP 서버 재시작, Cursor 재시작 |
| 인증 오류 (401) | PAT 만료·오타 확인, `Bearer ` 접두사 포함 여부 확인 |
| 권한 오류 (403) | PAT scope에 `repo` 등 필요 권한 추가 후 토큰 재발급 |
| 조직 저장소 접근 불가 | SSO 조직이면 토큰에 SSO 승인 필요 |

#### 참고: 로컬 실행 방식 (선택)

원격 서버 대신 로컬에서 실행하려면 [github/github-mcp-server](https://github.com/github/github-mcp-server) 저장소의 Docker/바이너리 방식을 사용할 수 있습니다. 이 프로젝트에서는 **원격 엔드포인트 방식**을 사용했습니다.

---

### 3. Context7 MCP

라이브러리·프레임워크의 **최신 공식 문서**를 Agent 컨텍스트에 주입해 주는 원격 MCP 서버입니다.

#### 사전 요구사항

- Context7 API Key (무료 발급 가능)
- Node.js 18+ (자동 설치 CLI 사용 시)

#### 1단계: API Key 발급

1. [context7.com/dashboard](https://context7.com/dashboard) 접속 후 계정 생성/로그인
2. API Key 생성
3. 생성된 키를 복사 (`ctx7sk-...` 형식)

> API Key를 사용하면 요청 한도가 더 높아집니다. 키 없이도 제한적으로 사용 가능하지만, 권장하지 않습니다.

#### 2단계: Cursor에 Context7 MCP 등록

**방법 A — 자동 설치 CLI (권장)**

터미널에서 아래 명령을 실행합니다.

```bash
npx ctx7 setup --cursor
```

- OAuth 인증 후 API Key 생성 및 Cursor 설정을 자동으로 처리합니다.
- 제거 시: `npx ctx7 remove`

**방법 B — mcp.json에 직접 추가**

```json
"context7": {
  "url": "https://mcp.context7.com/mcp",
  "headers": {
    "CONTEXT7_API_KEY": "<YOUR_API_KEY>"
  }
}
```

#### 3단계 (선택): Cursor Rule 추가

Context7을 자동으로 활용하려면 Cursor Rules에 아래 내용을 추가합니다.

```
라이브러리/API 문서, 코드 생성, 설정 방법이 필요할 때는 명시적으로 요청하지 않아도 Context7 MCP를 사용하세요.
```

#### 동작 확인

1. MCP 목록에서 `context7` 서버 연결 확인
2. Agent에게 *"Context7로 React useEffect 최신 문서를 찾아줘"* 요청
3. `resolve-library-id`, `query-docs` 도구가 호출되면 성공

#### 활용 팁

- 특정 라이브러리를 지정: `use library /vercel/next.js`
- 버전 지정: `Next.js 14 middleware 설정 방법 use context7`

#### 문제 해결

| 증상 | 해결 방법 |
|------|-----------|
| Rate limit 초과 | [dashboard](https://context7.com/dashboard)에서 API Key 발급·적용 |
| 라이브러리를 찾지 못함 | 프롬프트에 Context7 library ID(`/org/project`) 명시 |
| MCP 연결 실패 | URL 끝 슬래시·헤더 키 이름(`CONTEXT7_API_KEY`) 확인 |

---

### 전체 설정 예시 (`~/.cursor/mcp.json`)

세 MCP를 한 번에 설정한 전체 예시입니다.

```json
{
  "mcpServers": {
    "context7": {
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "<YOUR_API_KEY>"
      }
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    },
    "github": {
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer <YOUR_GITHUB_TOKEN>"
      }
    }
  }
}
```

> **보안 주의**: API Key와 GitHub Token은 실제 값 대신 플레이스홀더를 사용하세요. `mcp.json`을 Git 저장소에 커밋하지 마세요. 실수로 커밋했다면 즉시 토큰을 폐기하고 재발급하세요.

---

## 프로젝트 구조

```
cursor-demo/
├── .cursor/rules/     # Cursor 코딩 규칙
├── docs/              # 실습 워크북
├── src/
│   ├── email.js       # 이메일 유효성 검증
│   ├── email.test.js  # 이메일 테스트
│   ├── stringUtils.mjs
│   └── index.js
└── package.json
```

## 테스트 실행

```bash
npm test
```
