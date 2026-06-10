process.env.DATABASE_URL ??= "file:./dev.db";

async function main() {
  const filePath = process.argv[2];
  const [{ validateBackupFile }, { prisma }] = await Promise.all([
    import("../src/lib/backups/backup-service"),
    import("../src/lib/db")
  ]);

  if (!filePath) {
    console.error("Укажите путь к файлу бэкапа.");
    await prisma.$disconnect();
    process.exit(1);
  }

  try {
    const backup = await validateBackupFile(filePath);
    console.log(`Бэкап подходит. Создан: ${backup.createdAt}`);
    console.log(JSON.stringify(backup.entityCounts, null, 2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Бэкап не прошел проверку.");
    await prisma.$disconnect();
    process.exit(1);
  }

  await prisma.$disconnect();
}

void main();
