import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appRoot = dirname(__dirname);
const migrationPath = join(
  appRoot,
  "prisma",
  "migrations",
  "20260522000000_init",
  "migration.sql"
);
const dbPath = join(appRoot, "prisma", "dev.db");

mkdirSync(dirname(dbPath), { recursive: true });

const db = new DatabaseSync(dbPath);
const sql = readFileSync(migrationPath, "utf8");

db.exec(sql);
db.close();

console.log(`SQLite database initialized at ${dbPath}`);
