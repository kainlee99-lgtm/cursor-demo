import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { IncomingMessage } from 'node:http';
import { Socket } from 'node:net';

process.env.AUTH_DEMO_EMAIL = 'test@example.com';
process.env.AUTH_DEMO_PASSWORD = 'test-password';
process.env.AUTH_TOKEN_SECRET = 'test-secret';

/** @type {typeof import('./app.mjs').handleRequest} */
let handleRequest;

before(async () => {
  ({ handleRequest } = await import('./app.mjs'));
});

/**
 * 테스트용 HTTP 요청 객체를 만든다.
 * @param {{ method: string; url: string; body?: unknown }} options 요청 옵션
 * @returns {import('node:http').IncomingMessage}
 */
function createMockRequest({ method, url, body }) {
  const socket = new Socket();
  const req = new IncomingMessage(socket);
  req.method = method;
  req.url = url;
  req.headers = { host: 'localhost' };

  const payload = body === undefined ? '' : JSON.stringify(body);
  req.push(payload);
  req.push(null);

  return req;
}

/**
 * 테스트용 HTTP 응답 객체를 만든다.
 * @returns {import('node:http').ServerResponse & { statusCode: number; body: string }}
 */
function createMockResponse() {
  return /** @type {import('node:http').ServerResponse & { statusCode: number; body: string }} */ ({
    statusCode: 200,
    body: '',
    writeHead(statusCode) {
      this.statusCode = statusCode;
    },
    end(data) {
      this.body = data;
    },
  });
}

test('POST /api/auth/login — 올바른 자격 증명으로 토큰을 반환한다', async () => {
  const req = createMockRequest({
    method: 'POST',
    url: '/api/auth/login',
    body: { email: 'test@example.com', password: 'test-password' },
  });
  const res = createMockResponse();

  await handleRequest(req, res);

  assert.equal(res.statusCode, 200);
  const body = JSON.parse(res.body);
  assert.ok(body.token);
  assert.equal(body.user.email, 'test@example.com');
});

test('POST /api/auth/login — 잘못된 비밀번호는 401을 반환한다', async () => {
  const req = createMockRequest({
    method: 'POST',
    url: '/api/auth/login',
    body: { email: 'test@example.com', password: 'wrong-password' },
  });
  const res = createMockResponse();

  await handleRequest(req, res);

  assert.equal(res.statusCode, 401);
});

test('POST /api/auth/login — 잘못된 이메일 형식은 401을 반환한다', async () => {
  const req = createMockRequest({
    method: 'POST',
    url: '/api/auth/login',
    body: { email: 'not-an-email', password: 'test-password' },
  });
  const res = createMockResponse();

  await handleRequest(req, res);

  assert.equal(res.statusCode, 401);
});

test('POST /api/auth/login — 필수 필드 누락 시 400을 반환한다', async () => {
  const req = createMockRequest({
    method: 'POST',
    url: '/api/auth/login',
    body: { email: 'test@example.com' },
  });
  const res = createMockResponse();

  await handleRequest(req, res);

  assert.equal(res.statusCode, 400);
});
