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

### Cursor 설정 예시 (`.cursor/mcp.json`)

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

> API 키와 토큰은 실제 값 대신 플레이스홀더를 사용하세요. 절대 저장소에 비밀 값을 커밋하지 마세요.

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
