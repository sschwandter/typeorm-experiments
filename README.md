# typeorm-experiments

Small NestJS + TypeORM project backed by Postgres.

## Setup

```bash
npm install
cp .env.example .env
```

## Scripts

| Script | Description |
| --- | --- |
| `npm run start` | Starts the Nest app once on your machine. |
| `npm run start:dev` | Starts the Nest app on your machine in watch mode. |
| `npm run docker:up` | Starts the app, Postgres, and PgAdmin in Docker. Postgres is not exposed on `localhost`. |
| `npm run docker:down` | Stops the Docker Compose services. |
| `npm run db:up` | Starts only Postgres in Docker and exposes it on `localhost:5432` for local Node development. Recreates the container if needed so the local port mapping is applied. |
| `npm run db:down` | Stops and removes only the Postgres container. |
| `npm run test` | Runs unit tests. |
| `npm run test:e2e` | Runs end-to-end tests. |
| `npm run build` | Builds the Nest app into `dist`. |

## Run With Local Node And Docker Postgres

This is the fastest development loop: Node runs on your machine, Postgres runs in Docker.

```bash
npm run db:up
npm run start:dev
```

The app reads database settings from `.env`. By default it connects to Postgres on `localhost:5432`.

This workflow uses `docker/docker-compose.local-db.yml` to publish Postgres on your machine. If another local Postgres is already using port `5432`, stop it first or change the published port in that override file.

## Run Everything In Docker

This starts the Nest app, Postgres, and PgAdmin through Docker Compose.

```bash
npm run docker:up
```

The API is available at `http://localhost:3000`.
PgAdmin is available at `http://localhost:5050`.

PgAdmin login defaults:

```text
Email: admin@example.com
Password: password
```

These values come from `.env`. The Postgres server is preconfigured in PgAdmin as `typeorm-experiments`. When PgAdmin asks for the database password, use the value of `DB_PASSWORD`.

In this workflow, Postgres is only available inside the Docker network as `postgres:5432`; it is not bound to `localhost:5432`.

## Stop Services

```bash
npm run docker:down
```

To also delete the Postgres volume and reset local data:

```bash
docker compose -f docker/docker-compose.yml down -v
```

## Tests

```bash
npm run test
npm run test:e2e
```

## Logging

The app uses Winston through `nest-winston`.

Logs are written as structured JSON to:

```text
logs/application.log
logs/error.log
```

In Docker, `/app/logs` is backed by the `app-logs` named volume.

Console logs use a human-readable Nest-style format.

The same logger is used during application bootstrap and normal Nest runtime logging. HTTP requests receive an `x-request-id` response header, and logs emitted while handling that request include the same `requestId` field.

Use Nest logger contexts for application logs, usually the class or source file emitting the log:

```ts
private readonly logger = new Logger(UsersService.name);
```

## Database Config

| Variable | Default | Description |
| --- | --- | --- |
| `LOG_LEVEL` | `info` | Minimum log level for console and file transports. |
| `DB_HOST` | `localhost` | Postgres host. Use `postgres` inside Docker Compose. |
| `DB_PORT` | `5432` | Postgres port. |
| `DB_USERNAME` | `postgres` | Postgres user. |
| `DB_PASSWORD` | `password` | Postgres password. |
| `DB_NAME` | `typeorm_experiments` | Database name. |
| `DB_SYNCHRONIZE` | `true` | Lets TypeORM sync schema automatically. Handy for experiments, unsafe for production. |
| `PGADMIN_PORT` | `5050` | Local port for the PgAdmin web UI. |
| `PGADMIN_DEFAULT_EMAIL` | `admin@example.com` | PgAdmin login email. |
| `PGADMIN_DEFAULT_PASSWORD` | `password` | PgAdmin login password. |
