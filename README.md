# qiita-js-2
Modern Qiita v2 API client for Node/Browser

## Usage
`qiita-js-2`をインストールする
```
yarn add qiita-js-2
```

利用方法
```ts
// Node.js
const Qiita = require('qiita-js-2').default;
// TypeScript あるいは Babel
import * as Qiita from 'qiita-js-2';

const client = new Qiita();

client.setToken('your-token-here');

// 例: ユーザーを取得する
client.fetchUser('neetshin').then((user) => {
  console.log(user);
  /*
    { description: null,
    facebook_id: null,
    followees_count: 0,
    ...略
  */
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
  /*
    { rendered_body: '<p>これは新しい投稿です</p>\n',
    body: 'これは新しい投稿です\n',
    coediting: false,
    ...略
  */
});
```

利用可能なすべてのメソッドのドキュメントは[こちらからご覧いただけます．](https://neet.github.io/qiita-js-2/classes/_qiita_.qiita.html)
