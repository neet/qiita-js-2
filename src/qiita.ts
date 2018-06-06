import nodeFetch from 'node-fetch';
import queryString from 'query-string';

export namespace Qiita {

  export interface Error {
    /** エラーの内容を説明する文字列です */
    message: string;
    /** エラーの種類を表す文字列です */
    type: string;
  }

  export interface Like {
    /** データが作成された日時 */
    created_at: string;
    /** Qiita上のユーザを表します。 */
    user: User;
  }

  export interface Comment {
    /** コメントの内容を表すMarkdown形式の文字列 */
    body: string;
    /** データが作成された日時 */
    created_at: string;
    /** コメントの一意なID */
    id: string;
    /** コメントの内容を表すHTML形式の文字列 */
    rendered_body: string;
    /** データが最後に更新された日時 */
    updated_at: string;
    /** Qiita上のユーザを表します。 */
    user: User;
  }

  interface User {
    /** 自己紹介文 */
    description?: string;
    /** Facebook ID  */
    facebook_id?: string;
    /** このユーザがフォローしているユーザの数  */
    followees_count: number;
    /** このユーザをフォローしているユーザの数 */
    followers_count: number;
    /** GitHub ID */
    github_login_name?: string;
    /** ユーザID */
    id: string;
    /** このユーザが qiita.com 上で公開している投稿の数 (Qiita:Teamでの投稿数は含まれません) */
    items_count: number;
    /** LinkedIn ID */
    linkedin_id?: string;
    /** 居住地 */
    location?: string;
    /** 設定している名前 */
    name?: string;
    /** 所属している組織 */
    organization?: string;
    /** ユーザごとに割り当てられる整数のID */
    permanent_id: number;
    /** 設定しているプロフィール画像のURL */
    profile_image_url: string;
    /** Twitterのスクリーンネーム */
    twitter_screen_name?: string;
    /** 設定しているWebサイトのURL */
    website_url?: string;
  }

  export interface AuthenticatedUser extends User {
    /** 1ヶ月あたりにQiitaにアップロードできる画像の総容量 */
    image_monthly_upload_limit: number;
    /** その月にQiitaにアップロードできる画像の残りの容量 */
    image_monthly_upload_remaining: number;
    /** Qiita:Team専用モードに設定されているかどうか */
    team_only: boolean;
  }

}

export class Qiita {

  private token    = '';
  private endpoint = 'https://qiita.com';
  private version  = '/api/v2';

  /**
   * Qiita APIにアクセスするためのトークンを設定します
   * @param token トークン文字列
   * @return 何も返しません
   */
  public setToken (token: string): void {
    this.token = token;
  }

  /**
   * Qiita Teamへのエンドポイントを設定します
   * @param endpoint エンドポイントへのURI
   * @return 何も返しません
   */
  public setEndpoint (endpoint: string): void {
    this.endpoint = endpoint;
  }

  /**
   * Qiita APIへのパスを指定します．
   * @param version APIへのパスの文字列 (e.g. `/api/v2`)
   * @return 何も返しません
   */
  public setVersion (version: string): void {
    this.version = version;
  }

  /**
   * Fetch APIのラッパー関数です．
   * 環境依存で `window.fetch` と `node-fetch` を切り替えます
   * @param url `fetch()` の第一引数です
   * @param options `fetch()` の第二引数です
   * @return レスポンスをパースしたリテラル/オブジェクトを返すPromiseを返します
   */
  private request = async (url: string, options: any = {}): Promise<any> => {
    options = { ...options };

    if ( options.headers === undefined ) {
      options.headers = {};
    }

    if ( this.token ) {
      options.headers['Authorization'] = `Bearer ${this.token}`;
    }

    options.headers['Content-Type']  = 'application/json';

    try {
      let response: any;

      if (typeof window === 'undefined') {
        response = await nodeFetch(url, options);
      } else {
        response = await fetch(url, options);
      }

      const data = await response.json();

      if ( response.ok ) {
        return data
      };

      throw data;
    } catch (error) {
      throw error.message ?
        error as Qiita.Error :
        { message: '予期せぬエラー', type: 'api_client_error' } as Qiita.Error;
    }
  }

  /**
   * HTTP GET のラッパー関数です
   * @param url リクエストのエンドポイントです
   * @param params オブジェクトを指定すると，query stringに文字列化してURLの末尾に付与します
   * @param options `fetch()` の第二引数です
   * @return レスポンスをパースしたリテラル/オブジェクトを返すPromiseを返します
   */
  private get = (url: string, params = {}, options = {}): Promise<any> => {
    return this.request(url + (Object.keys(params).length ? '?' + queryString.stringify(params) : ''), { method: 'GET', ...options });
  }

