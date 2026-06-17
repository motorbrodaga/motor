# Задачник

Личный mobile-first таск-менеджер: быстрый захват задач, ассистент, дневной фокус, ожидания, обзоры, календарь, уведомления, offline-очередь и бэкапы.

## Основной деплой

Основной вариант для телефона: Vercel + Neon.

- Vercel дает постоянный HTTPS-адрес приложения.
- Neon дает Postgres-базу на бесплатном плане без карты.
- Prisma использует `postgresql` provider.

Подробная инструкция: `../DEPLOYMENT.md`.

## Переменные окружения

Минимально нужны:

```text
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DB?sslmode=require"
ACCESS_TOKEN_PEPPER="replace-with-a-long-random-string"
INITIAL_ACCESS_TOKEN="replace-with-first-login-token"
```

Опционально для push-уведомлений:

```text
NEXT_PUBLIC_VAPID_PUBLIC_KEY="replace-with-vapid-public-key"
VAPID_PRIVATE_KEY="replace-with-vapid-private-key"
VAPID_SUBJECT="mailto:you@example.com"
```

## Локальный запуск

Локально приложение тоже ожидает Postgres-совместимую строку `DATABASE_URL`.

```powershell
npm install
Copy-Item .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

Для доступа с телефона в той же Wi-Fi сети:

```powershell
npm run dev:lan -- -p 3101
```

## Vercel build

Vercel использует `vercel.json`:

```text
npm run vercel-build
```

Команда применяет схему к Neon, выполняет seed и собирает Next.js.
