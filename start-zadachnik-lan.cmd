@echo off
setlocal
cd /d "%~dp0task-manager-specs\zadachnik-app"
set "DATABASE_URL=file:./dev.db"
set "ACCESS_TOKEN_PEPPER=development-only-pepper"
npm run dev:lan -- -p 3101
