import { createServer } from 'node:http';
import { handleRequest } from './app.mjs';

/** @type {number} */
const PORT = Number(process.env.PORT ?? 3000);

const server = createServer((req, res) => {
  handleRequest(req, res).catch(() => {
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: '서버 내부 오류가 발생했습니다.' }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
