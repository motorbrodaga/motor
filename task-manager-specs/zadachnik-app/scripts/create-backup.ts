process.env.DATABASE_URL ??= "file:./dev.db";

export {};

async function main() {
  const [{ createBackup }, { prisma }] = await Promise.all([
    import("../src/lib/backups/backup-service"),
    import("../src/lib/db")
  ]);
  const backup = await createBackup();

  if (backup.status !== "success") {
    console.error(backup.error ?? "Не удалось создать бэкап.");
    await prisma.$disconnect();
    process.exit(1);
  }

  console.log(`Бэкап создан: ${backup.filePath}`);
  await prisma.$disconnect();
}

void main();
