### Shrap Admin Front

Коротко о проекте: админ-панель на Nuxt 3 (SPA) с готовыми компонентами, аутентификацией, таблицами, формами, календарём расписаний и WebSocket-уведомлениями.

### Демо
- App: [schedule.code-lab.pro](https://schedule.code-lab.pro/)
- Доступ:
  - login: admin
  - pass: 123

### Технологии
- **Nuxt 3 (SPA)**: маршрутизация, сборка, runtime config (`nuxt.config.ts`)
- **Vue 3**: компонентный подход и реактивность
- **Vuetify 3**: UI-компоненты и тема (`theme/LightTheme.ts`, `scss/` кастомизации)
- **Axios**: HTTP-клиент и перехватчики (`plugins/http/http.js`)
- **Автогенерация API-клиента**: `plugins/http/clientgen.js` → `plugins/http/api.js`
- **WebSocket**: подключение и инъекция сокета (`plugins/websocket.js`)
- **Schedule-X / Qalendar**: виджеты календаря и расписаний
- **ApexCharts**: графики (`vue3-apexcharts`)
- **TipTap**: rich-text редактор (`@tiptap/vue-3`)
- **Vuex (events store)**: уведомления/сообщения (`plugins/store/events.js`)
- **Nuxt Icon**, **SCSS**: иконки и стили

### Структура проекта 
- `pages/` — экраны: `index.vue`, `auth/Login.vue`, `users.vue`, `role.vue`, `student.vue`, и др.
- `components/`
  - `form/` — универсальная форма `CustomForm.vue`, правила `rules.js`
  - `table/` — `DataTable.vue` (пагинация, сортировка, фильтры)
  - `shared/` — переиспользуемые карточки/инпуты (`Ui*` компоненты)
  - `layout/` — контейнеры и заголовки
- `plugins/`
  - `http/` — `http.js` (обёртка axios), `api.js` (сген.), `clientgen.js`
  - `websocket.js` — инициализация и инъекция `$socket`
  - `store.js`, `store/events.js` — события/уведомления
- `scss/` — SCSS-переменные и оверрайды Vuetify
- `theme/LightTheme.ts` — тема
- `nuxt.config.ts` — конфигурация (ssr: false, runtimeConfig)

### Особенности
#### CustomForm
- Универсальная форма (`components/form/CustomForm.vue`): конфигурация полей, required/валидации, layout, режимы отображения.

#### Data Table
- `components/table/DataTable.vue`: поиск, сортировка, пагинация, фильтры; настраиваемые колонки.

#### HTTP-клиент и аутентификация
- `plugins/http/http.js`: хранение JWT в `localStorage`, автоматическая подстановка `Authorization`, обработка `401` (logout), глобальная обработка ошибок и всплывающих уведомлений через events store.

#### Автогенерация API из OpenAPI/Swagger
- Скрипт `plugins/http/clientgen.js` генерирует `plugins/http/api.js` на основе `http://localhost:8081/v3/api-docs`.
- Удобные группы методов и типичные CRUD-вызовы.

#### WebSocket
- `plugins/websocket.js`: подключение к `NUXT_PUBLIC_WS_URL` и инъекция в контекст для подписок/уведомлений.

### Требования
- Node.js 18+

### Переменные окружения
Используются runtime-переменные:
- `NUXT_PUBLIC_API_BASE` — базовый URL API (напр.: `http://localhost:8081/`)
- `NUXT_PUBLIC_WS_URL` — URL WebSocket (напр.: `ws://localhost:8081/ws`)

Пример `.env`:
```
NUXT_PUBLIC_API_BASE=http://localhost:8081/
NUXT_PUBLIC_WS_URL=ws://localhost:8081/ws
```

### Установка и запуск
1. Создайте `.env` и задайте значения переменных (см. выше)
2. Установите зависимости:
```
npm install
```
3. Запуск в разработке:
```
npm run dev
```
4. Сборка и предпросмотр:
```
npm run build
npm run preview
```
5. (Опционально) Сгенерировать API-клиент из Swagger:
```
node plugins/http/clientgen.js
```

### Скрипты
- `dev` — запуск dev-сервера
- `build` — сборка
- `generate` — статическая генерация
- `preview` — предпросмотр собранного приложения

---

Демо: [`https://schedule.code-lab.pro/`](https://schedule.code-lab.pro/)

