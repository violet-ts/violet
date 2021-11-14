## 開発ライフサイクル

一番トラブルが少ないであろう手順を載せています。

### Clone 後

```bash
cp .env.example .env
cp packges/api/prisma/.env.example packges/api/prisma/.env
```

必要なら .env の中身を書き換えます。

```bash
pnpm i
pnpm run build  # Lambda Docker は起動時のコードが使わるので先にビルド
docker-compose up -d
pnpm run dev
```

- web: [http://localhost:3000](http://localhost:3000)
- api: [http://localhost:8080](http://localhost:8080)
- minio ui: [http://localhost:9001](http://localhost:9001)

### チェックアウト後

```bash
# pnpm run dev している場合
pnpm i
```

```bash
# dev 用 Dockerfile に更新があった場合
docker-compose up --build -d
```

### Prisma Studio

[Prisma Studio](https://www.prisma.io/studio) はデータベースを Prisma の抽象化した範囲内で UI で操作できるツールです。

```
cd pkg/api
pnpm exec prisma studio
```

- prisma studio: [http://localhost:5555](http://localhost:5555)

リレーションが存在する場合は、先にそちらを削除しないと元のレコードを削除できないので注意してください。

### MySQL にログイン

```sh
docker-compose exec mysql bash -c "mysql -u root -proot"
```

### Lambda 内のソースコードに変更があった際

Lambda Docker は起動時のコードが使用され続けるので、リビルドしても、再起動が必要です。これは一瞬で終わります。

- `docker rm -f lambda; docker up -d lambda`
- `docker up lambda` でアタッチされている状態のまま `CTRL-C` (`CTRL-\` で抜けれます)、その後 `docker up lambda`


## コーディングルール

### 一般

- `pnpm run lint -w` でチェック
- `pnpm run lint:fix -w` で自動修正

### Dockerfile

- `hadolint` を使用します。ルール指定をスクリプト経由でしているので、スクリプトから起動してください
- `pnpm run lint:hadolint -w` で `hadolint` をかけます
- `pnpm run lint:hadolint -w -- --local` で Docker を使わずローカルにインストールしている `hadolint` を使用します
- `pnpm run lint:hadolint -w -- ./docker/dev` のように引数を指定するとその配下に対してのみチェックを行います (絶対パス、ファイル直接指定、複数指定なども可能)
- ルール概要配下です
  - production: 基本的にすべてオンになっています
  - development: バージョン固定や、`RUN` を一つにまとめるなどのルールがオフになっています
  - lambda関連: `WORKDIR` の指定を必要ないようにしています
