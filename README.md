# Erp Aero Task

## Prerequirments

Перед тем, как работать с проектом создайте `.env` файлы (в корне проекта):

- `.env.development` - если будете работать в дев среде - `npm run dev`, миграции и откаты дев;
- `.env.production` - если будете работать в прод среде - `npm run start`, миграции и откаты прод;

Вот пример `.env` файла:

```conf
NODE_ENV=development
PORT=4000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=1111
DB_NAME=app

JWT_SECRET=super-secret
JWT_REFRESH_SECRET=super-refresh-secret

UPLOAD_FOLDER=uploads   # папка для файлов (относительно корня проекта)
```

Также установите зависимости:

```bash
npm run i
```

Если вы собираетесь запускать проект в прод режиме, то убедитесь, что вы создали бд и применили [миграции](#migrations), в дев режиме это делается [автоматически](src/server.ts#L9) при каждом запуске.

## Migrations

В папке `src\infrastructure\db\migrations` лежат файлы с миграциями, применить их можно при помощи команды:

```bash
npm run migrate:dev
```

**OR**

```bash
npm run migrate:prod
```

Откат можно сделать при помощи команды:

```bash
npm run rollback:dev
```

**OR**

```bash
npm run rollback:prod
```

А файл для миграции можно создать при помощи команды (**из корня проекта**)

```bash
npx cross-env DOTENV_CONFIG_PATH=ENV_FILE knex migrate:make MIGRATION_NAME --knexfile src/infrastructure/db/knexfile.ts
```

Здесь:

- ENV_FILE - ваш `.env` файл: `.env.development` или `.env.production`;
- MIGRATION_NAME - название миграции, с таким именем создастся файл.

## Startup

Для запуска проекта в дев среде:

```bash
npm run dev
```

В прод среде:

```bash
npm run build
npm run start
```

## API

Все запросы, кроме регистрации и логина, требуют наличия заголовка:  
`Authorization: Bearer <access_token>`

### Auth

| Метод    | Эндпоинт            | Описание                           | Формат данных (Body/Params)                      |
| :------- | :------------------ | :--------------------------------- | :----------------------------------------------- |
| **POST** | `/signup`           | Регистрация нового пользователя    | `{ "id": "email или phone", "password": "..." }` |
| **POST** | `/signin`           | Вход в систему (выдача токенов)    | `{ "id": "email или phone", "password": "..." }` |
| **POST** | `/signin/new_token` | Обновление Access Token по Refresh | Refresh Token (через Cookie или Body)            |
| **GET**  | `/info`             | Получение ID текущего пользователя | —                                                |
| **GET**  | `/logout`           | Выход (удаление текущей сессии)    | —                                                |

---

### Files

_Базовый путь: `/file`_

| Метод      | Эндпоинт        | Описание                       | Параметры                               |
| :--------- | :-------------- | :----------------------------- | :-------------------------------------- |
| **POST**   | `/upload`       | Загрузка метаданных и файла    | `multipart/form-data` (**ключ `file`**) |
| **GET**    | `/list`         | Список файлов с пагинацией     | `?page=1&list_size=10`                  |
| **DELETE** | `/delete/:id`   | Удаление файла и записи из БД  | `:id` (UUID файла)                      |
| **GET**    | `/:id`          | Информация о конкретном файле  | `:id` (UUID файла)                      |
| **GET**    | `/download/:id` | Скачивание файла на устройство | `:id` (UUID файла)                      |
| **PUT**    | `/update/:id`   | Обновление существующего файла | `:id` + `multipart/form-data`           |

---