  /**
   * HTTP POST のラッパー関数です
   * @param url リクエストのエンドポイントです
   * @param params オブジェクトを指定すると，JSON文字列化してbodyに付与します
   * @param options `fetch()` の第二引数です
   * @return レスポンスをパースしたリテラル/オブジェクトを返すPromiseを返します
   */
  private post = (url: string, body = {}, options = {}): Promise<any> => {
    return this.request(url, { method: 'POST', body: JSON.stringify(body), ...options });
  }

  /**
   * HTTP PUT のラッパー関数です
   * @param url リクエストのエンドポイントです
   * @param params オブジェクトを指定すると，JSON文字列化してbodyに付与します
   * @param options `fetch()` の第二引数です
   * @return レスポンスをパースしたリテラル/オブジェクトを返すPromiseを返します
   */
  private put = (url: string, body = {}, options = {}): Promise<any> => {
    return this.request(url, { method: 'PUT', body: JSON.stringify(body), ...options });
  }

  /**
   * HTTP DELETE のラッパー関数です
   * @param url リクエストのエンドポイントです
   * @param params オブジェクトを指定すると，JSON文字列化してbodyに付与します
   * @param options `fetch()` の第二引数です
   * @return レスポンスをパースしたリテラル/オブジェクトを返すPromiseを返します
   */
  private delete = (url: string, body = {}, options = {}): Promise<any> => {
    return this.request(url, { method: 'DELETE', body: JSON.stringify(body), ...options });
  }

  /**
   * HTTP PATCH のラッパー関数です
   * @param url リクエストのエンドポイントです
   * @param params オブジェクトを指定すると，JSON文字列化してbodyに付与します
   * @param options `fetch()` の第二引数です
   * @return レスポンスをパースしたリテラル/オブジェクトを返すPromiseを返します
   */
  private patch = (url: string, body = {}, options = {}): Promise<any> => {
    return this.request(url, { method: 'PATCH', body: JSON.stringify(body), ...options });
  }


  /**
   * 投稿につけられた「いいね！」を作成日時の降順で返します。
   * @param itemId 投稿のID
   * @return いいね！エンティティを返します
   */
  public fetchLikesFromItem = (itemId: string): Promise<Qiita.Like> => {
    return this.get(`${this.endpoint}${this.version}/items/${itemId}/likes`);
  }

  /**
   * コメントを取得します。
   * @param commentId コメントのID
   * @return コメントのエンティティを返します
   */
  public fetchComment = (commentId: string): Promise<Qiita.Comment> => {
    return this.get(`${this.endpoint}${this.version}/comments/${commentId}`);
  }

  /**
   * コメントを更新します。
   * @param commentId コメントのID
   * @param body コメントの内容を表すMarkdown形式の文字列
   */
  public updateComment = (commentId: string, body: string): Promise<Qiita.Comment> => {
    return this.patch(`${this.endpoint}${this.version}/comments/${commentId}`, { body });
  }

  /**
   * コメントを削除します。
   * @param commentId コメントのID
   * @return 空のオブジェクト
   */
  public deleteComment = (commentId: string): Promise<{}> => {
    return this.delete(`${this.endpoint}${this.version}/comments/${commentId}`);
  }

  /**
   * 投稿に付けられたコメント一覧を投稿日時の降順で取得します。
   * @param itemId 投稿のID
   * @return コメント一覧
   */
  public fetchCommentsFromItem = (itemId: string): Promise<Qiita.Comment[]> => {
    return this.get(`${this.endpoint}${this.version}/items/${itemId}/comments`);
  }

  /**
   * 投稿に対してコメントを投稿します。
   * @param itemId 投稿のID
   * @param body コメントの内容を表すMarkdown形式の文字列
   * @return 投稿したコメント
   */
  public createCommentToItem = (itemId: string, body: string): Promise<Qiita.Comment[]> => {
    return this.post(`${this.endpoint}${this.version}/items/${itemId}/comments`, { body });
  }

  /**
   * プロジェクトに付けられたコメント一覧を投稿日時の降順で取得します。
   * @param projectId プロジェクトのID
   * @return コメント一覧
   */
  public fetchCommentsFromProject = (projectId: string): Promise<Qiita.Comment[]> => {
    return this.get(`${this.endpoint}${this.version}/projects/${projectId}/comments`);
  }

  /**
   * プロジェクトに対してコメントを投稿します。
   * @param projectId 投稿のID
   * @param body コメントの内容を表すMarkdown形式の文字列
   * @return 投稿したコメント
   */
  public createCommentToProject = (projectId: string, body: string): Promise<Qiita.Comment[]> => {
    return this.post(`${this.endpoint}${this.version}/items/${projectId}/comments`, { body });
  }
}
