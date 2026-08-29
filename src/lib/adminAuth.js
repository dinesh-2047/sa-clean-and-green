/**
 * Admin authentication.
 *
 * There's a single admin, whose credentials live in .env — no user table, no
 * signup. A successful login gets an HMAC-signed, HttpOnly cookie; the token
 * carries only the admin email and an expiry, and any tampering fails the
 * signature check.
 *
 * Server-only. Never import this from a component with "use client" — it would
 * pull the secret into the browser bundle.
 */
import crypto from "node:crypto";
import { cookies } from "next/headers";

export const COOKIE = "scg_admin";

/** Eight hours: long enough for a working day, short enough to matter. */
const MAX_AGE_SECONDS = 60 * 60 * 8;

const b64url = (buf) => Buffer.from(buf).toString("base64url");

function adminEmail() {
  return (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
}

function adminPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

/** True once both admin credentials are present in the environment. */
export function isAdminConfigured() {
  return Boolean(adminEmail() && adminPassword());
}

/**
 * Key used to sign session cookies. ADMIN_SESSION_SECRET is the intended
 * source; falling back to the credentials keeps logins working on a fresh
 * deploy, at the cost of invalidating sessions whenever the password changes.
 */
function signingKey() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (secret && secret.length >= 16) return secret;

  if (!secret) {
    console.warn(
      "[auth] ADMIN_SESSION_SECRET is not set — falling back to a key derived from the admin password. Set a random 32-byte secret in .env."
    );
  } else {
    console.warn(
      "[auth] ADMIN_SESSION_SECRET is too short to be useful — using a derived key instead."
    );
  }

  return `derived:${adminEmail()}:${adminPassword()}`;
}

const sign = (data) =>
  crypto.createHmac("sha256", signingKey()).update(data).digest("base64url");

/** Constant-time compare that tolerates different lengths. */
function safeEqual(a, b) {
  const ha = crypto.createHash("sha256").update(String(a)).digest();
  const hb = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

/** Do these credentials match the ones in .env? */
export function checkCredentials(email, password) {
  if (!isAdminConfigured()) return false;

  const emailOk = safeEqual(String(email || "").trim().toLowerCase(), adminEmail());
  const passOk = safeEqual(String(password || ""), adminPassword());

  // Both comparisons always run so a wrong email and a wrong password cost the
  // same amount of time.
  return emailOk && passOk;
}

/** Signed token: base64url(payload).signature */
export function createToken() {
  const payload = b64url(
    JSON.stringify({
      email: adminEmail(),
      exp: Date.now() + MAX_AGE_SECONDS * 1000,
    })
  );
  return `${payload}.${sign(payload)}`;
}

export function readToken(token) {
  if (typeof token !== "string" || !token.includes(".")) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  let expected;
  try {
    expected = sign(payload);
  } catch {
    return null;
  }

  if (expected.length !== signature.length) return null;
  if (
    !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  ) {
    return null;
  }

  let data;
  try {
    data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch {
    return null;
  }

  if (!data?.exp || Date.now() > data.exp) return null;
  // A password or email change should log the old session out.
  if (data.email !== adminEmail()) return null;

  return data;
}

/** Cookie options shared by login and logout so they can't drift apart. */
export function cookieOptions(maxAge = MAX_AGE_SECONDS) {
  return {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge,
    // Localhost is plain HTTP in development, where a Secure cookie is dropped.
    secure: process.env.NODE_ENV === "production",
  };
}

/**
 * Read the session from the incoming request.
 * @returns {Promise<{email: string, exp: number}|null>}
 */
export async function getSession() {
  const store = await cookies();
  return readToken(store.get(COOKIE)?.value);
}

/** Convenience for route handlers: 401 unless there's a valid session. */
export async function requireSession() {
  const session = await getSession();
  if (session) return null;

  return Response.json(
    { ok: false, message: "Your session has expired. Please sign in again." },
    { status: 401 }
  );
}
