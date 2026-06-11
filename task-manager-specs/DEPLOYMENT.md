# Деплой Задачника

## Render

Конфигурация деплоя лежит в `render.yaml` в корне git-репозитория.

Открыть Blueprint:

https://dashboard.render.com/blueprint/new?repo=https://github.com/motorbrodaga/motor

## Что будет создано

- Web Service `zadachnik`
- Node.js runtime
- root directory: `task-manager-specs/zadachnik-app`
- SQLite база на постоянном диске `/var/data/zadachnik.db`

## Важные замечания

- Используется Render plan `starter`, потому что для SQLite нужен постоянный диск.
- `ACCESS_TOKEN_PEPPER` и `INITIAL_ACCESS_TOKEN` генерируются Render автоматически.
- Push-уведомления можно включить позже, заполнив:
  - `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
  - `VAPID_PRIVATE_KEY`
  - `VAPID_SUBJECT`

## После деплоя

1. Открыть публичный URL сервиса.
2. Если открылась страница "Личный доступ", зайти в Render logs.
3. Найти строку `Private link token for local development: ...`.
4. Открыть `https://<render-url>/a/<token>`.
5. После входа перейти в `Еще -> Доступ` и перегенерировать приватную ссылку.
