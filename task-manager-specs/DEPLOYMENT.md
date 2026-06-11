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

## Локальный доступ с телефона по Wi-Fi

Если Render еще не подключен из-за биллинга, можно открыть приложение с телефона в той же Wi-Fi сети:

1. Запустить `setup-zadachnik-firewall.cmd` от администратора и подтвердить окно Windows.
2. Запустить `start-zadachnik-lan.cmd`.
3. Открыть на телефоне ссылку вида `http://<IP-компьютера>:3101/a/<token>`.

Сейчас компьютер отвечает на `http://192.168.31.167:3101/`, но телефон должен быть в той же Wi-Fi сети, а VPN на телефоне лучше выключить.
