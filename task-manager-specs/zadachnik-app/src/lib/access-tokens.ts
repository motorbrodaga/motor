import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/db";
import { accessTokenPepper } from "@/lib/env";

export type AccessTokenResult = {
  token: string;
  id: string;
};

export function hashAccessToken(token: string) {
  return createHash("sha256")
    .update(`${token}:${accessTokenPepper()}`)
    .digest("hex");
}

function safeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return timingSafeEqual(aBuffer, bBuffer);
}

export function createTokenValue() {
  return randomBytes(32).toString("base64url");
}

export async function createInitialAccessToken(): Promise<AccessTokenResult> {
  const existing = await prisma.accessToken.findFirst({ where: { active: true } });

  if (existing) {
    return { token: "", id: existing.id };
  }

  const token = createTokenValue();
  const record = await prisma.accessToken.create({
    data: {
      tokenHash: hashAccessToken(token),
      label: "Приватная ссылка"
    }
  });

  return { token, id: record.id };
}

export async function validateAccessToken(token: string) {
  const tokenHash = hashAccessToken(token);
  const records = await prisma.accessToken.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    records.find((record) => safeEqual(record.tokenHash, tokenHash)) ?? null
  );
}

export async function regenerateAccessToken(previousTokenId?: string | null) {
  const token = createTokenValue();
  const tokenHash = hashAccessToken(token);

  const result = await prisma.$transaction(async (tx) => {
    if (previousTokenId) {
      await tx.accessToken.updateMany({
        where: { id: previousTokenId, active: true },
        data: { active: false, rotatedAt: new Date() }
      });
    } else {
      await tx.accessToken.updateMany({
        where: { active: true },
        data: { active: false, rotatedAt: new Date() }
      });
    }

    return tx.accessToken.create({
      data: {
        tokenHash,
        label: "Перегенерированная приватная ссылка"
      }
    });
  });

  await prisma.shellEvent.create({
    data: {
      kind: "access.regenerated",
      metadataJson: JSON.stringify({ tokenId: result.id })
    }
  });

  return { token, id: result.id };
}
