import { createRequire } from 'node:module';
import { scrypt, timingSafeEqual, createHmac, randomBytes } from 'node:crypto';
import { promisify } from 'node:util';

const require = createRequire(import.meta.url);
const { isValidEmail } = require('../../email.js');

const scryptAsync = promisify(scrypt);

/** @type {string} */
const DEMO_EMAIL = process.env.AUTH_DEMO_EMAIL ?? 'demo@example.com';

/** @type {string} */
const DEMO_PASSWORD = process.env.AUTH_DEMO_PASSWORD ?? 'demo-password-change-me';

/** @type {string} */
const TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET ?? 'dev-only-secret-change-in-production';

/** @type {number} */
const TOKEN_TTL_MS = Number(process.env.AUTH_TOKEN_TTL_MS ?? 3_600_000);

/** @type {Promise<{ email: string; passwordHash: Buffer; salt: Buffer }>} */
const demoUserPromise = hashPassword(DEMO_EMAIL, DEMO_PASSWORD);

/**
 * 비밀번호를 scrypt로 해시한다.
 * @param {string} email 사용자 이메일 (salt 입력에 사용)
 * @param {string} password 평문 비밀번호
 * @returns {Promise<{ email: string; passwordHash: Buffer; salt: Buffer }>}
 */
async function hashPassword(email, password) {
  const salt = randomBytes(16);
  const passwordHash = /** @type {Buffer} */ (
    await scryptAsync(password, salt, 64)
  );
  return { email, passwordHash, salt };
}

/**
 * 로그인 자격 증명을 검증한다.
 * @param {string} email 이메일
 * @param {string} password 비밀번호
 * @returns {Promise<{ id: string; email: string } | null>} 성공 시 사용자 정보, 실패 시 null
 */
export async function verifyCredentials(email, password) {
  if (!isValidEmail(email) || typeof password !== 'string' || password.length === 0) {
    return null;
  }

  const demoUser = await demoUserPromise;

  if (email !== demoUser.email) {
    await scryptAsync(password, demoUser.salt, 64);
    return null;
  }

  const candidateHash = /** @type {Buffer} */ (
    await scryptAsync(password, demoUser.salt, 64)
  );

  if (
    candidateHash.length !== demoUser.passwordHash.length ||
    !timingSafeEqual(candidateHash, demoUser.passwordHash)
  ) {
    return null;
  }

  return { id: 'demo-user', email: demoUser.email };
}

/**
 * 로그인 토큰을 발급한다.
 * @param {{ id: string; email: string }} user 사용자 정보
 * @returns {string} 서명된 토큰
 */
export function issueToken(user) {
  const payload = {
    sub: user.id,
    email: user.email,
    exp: Date.now() + TOKEN_TTL_MS,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', TOKEN_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}
