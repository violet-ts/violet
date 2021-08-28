## Getting Started

Create .env files: 

```sh
$ cp server/.env.example server/.env
$ cp server/prisma/.env.example server/prisma/.env
```

Install node modules:

```sh
$ yarn install
$ yarn install --cwd server
```

Run the development server:

```sh
$ yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Docker Command

### start
```sh
$ docker-compose up -d
```

### login
```sh
$ docker exec -it <container-name> bash -p
$ mysql -u <MYSQL_USER> -p<MYSQL_PASSWORD>
```

### stop
```sh
$ docker-compose stop
```

### delete
```sh
$ docker-compose down
```
