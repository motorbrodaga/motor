import { mkdirSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const __dirname = dirname(fileURLToPath(import.meta.url));
const appRoot = dirname(__dirname);
const migrationsDir = join(appRoot, "prisma", "migrations");
const dbPath = join(appRoot, "prisma", "dev.db");

mkdirSync(dirname(dbPath), { recursive: true });

const db = new DatabaseSync(dbPath);
db.exec("PRAGMA foreign_keys = ON;");

const migrationDirs = readdirSync(migrationsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

for (const migrationDir of migrationDirs) {
  const migrationPath = join(migrationsDir, migrationDir, "migration.sql");
  const sql = readFileSync(migrationPath, "utf8");
  db.exec(sql);
}

db.close();

console.log(`SQLite database initialized at ${dbPath}`);
