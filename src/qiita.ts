import nodeFetch from 'node-fetch';
import * as queryString from 'query-string';

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

  export interface AccessToken {
    /** 登録されたAPIクライアントを特定するためのIDです。40桁の16進数で表現されます。 */
    client_id: string;
    /** アプリケーションが利用するスコープをスペース区切りで指定できます。 */
    scopes: string[];
    /** CSRF対策のため、認可後にリダイレクトするURLのクエリに含まれる値を指定できます。 */
    token: string;
  }

  export interface Group {
    /** データが作成された日時 */
    created_at: string;
    /** グループの一意なIDを表します。 */
    id: number;
    /** グループに付けられた表示用の名前を表します。 */
    name: string;
    /** 非公開グループかどうかを表します。 */
    private: boolean;
    /** データが最後に更新された日時 */
    updated_at: string;
    /** グループのチーム上での一意な名前を表します。 */
    url_name: string;
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

  export interface Tagging {
    /** タグを特定するための一意な名前 */
    name: string;
    /** (説明無し) */
    versions: string[];
  }

  export interface Tag {
    /** このタグをフォローしているユーザの数 */
    followers_count: number;
    /** このタグに設定されたアイコン画像のURL */
    icon_url?: string;
    /** タグを特定するための一意な名前 */
    id: string;
    /** このタグが付けられた投稿の数 */
    items_count: number;
  }

  export interface Team {
    /** チームが利用可能な状態かどうか */
    active: boolean;
    /** チームの一意なID */
    id: string;
    /** チームに設定されている名前を表します。 */
    name: string;
  }

  export interface Template {
    /** テンプレートの本文 */
    body: string;
    /** テンプレートの一意なID */
    id: number;
    /** テンプレートを判別するための名前 */
    name: string;
    /** 変数を展開した状態の本文 */
    expanded_body: string;
    /** 変数を展開した状態のタグ一覧 */
    expanded_tags: Tagging[];
    /** 変数を展開した状態のタイトル */
    expanded_title: string;
    /** タグ一覧 */
    tags: Tagging[];
    /** 生成される投稿のタイトルの雛形 */
    title: string;
  }

  export interface Project {
    /** HTML形式の本文 */
    rendered_body: string;
    /** このプロジェクトが進行中かどうか */
    archived: boolean;
    /** Markdown形式の本文 */
    body: string;
    /** データが作成された日時 */
    created_at: string;
    /** プロジェクトのチーム上での一意なID */
    id: number;
    /** プロジェクト名 */
    name: string;
    /** 絵文字リアクション数 */
    reactions_count: number;
    /** データが最後に更新された日時 */
    updated_at: string;
  }

  export interface User {
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

  export interface ExpandedTemplate {
    /** 変数を展開した状態の本文 */
    expanded_body: string;
    /** 変数を展開した状態のタグ一覧 */
    expanded_tags: Tagging[];
    /** 変数を展開した状態のタイトル */
    expanded_title: string;
  }

  export interface Item {
    /** HTML形式の本文 */
    rendered_body: string;
    /** Markdown形式の本文 */
    body: string;
    /** この投稿が共同更新状態かどうか (Qiita:Teamでのみ有効) */
    coediting: boolean;
    /** この投稿へのコメントの数 */
    comments_count: number;
    /** データが作成された日時 */
    created_at: string;
    /** Qiita:Teamのグループを表します。 */
    group: Group;
    /** 投稿の一意なID */
    id: string;
    /** この投稿への「いいね！」の数（Qiitaでのみ有効） */
    likes_count: number;
    /** 限定共有状態かどうかを表すフラグ (Qiita:Teamでは無効) */
    private: boolean;
    /** 投稿に付いたタグ一覧 */
    tags: Tagging[];
    /** 投稿のタイトル */
    title: string;
    /** データが最後に更新された日時 */
    updated_at: string;
    /** 投稿のURL */
    url: string;
    /** Qiita上のユーザを表します。 */
    user: User;
    /** 閲覧数 */
    page_views_count: number;
  }

  export interface TeamInvitation {
    /** 招待中のメンバーのemailアドレスです。 */
    email: string;
    /** 招待用URLです。有効期限は1日です。 */
    url: string;
  }

  export interface Reaction {
    /** データが作成された日時 */
    created_at: string;
    /** 絵文字画像のURL */
    image_url: string;
    /** 絵文字の識別子 */
    name: string;
    /** Qiita上のユーザを表します。 */
    user: User;
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

  private token = '';
  private endpoint = 'https://qiita.com';
  private version = '/api/v2';

  /**
   * Qiita APIにアクセスするためのトークンを設定します
   * @param token トークン文字列
   * @return 何も返しません
   */
  public setToken(token: string): void {
    this.token = token;
  }

  /**
   * Qiita Teamへのエンドポイントを設定します
   * @param endpoint エンドポイントへのURI
   * @return 何も返しません
   */
  public setEndpoint(endpoint: string): void {
    this.endpoint = endpoint;
  }

  /**
   * Qiita APIへのパスを指定します．
   * @param version APIへのパスの文字列 (e.g. `/api/v2`)
   * @return 何も返しません
   */
  public setVersion(version: string): void {
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

    if (options.headers === undefined) {
      options.headers = {};
    }

    if (this.token) {
      options.headers['Authorization'] = `Bearer ${this.token}`;
    }

    options.headers['Content-Type'] = 'application/json';

    try {
      let response: any;

      if (typeof window === 'undefined') {
        response = await nodeFetch(url, options);
      } else {
        response = await fetch(url, options);
      }

      const data = await response.json();

      if (response.ok) {
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
   * 与えられた認証情報をもとに新しいアクセストークンを発行します。
   * @param clientId 登録されたAPIクライアントを特定するためのID
   * @param clientSecret 登録されたAPIクライアントを認証するための秘密鍵
   * @param code リダイレクト用のURLに付与された、アクセストークンと交換するための文字列
   * @return アクセストークン
   */
  public fetchAccessToken = (clientId: string, clientSecret: string, code: string): Promise<Qiita.AccessToken> => {
    return this.post(`${this.endpoint}${this.version}/access_tokens`, {
      client_id: clientId,
      client_secret: clientSecret,
      code,
    });
  }

  /**
   * 指定されたアクセストークンを失効させ、それ以降利用できないようにします。
   * @param token アクセストークン
   * @return 空のオブジェクト
   */
  public deleteAccessToken = (token: string): Promise<{}> => {
    return this.delete(`${this.endpoint}${this.version}/access_tokens/${token}`);
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

  /**
   * 投稿にタグを追加します。Qiita:Teamでのみ有効です。
   * @param itemId 投稿のID
   * @param name タグを特定するための一意な名前
   * @param versions (説明なし)
   */
  public addTaggingToItem = (itemId: string, name: string, versions: string[]): Promise<Qiita.Tagging> => {
    return this.post(`${this.endpoint}${this.version}/items/${itemId}/taggings`, { name, versions });
  }

  /**
   * 投稿から指定されたタグを取り除きます。Qiita:Teamでのみ有効です。
   * @param itemId 投稿のID
   * @param taggingId タギングのID
   * @return 空のオブジェクト
   */
  public removeTaggingFromItem = (itemId, taggingId): Promise<{}> => {
    return this.delete(`${this.endpoint}${this.version}/items/${itemId}/taggings/${taggingId}`);
  }

  /**
   * タグ一覧を作成日時の降順で返します。
   * @param page ページ番号 (1から100まで)
   * @param perPage 1ページあたりに含まれる要素数 (1から100まで)
   * @param sort 並び順 (countで投稿数順、nameで名前順)
   * @return タグ一覧
   */
  public fetchTags = (page: string, perPage: string, sort: string): Promise<Qiita.Tag[]> => {
    return this.get(`${this.endpoint}${this.version}/tags`, {
      page,
      per_page: perPage,
      sort,
    });
  }

  /**
   * タグを取得します。
   * @param tagId タグのID
   * @return タグ
   */
  public fetchTag = (tagId: string): Promise<Qiita.Tag> => {
    return this.get(`${this.endpoint}${this.version}/tags/${tagId}`);
  }

  /**
   * ユーザがフォローしているタグ一覧をフォロー日時の降順で返します。
   * @param userId ユーザーID
   * @param page ページ番号 (1から100まで)
   * @param perPage 1ページあたりに含まれる要素数 (1から100まで)
   * @return タグ一覧
   */
  public fetchFollowingTags = (userId: string, page: string, perPage: string): Promise<Qiita.Tag[]> => {
    return this.get(`${this.endpoint}${this.version}/${userId}/following_tags`, {
      page,
      per_page: perPage,
    });
  }

  /**
   * タグをフォローします。
   * @param tagId タグのID
   * @return 空のオブジェクト
   */
  public unfollowTag = (tagId: string): Promise<{}> => {
    return this.delete(`${this.endpoint}${this.version}/tags/${tagId}/following`);
  }

  /**
   * タグをフォローしているかどうかを調べます。
   * @param tagId タグのID
   * @return タグ
   */
  public fetchIfFollowingTag = (tagId: string): Promise<Qiita.Tag> => {
    return this.get(`${this.endpoint}${this.version}/tags/${tagId}/following`);
  }

  /**
   * タグをフォローします。
   * @param tagId タグのID
   * @return 空のオブジェクト
   */
  public followTag = (tagId: string): Promise<Qiita.Tag> => {
    return this.put(`${this.endpoint}${this.version}/tags/${tagId}/following`);
  }

  /**
   * ユーザが所属している全てのチームを、チーム作成日時の降順で返します。
   * @return チーム一覧
   */
  public fetchTeams = (): Promise<Qiita.Team[]> => {
    return this.get(`${this.endpoint}${this.version}/teams`);
  }

  /**
   * チーム内のテンプレート一覧を返します。
   * @param page ページ番号 (1から100まで)
   * @param perPage 1ページあたりに含まれる要素数 (1から100まで)
   * @return テンプレート一覧
   */
  public fetchTemplates = (page: string, perPage: string): Promise<Qiita.Template[]> => {
    return this.get(`${this.endpoint}${this.version}/templates`, {
      page,
      per_page: perPage,
    });
  }

  /**
   * テンプレートを削除します。
   * @param templateId テンプレートID
   * @return 空のオブジェクト
   */
  public deleteTemplate = (templateId: string): Promise<{}> => {
    return this.delete(`${this.endpoint}${this.version}/templates/${templateId}`);
  }

  /**
   * テンプレートを取得します。
   * @param tempalteId テンプレートID
   * @return テンプレート
   */
  public fetchTempalte = (templateId: string): Promise<Qiita.Template> => {
    return this.get(`${this.endpoint}${this.version}/templates/${templateId}`);
  }

  /**
   * 新しくテンプレートを作成します。
   * @param body テンプレートの本文
   * @param name テンプレートを判別するための名前
   * @param tags タグ一覧
   * @param title 生成される投稿のタイトルの雛形
   * @return テンプレート
   */
  public createTemplate = (body: string, name: string, tags: Qiita.Tagging[], title: string): Promise<Qiita.Template> => {
    return this.post(`${this.endpoint}${this.version}/templates`, { body, name, tags, title });
  }

  /**
   * テンプレートを更新します。
   * @param body テンプレートの本文
   * @param name テンプレートを判別するための名前
   * @param tags タグ一覧
   * @param title 生成される投稿のタイトルの雛形
   * @return テンプレート
   */
  public updateTempalte = (body: string, name: string, tags: Qiita.Tagging[], title: string): Promise<Qiita.Template> => {
    return this.patch(`${this.endpoint}${this.version}/templates`, { body, name, tags, title });
  }

  /**
   * チーム内に存在するプロジェクト一覧をプロジェクト作成日時の降順で返します。
   * @param page ページ番号 (1から100まで)
   * @param perPage 1ページあたりに含まれる要素数 (1から100まで)
   * @return プロジェクト一覧
   */
  public fetchProjects = (page: string, perPage: string): Promise<Qiita.Project[]> => {
    return this.get(`${this.endpoint}${this.version}/projects`, {
      page,
      per_page: perPage,
    });
  }

  /**
   * プロジェクトを新たに作成します。
   * @param archived このプロジェクトが進行中かどうか
   * @param body Markdown形式の本文
   * @param name プロジェクト名
   * @param tags 投稿に付いたタグ一覧
   * @return プロジェクト
   */
  public createProject = (archived: boolean, body: string, name: string, tags: Qiita.Tagging[]): Promise<Qiita.Project> => {
    return this.post(`${this.endpoint}${this.version}/projects`, { archived, body, name, tags });
  }

  /**
   * プロジェクトを削除します。
   * @param projectId プロジェクトID
   * @return 空のオブジェクト
   */
  public deleteProject = (projectId: string): Promise<{}> => {
    return this.delete(`${this.endpoint}${this.version}/projects/${projectId}`);
  }

  /**
   * プロジェクトを返します。
   * @param projectId プロジェクトID
   * @return プロジェクト
   */
  public fetchProject = (projectId: string): Promise<Qiita.Project> => {
    return this.get(`${this.endpoint}${this.version}/projects/${projectId}`);
  }

  /**
   * プロジェクトを更新します。
   * @param archived このプロジェクトが進行中かどうか
   * @param body Markdown形式の本文
   * @param name プロジェクト名
   * @param tags 投稿に付いたタグ一覧
   * @return プロジェクト
   */
  public updateProject = (archived: boolean, body: string, name: string, tags: Qiita.Tagging[]): Promise<Qiita.Project> => {
    return this.patch(`${this.endpoint}${this.version}/projects`, { archived, body, name, tags });
  }

  /**
   * 投稿をストックしているユーザ一覧を、ストックした日時の降順で返します。
   * @param page ページ番号 (1から100まで)
   * @param perPage 1ページあたりに含まれる要素数 (1から100まで)
   * @return ユーザー一覧
   */
  public fetchStockersFromItem = (itemId: string, page: string, perPage: string): Promise<Qiita.User[]> => {
    return this.get(`${this.endpoint}${this.version}/items/${itemId}/stockers`, {
      page,
      per_page: perPage,
    });
  }

  /**
   * 全てのユーザの一覧を作成日時の降順で取得します。
   * @param page ページ番号 (1から100まで)
   * @param perPage 1ページあたりに含まれる要素数 (1から100まで)
   * @return ユーザー一覧
   */
  public fetchUsers = (page: string, perPage: string): Promise<Qiita.User[]> => {
    return this.get(`${this.endpoint}${this.version}/users`, {
      page,
      per_page: perPage,
    });
  }

  /**
   * ユーザを取得します。
   * @param userId ユーザーID
   * @return ユーザー
   */
  public fetchUser = (userId: string): Promise<Qiita.User> => {
    return this.get(`${this.endpoint}${this.version}/users/${userId}`);
  }

  /**
   * ユーザがフォローしているユーザ一覧を取得します。
   * @param userId ユーザーID
   * @param page ページ番号 (1から100まで)
   * @param perPage 1ページあたりに含まれる要素数 (1から100まで)
   * @return ユーザー一覧
   */
  public fetchFolloweesFromUser = (userId: string, page: string, perPage: string): Promise<Qiita.User[]> => {
    return this.get(`${this.endpoint}${this.version}/users/${userId}/followees`, {
      page,
      per_page: perPage,
    })
  }

  /**
   * ユーザをフォローしているユーザ一覧を取得します。
   * @param userId ユーザーID
   * @param page ページ番号 (1から100まで)
   * @param perPage 1ページあたりに含まれる要素数 (1から100まで)
   * @return ユーザー一覧
   */
  public fetchFollowersFromUser = (userId: string, page: string, perPage: string): Promise<Qiita.User[]> => {
    return this.get(`${this.endpoint}${this.version}/users/${userId}/followers`, {
      page,
      per_page: perPage,
    })
  }

  /**
   * ユーザをフォローしているユーザ一覧を取得します。
   * @param userId ユーザーID
   * @return 空のオブジェクト
   */
  public unfollowUser = (userId: string): Promise<{}> => {
    return this.delete(`${this.endpoint}${this.version}/users/${userId}/following`);
  }

  /**
   * ユーザへのフォローを外します。
   * @param userId ユーザーID
   * @return 空のオブジェクト
   */
  public fetchIfFollowUser = (userId: string): Promise<{}> => {
    return this.get(`${this.endpoint}${this.version}/users/${userId}/following`);
  }

  /**
   * ユーザをフォローしている場合に204を返します。
   * @param userId ユーザーID
   * @return 空のオブジェクト
   */
  public followUser = (userId: string): Promise<{}> => {
    return this.put(`${this.endpoint}${this.version}/users/${userId}/following`);
  }

}
