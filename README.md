## Getting Started

Create .env files: 

```sh
$ cp server/.env.example server/.env
$ cp server/prisma/.env.example server/prisma/.env
```

Get FIREBASE_TOKEN

```sh
$ npm install -g firebase-tools
$ firebase login:ci
```

Write FIREBASE_TOKEN to `server/.env`

Install node modules:

```sh
$ yarn install
$ yarn install --cwd server
```

Run the development server:

```sh
$ docker-compose up -d
$ yarn dev
```

Open http://localhost:3000 with your browser to see the result.
Open http://localhost:4000 with your browser to see Firebase Emulator Suite.

## Docker Command

### start
```sh
$ docker-compose up -d
```

### login to MySQL
```sh
$ docker-compose exec mysql bash -c "mysql -u user -ppass"
```

### get FIREBASE_TOKEN from inside container

```sh
$ docker-compose exec firebase bash -c "firebase login:ci --no-localhost"
```

### stop
```sh
$ docker-compose stop
```

### delete
```sh
$ docker-compose down
```
