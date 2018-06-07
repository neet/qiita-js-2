# qiita-js-2
Modern Qiita v2 API client for Node/Browser

## 使い方
### `qiita-js-2`をインストールする

**NPM:**
```
npm i qiita-js-2 --save
```

**Yarn:**
```
yarn add qiita-js-2
```

### トークンを取得
Qiitaの[アプリケーションページ](https://qiita.com/settings/applications)を開き，新しいアクセストークンを発行します．

![新しいアクセストークンを発行](https://i.imgur.com/LPtgosR.png)

アクセストークンを発行します．説明と，必要に応じてスコープを付与し発行してください．

![アクセストークンの発行](https://i.imgur.com/7yxJWmw.png)

生成されたアクセストークンをコピーして保存してください．このトークンは以下で必要です

![アクセストークン](https://i.imgur.com/l6V6qmg.png)

### 利用する
```ts
// Node.js
const Qiita = require('qiita-js-2').default;
// TypeScript あるいは Babel
import Qiita from 'qiita-js-2';

const client = new Qiita();
client.setToken('ここにトークンを指定します');

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

利用可能なすべてのメソッドのドキュメントは[こちらからご覧いただけます．](https://neet.github.io/qiita-js-2/classes/_qiita_.qiita.html)
