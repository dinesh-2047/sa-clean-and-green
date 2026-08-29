import { cookies } from "next/headers";
import {
  COOKIE,
  checkCredentials,
  cookieOptions,
  createToken,
  isAdminConfigured,
} from "../../../../lib/adminAuth";

/**
 * Very small in-memory throttle. Enough to make guessing the single admin
 * password impractical on a one-instance deployment; it resets on restart and
 * isn't shared between instances, which is fine for this site's scale.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const attempts = new Map();

function tooManyAttempts(key) {
  const entry = attempts.get(key);
  if (!entry) return false;
  if (Date.now() > entry.until) {
    attempts.delete(key);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

function recordFailure(key) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now > entry.until) {
    attempts.set(key, { count: 1, until: now + WINDOW_MS });
    return;
  }
  entry.count += 1;
}

export async function POST(request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "local";

  if (tooManyAttempts(ip)) {
    return Response.json(
      {
        ok: false,
        message: "Too many attempts. Wait a few minutes and try again.",
      },
      { status: 429 }
    );
  }

  if (!isAdminConfigured()) {
    console.error(
      "[auth] ADMIN_EMAIL / ADMIN_PASSWORD are not set — nobody can sign in."
    );
    return Response.json(
      {
        ok: false,
        message:
          "Admin sign-in isn't set up on this server yet. Add ADMIN_EMAIL and ADMIN_PASSWORD to the environment.",
      },
      { status: 503 }
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { ok: false, message: "That request couldn't be read." },
      { status: 400 }
    );
  }

  if (!checkCredentials(payload?.email, payload?.password)) {
    recordFailure(ip);
    // Deliberately vague: don't reveal which half was wrong.
    return Response.json(
      { ok: false, message: "Those details don't match. Please try again." },
      { status: 401 }
    );
  }

  attempts.delete(ip);

  const store = await cookies();
  store.set(COOKIE, createToken(), cookieOptions());

  return Response.json({ ok: true });
}
