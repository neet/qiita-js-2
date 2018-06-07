# qiita-js-2
Modern Qiita v2 API client for Node/Browser

## Usage
`qiita-js-2`をインストールする
```
yarn add qiita-js-2
```

例: 新規投稿をする
```ts
import * as Qiita from 'qiita-js-2';

const client = new Qiita();

client.setToken('your-token-here');

client.createItem({
  title: '新しい投稿',
  body:  'これは新しい投稿です',
  tags:  [{ name: 'Test', version: '0.0.1' }],
  gist:    false,
  twitter: false,
  private: false,
})
```

利用可能なすべてのメソッドのドキュメントは[こちらからご覧いただけます．](https://neet.github.io/qiita-js-2/classes/_qiita_.qiita.html)
