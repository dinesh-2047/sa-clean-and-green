/**
 * MongoDB access for bookings and enquiries.
 *
 * Two deliberate choices:
 *
 *  - The client is cached on `globalThis` so `next dev`'s hot reload doesn't
 *    open a new connection pool on every edit.
 *  - `getDb()` returns `null` when MONGODB_URI is missing or the server can't
 *    be reached, so a database outage degrades the site to "email only"
 *    instead of failing the customer's submission. Callers must handle null.
 */
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI;

// The database name normally comes from the path on the connection string.
// MONGODB_DB is only needed for URIs that don't carry one.
const dbName = process.env.MONGODB_DB || "";

export const BOOKINGS = "bookings";
export const ENQUIRIES = "enquiries";

export const isDbConfigured = () => Boolean(uri);

/** Indexes the admin list and reference lookups rely on. Safe to re-run. */
async function ensureIndexes(db) {
  try {
    await Promise.all([
      db.collection(BOOKINGS).createIndex({ createdAt: -1 }),
      db.collection(BOOKINGS).createIndex({ reference: 1 }, { unique: true }),
      db.collection(ENQUIRIES).createIndex({ createdAt: -1 }),
      db.collection(ENQUIRIES).createIndex({ reference: 1 }, { unique: true }),
    ]);
  } catch (err) {
    // Indexes are an optimisation, not a requirement — never block a write.
    console.error(`[db] index setup failed: ${err?.message || err}`);
  }
}

async function connect() {
  const client = new MongoClient(uri, {
    // Don't let a bad network hold a request open for the driver's 30s default.
    serverSelectionTimeoutMS: 8000,
  });
  await client.connect();
  await ensureIndexes(dbName ? client.db(dbName) : client.db());
  return client;
}

/**
 * @returns {Promise<import('mongodb').Db|null>} null when unconfigured or unreachable.
 */
export async function getDb() {
  if (!uri) return null;

  const g = globalThis;
  if (!g.__scgMongo) g.__scgMongo = { promise: null };

  if (!g.__scgMongo.promise) g.__scgMongo.promise = connect();

  try {
    const client = await g.__scgMongo.promise;
    // `client.db()` with no argument uses the database named on the connection
    // string, so the name normally lives with the credentials in .env.
    return dbName ? client.db(dbName) : client.db();
  } catch (err) {
    // Clear the cache so the next request retries rather than replaying the
    // same rejected promise forever.
    g.__scgMongo.promise = null;
    console.error(`[db] connection failed: ${err?.message || err}`);
    return null;
  }
}

/**
 * Store a submission. Never throws — a failed insert is reported back so the
 * route can still deliver the email and tell the customer we got it.
 *
 * @returns {Promise<{ saved: boolean, id?: string, error?: string }>}
 */
export async function saveDoc(collection, doc) {
  const db = await getDb();
  if (!db) return { saved: false, error: "database not configured" };

  try {
    const res = await db.collection(collection).insertOne(doc);
    return { saved: true, id: String(res.insertedId) };
  } catch (err) {
    console.error(
      `[db] insert into ${collection} failed: ${err?.message || err}`
    );
    return { saved: false, error: err?.message || "insert failed" };
  }
}

/** True when a string is a usable 24-character Mongo id. */
export const isValidId = (id) =>
  typeof id === "string" && ObjectId.isValid(id) && String(new ObjectId(id)) === id;

export const toObjectId = (id) => new ObjectId(id);

/**
 * Turn a Mongo document into something a client component can receive:
 * `_id` becomes a string `id`, and Dates become ISO strings.
 */
export function toPlain(doc) {
  if (!doc) return null;

  const plain = {};
  for (const [key, value] of Object.entries(doc)) {
    if (key === "_id") plain.id = String(value);
    else if (value instanceof Date) plain[key] = value.toISOString();
    else plain[key] = value;
  }
  return plain;
}

/**
 * Newest-first list for the dashboard. Returns [] when there's no database,
 * so the page can still render with an explanatory notice.
 */
export async function listDocs(collection, limit = 500) {
  const db = await getDb();
  if (!db) return [];

  try {
    const docs = await db
      .collection(collection)
      .find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();
    return docs.map(toPlain);
  } catch (err) {
    console.error(`[db] read ${collection} failed: ${err?.message || err}`);
    return [];
  }
}
