## Getting Started

Create .env files:

```sh
$ cp server/.env.example server/.env
$ cp server/prisma/.env.example server/prisma/.env
```

Get FIREBASE_TOKEN

```sh
$ yarn login:firebase
```

自分の google アカウントでログインしてターミナルに表示されているトークンをコピー

Input your values to `server/.env`

```sh
FIREBASE_TOKEN=1/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
FIREBASE_API_KEY=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
FIREBASE_AUTH_DOMAIN=AAAA.firebaseapp.com
FIREBASE_PROJECT_ID=AAAA
FIREBASE_STORAGE_BUCKET=AAAA.appspot.com
FIREBASE_MESSEGING_SENDER_ID=999999999999
FIREBASE_APP_ID=1:999999999999:web:AAAAAAAAAAAAAAAAAAAAAAA
```

上記の値に対して firebase のアプリ作成時に表示されていた firebase config の値を当てめていく

```sh
FIREBASE_TOKEN={自分のgoogleアカウントでログインしてターミナルに表示されていたトークン}
FIREBASE_API_KEY={apiKey}
FIREBASE_AUTH_DOMAIN={authDomain}
FIREBASE_PROJECT_ID={projectId}
FIREBASE_STORAGE_BUCKET={storageBucket}
FIREBASE_MESSEGING_SENDER_ID={messagingSenderId}
FIREBASE_APP_ID={appId}
```

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
$ docker-compose exec mysql bash -c "mysql -u root -proot"
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
