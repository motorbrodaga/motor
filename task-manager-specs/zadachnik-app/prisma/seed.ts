import { randomBytes, createHash } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getPepper() {
  return process.env.ACCESS_TOKEN_PEPPER ?? "development-only-pepper";
}

function hashToken(token: string) {
  return createHash("sha256").update(`${token}:${getPepper()}`).digest("hex");
}

async function main() {
  const existing = await prisma.accessToken.findFirst({ where: { active: true } });

  if (existing) {
    console.log("Active access token already exists. Use the app to regenerate it.");
    return;
  }

  const token = process.env.INITIAL_ACCESS_TOKEN ?? randomBytes(32).toString("base64url");

  await prisma.accessToken.create({
    data: {
      tokenHash: hashToken(token),
      label: "Первая приватная ссылка"
    }
  });

  await prisma.appSetting.upsert({
    where: { key: "app.name" },
    update: { value: "Задачник" },
    create: { key: "app.name", value: "Задачник" }
  });

  console.log(`Private link token for local development: ${token}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
