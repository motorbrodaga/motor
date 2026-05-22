import { createHash } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function hashToken(token: string) {
  const pepper = process.env.ACCESS_TOKEN_PEPPER ?? "development-only-pepper";
  return createHash("sha256").update(`${token}:${pepper}`).digest("hex");
}

export async function resetAccessToken(token: string) {
  await prisma.shellEvent.deleteMany();
  await prisma.accessToken.deleteMany();
  await prisma.accessToken.create({
    data: {
      tokenHash: hashToken(token),
      label: "Тестовая приватная ссылка"
    }
  });
}

export async function closeDb() {
  await prisma.$disconnect();
}
