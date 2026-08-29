import { cookies } from "next/headers";
import { COOKIE, cookieOptions } from "../../../../lib/adminAuth";

export async function POST() {
  const store = await cookies();
  // Overwrite rather than only deleting, so the browser definitely drops it.
  store.set(COOKIE, "", cookieOptions(0));
  return Response.json({ ok: true });
}
