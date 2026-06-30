import { handleLogin } from './routes/auth.mjs';

/**
 * 요청 본문을 JSON으로 파싱한다.
 * @param {import('node:http').IncomingMessage} req HTTP 요청 객체
 * @returns {Promise<unknown>}
 */
async function readJsonBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString('utf8');

  if (raw.length === 0) {
    return null;
  }

  return JSON.parse(raw);
}

/**
 * HTTP 요청을 라우팅한다.
 * @param {import('node:http').IncomingMessage} req HTTP 요청 객체
 * @param {import('node:http').ServerResponse} res HTTP 응답 객체
 * @returns {Promise<void>}
 */
export async function handleRequest(req, res) {
  const method = req.method ?? 'GET';
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
  const path = url.pathname;

  if (method === 'POST' && path === '/api/auth/login') {
    try {
      const body = await readJsonBody(req);
      await handleLogin(req, res, body);
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: '잘못된 JSON 형식입니다.' }));
    }
    return;
  }

  if (method === 'GET' && path === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ error: '요청한 리소스를 찾을 수 없습니다.' }));
}
