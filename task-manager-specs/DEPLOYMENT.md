# Деплой Задачника без Render

## Выбранный вариант

Задачник переезжает на:

- Vercel для постоянного HTTPS-адреса приложения;
- Neon для бесплатной Postgres-базы без платежной карты.

## 1. Создать базу Neon

1. Открой https://neon.tech
2. Создай бесплатный проект.
3. Скопируй строку подключения Postgres вида:

```text
postgresql://USER:PASSWORD@HOST.neon.tech/DB?sslmode=require
```

## 2. Создать проект Vercel

1. Открой https://vercel.com/new
2. Импортируй репозиторий:

```text
https://github.com/motorbrodaga/motor
```

3. В настройках проекта укажи Root Directory:

```text
task-manager-specs/zadachnik-app
```

4. Framework должен определиться как Next.js.

## 3. Добавить переменные окружения Vercel

В Vercel Project Settings -> Environment Variables добавь:

```text
DATABASE_URL=<строка подключения Neon>
ACCESS_TOKEN_PEPPER=<длинная случайная строка>
INITIAL_ACCESS_TOKEN=<первый приватный токен входа>
```

`INITIAL_ACCESS_TOKEN` нужен только для первого входа. После входа открой `Еще -> Доступ` и перегенерируй приватную ссылку.

Push-уведомления можно включить позже:

```text
NEXT_PUBLIC_VAPID_PUBLIC_KEY=<public key>
VAPID_PRIVATE_KEY=<private key>
VAPID_SUBJECT=mailto:you@example.com
```

## 4. Деплой

Vercel запустит команду из `vercel.json`:

```text
npm run vercel-build
```

Она выполнит:

1. `prisma generate`
2. `prisma db push`
3. `prisma db seed`
4. `next build`

## 5. Первый вход

После деплоя открой:

```text
https://<vercel-url>/a/<INITIAL_ACCESS_TOKEN>
```

Затем в приложении открой `Еще -> Доступ` и создай новую приватную ссылку.
