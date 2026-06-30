import { verifyCredentials, issueToken } from '../services/authService.mjs';

/**
 * JSON 응답을 전송한다.
 * @param {import('node:http').ServerResponse} res HTTP 응답 객체
 * @param {number} statusCode 상태 코드
 * @param {unknown} body 응답 본문
 */
function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

/**
 * POST /api/auth/login 요청을 처리한다.
 * @param {import('node:http').IncomingMessage} req HTTP 요청 객체
 * @param {import('node:http').ServerResponse} res HTTP 응답 객체
 * @param {unknown} body 파싱된 요청 본문
 * @returns {Promise<void>}
 */
export async function handleLogin(req, res, body) {
  if (typeof body !== 'object' || body === null) {
    sendJson(res, 400, { error: '요청 본문은 JSON 객체여야 합니다.' });
    return;
  }

  const { email, password } = /** @type {{ email?: unknown; password?: unknown }} */ (body);

  if (typeof email !== 'string' || typeof password !== 'string') {
    sendJson(res, 400, { error: 'email과 password는 문자열이어야 합니다.' });
    return;
  }

  const user = await verifyCredentials(email, password);

  if (!user) {
    sendJson(res, 401, { error: '이메일 또는 비밀번호가 올바르지 않습니다.' });
    return;
  }

  sendJson(res, 200, {
    token: issueToken(user),
    user: { id: user.id, email: user.email },
  });
}
