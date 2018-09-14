# qiita-js-2
[![npm](https://img.shields.io/npm/v/qiita-js-2.svg)](https://www.npmjs.com/package/qiita-js-2)
[![Build Status](https://travis-ci.org/neet/qiita-js-2.svg?branch=master)](https://travis-ci.org/neet/qiita-js-2)
[![Maintainability](https://api.codeclimate.com/v1/badges/9eb161f2bd4b1f062c9c/maintainability)](https://codeclimate.com/github/neet/qiita-js-2/maintainability)

Modern Qiita v2 API client for Node/Browser

## 使い方
### パッケージををインストール
```
npm i qiita-js-2 --save
```
<a href='https://www.patreon.com/neetshin'><img src='https://c5.patreon.com/external/logo/become_a_patron_button.png' alt='Become a patron' width='140px' /></a>

### トークンを取得
Qiitaの[アプリケーションページ](https://qiita.com/settings/applications)を開き、新しいアクセストークンを発行します。

![新しいアクセストークンを発行](https://i.imgur.com/LPtgosR.png)

アクセストークンを発行します。説明と、必要に応じてスコープを付与し発行してください。

![アクセストークンの発行](https://i.imgur.com/7yxJWmw.png)

生成されたアクセストークンをコピーして保存してください。このトークンは以下で利用します。

![アクセストークン](https://i.imgur.com/l6V6qmg.png)

### 利用する
```ts
// Node.js
const { Qiita } = require('qiita-js-2');
// TypeScript あるいは Babel
import { Qiita } from 'qiita-js-2';

const client = new Qiita({
  token: 'ここにトークンを指定します',
});

// 例: ユーザーを取得する
client.fetchUser('neetshin').then((user) => {
  console.log(user);
})

// 例: 新規投稿をする
client.createItem({
  title: '新しい投稿',
  body:  'これは新しい投稿です',
  tags:  [{ name: 'Test', version: '0.0.1' }],
  gist:    false,
  twitter: false,
  private: false,
}).then((newItem) => {
  console.log(newItem);
});
```

利用可能なすべてのメソッドのドキュメントは[こちらからご覧いただけます](https://neet.github.io/qiita-js-2/classes/_client_qiita_.qiita.html)。


## 開発
開発に必要なパッケージをインストールします
```
yarn --pure-lockfile
```

下記のコマンドでビルドします
```
yarn run test       # テストを実行します
yarn run build      # JSをビルドします
yarn run docs:build # ドキュメントを生成します。
```

## Maintainers

<table>
  <tbody>
    <tr>
      <td align="center">
        <a href="https://github.com/neet">
          <img width="120" height="120" src="https://github.com/neet.png?size=120">
          </br>
          Neetshin
        </a>
      </td>
    </tr>
  <tbody>
</table>

## License
MIT
