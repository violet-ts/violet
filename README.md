## Getting Started

Create .env files:

```sh
$ cp .env.example .env
$ cp packges/api/prisma/.env.example packges/api/prisma/.env
```

自分の google アカウントでログインしてターミナルに表示されているトークンをコピー

Input your values to `.env`

Install node modules:

```sh
$ pnpm install
```

Run the development server:

```sh
$ docker-compose up -d
$ pnpm dev
```

Open http://localhost:3000 with your browser to see the result.

## Docker Command

### start

```sh
$ docker-compose up -d
```

### login to MySQL

```sh
$ docker-compose exec mysql bash -c "mysql -u root -proot"
```

### stop

```sh
$ docker-compose stop
```

### delete

```sh
$ docker-compose down
```
