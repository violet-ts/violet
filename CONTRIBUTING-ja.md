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
- Firebase Auth Suite Auth:[http://localhost:4000/auth](http://localhost:4000/auth)

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

### Authentication

プロダクションのアイデンティティ管理には [Google Cloud Identity Platform (GCIP)](https://cloud.google.com/identity-platform) を使用します。
ただし、開発中はデフォルトで Firebase emulator を使う用になっています。

#### Firebase エミュレータを使用

特に設定は要りません。以下のユーザ名とパスワードのセットがデフォルトで入った状態で起動します。 noicon1 はアイコンが設定されていないユーザです。
認証方法はメール以外は使用できません。

```
testuser1@example.com
testuserexample1
testuser2@example.com
testuserexample2
noicon1@example.com
noicon1
```

#### GCIP につなぐ

ローカル環境を GCIP 環境に接続することも可能です。以下のように環境変数をセットします。

```
# .env
GOOGLE_APPLICATION_CREDENTIALS=/path/to/dir/gcloud-violet-credential.json
GCLOUD_PROJECT=your-proj
FIREBASE_AUTH_EMULATOR_HOST=
```

```
# pkg/web/.env.local
NEXT_PUBLIC_GCIP_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_GCIP_AUTH_DOMAIN=your-proj.firebaseapp.com
NEXT_PUBLIC_AUTH_EMULATOR=
```

### Lambda 内のソースコードに変更があった際

Lambda Docker は、依存のバージョンアップをしたなど、場合によっては再起動が必要です。これは一瞬で終わります。

- `docker-compose rm -f lambda; docker-compose up -d lambda`
- `docker-compose up lambda` でアタッチされている状態のまま `CTRL-C` (`CTRL-\` で抜けれます)、その後 `docker-compose up lambda`


## コーディングルール

### 一般

- `pnpm run lint -w` でチェック
- `pnpm run lint:fix -w` で自動修正

### ルーティング

- api, web ともに `/dev/` 配下は staging 以降はロードバランサで弾きます。 (予定)
  - 危険な操作ができるような API は作成を避けてください

### Dockerfile

- `hadolint` を使用します。ルール指定をスクリプト経由でしているので、スクリプトから起動してください
- `pnpm run lint:hadolint -w` で `hadolint` をかけます
- `pnpm run lint:hadolint -w -- --local` で Docker を使わずローカルにインストールしている `hadolint` を使用します
- `pnpm run lint:hadolint -w -- ./docker/dev` のように引数を指定するとその配下に対してのみチェックを行います (絶対パス、ファイル直接指定、複数指定なども可能)
- ルール概要配下です
  - production: 基本的にすべてオンになっています
  - development: バージョン固定や、`RUN` を一つにまとめるなどのルールがオフになっています
  - lambda関連: `WORKDIR` の指定を必要ないようにしています
