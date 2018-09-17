import { Gateway } from './Gateway';
import * as options from './options';

import { AccessToken } from '../entities/AccessToken';
import { AuthenticatedUser } from '../entities/AuthenticatedUser';
import { Comment } from '../entities/Comment';
import { Item } from '../entities/Item';
import { Like } from '../entities/Like';
import { Project } from '../entities/Project';
import { Reaction } from '../entities/Reaction';
import { Tag } from '../entities/Tag';
import { Tagging } from '../entities/Tagging';
import { Team } from '../entities/Team';
import { TeamInvitation } from '../entities/TeamInvitation';
import { Template } from '../entities/Template';
import { User } from '../entities/User';

export class Qiita extends Gateway {

  /**
   * Qiita APIのページネーションをラップする非同期反復可能オブジェクトを返します
   * nextの引数に文字列 'reset' を渡すと最初のインデックスに戻ることができます。
   * @param url リクエストするURL
   * @param options リクエストのオプション
   */
  public async * paginationGenerator <T extends any[]> (url: string, options?: any) {
    // Qiitaのページネーションインデックスは1から始まります
    let page = 1;

    while (true) {
      const data = await this.get<T>(url, { ...options, page });
      const result: T | 'reset' = yield data;

      if (result === 'reset') {
        page = 1;
      } else {
        page++;

        // レスポンスの配列の長さがない場合にイテレーターを終了します。
        if (!data.length) {
          break;
        }
      }
    }
  }

  /**
   * 与えられた認証情報をもとに新しいアクセストークンを発行します。
   * @param client_id 登録されたAPIクライアントを特定するためのID
   * @param client_secret 登録されたAPIクライアントを認証するための秘密鍵
   * @param code リダイレクト用のURLに付与された、アクセストークンと交換するための文字列
   * @return アクセストークン
   */
  public fetchAccessToken = (client_id: string, client_secret: string, code: string) => {
    return this.post<AccessToken>(`${this.url}${this.version}/access_tokens`, {
      client_id,
      client_secret,
      code,
    });
  }

  /**
   * 指定されたアクセストークンを失効させ、それ以降利用できないようにします。
   * @param token アクセストークン
   * @return 空のオブジェクト
   */
  public deleteAccessToken = (token: string) => {
    return this.delete<void>(`${this.url}${this.version}/access_tokens/${token}`);
  }

  /**
   * コメントを取得します。
   * @param comment_id コメントのID
   * @return コメントのエンティティを返します
   */
  public fetchComment = (comment_id: string) => {
    return this.get<Comment>(`${this.url}${this.version}/comments/${comment_id}`);
  }

  /**
   * コメントを更新します。
   * @param comment_id コメントのID
   * @param body コメントの内容を表すMarkdown形式の文字列
   */
  public updateComment = (comment_id: string, body: string) => {
    return this.patch<Comment>(`${this.url}${this.version}/comments/${comment_id}`, { body });
  }

  /**
   * コメントを削除します。
   * @param comment_id コメントのID
   * @return 空のオブジェクト
   */
  public deleteComment = (comment_id: string) => {
    return this.delete<void>(`${this.url}${this.version}/comments/${comment_id}`);
  }

  /**
   * コメントに付けられた絵文字リアクション一覧を作成日時の降順で返します。
   * @param comment_id コメントID
   * @return 絵文字リアクション
   */
  public fetchCommentReactions = (comment_id: string) => {
    return this.get<Reaction[]>(`${this.url}${this.version}/comments/${comment_id}/reactions`);
  }

  /**
   * コメントに絵文字リアクションを付けます。
   * @param comment_id コメントID
   * @param name 絵文字の識別子
   * @return 絵文字リアクション
   */
  public createCommentReaction = (comment_id: string, name: string) => {
    return this.post<Reaction>(`${this.url}${this.version}/comments/${comment_id}/reactions`, { name });
  }

  /**
   * コメントから絵文字リアクションを削除します。
   * @param comment_id コメントID
   * @param name 絵文字の識別子
   * @return 絵文字リアクション
   */
  public deleteCommentReaction = (comment_id: string, name: string) => {
    return this.delete<Reaction>(`${this.url}${this.version}/comments/${comment_id}/reactions`, { name });
  }

  /**
   * タグ一覧を作成日時の降順で返します。
   * @param options.page ページ番号 (1から100まで)
   * @param options.perPage 1ページあたりに含まれる要素数 (1から100まで)
   * @param options.sort 並び順 (countで投稿数順、nameで名前順)
   * @return タグ一覧を返す非同期反復可能オブジェクト
   */
  public fetchTags = (options?: options.FetchTagsOptions) => {
    return this.paginationGenerator<Tag[]>(`${this.url}${this.version}/tags`, options);
  }

  /**
   * タグを取得します。
   * @param tagId タグのID
   * @return タグ
   */
  public fetchTag = (tag_id: string) => {
    return this.get<Tag>(`${this.url}${this.version}/tags/${tag_id}`);
  }

  /**
   * タグをフォローしているかどうかを調べます。
   * @param tag_id タグのID
   * @return タグ
   */
  public fetchTagFollowing = (tag_id: string) => {
    return this.get<Tag>(`${this.url}${this.version}/tags/${tag_id}/following`);
  }

  /**
   * タグをフォローします。
   * @param tag_id タグのID
   * @return 空のオブジェクト
   */
  public followTag = (tag_id: string) => {
    return this.put<Tag>(`${this.url}${this.version}/tags/${tag_id}/following`);
  }

  /**
   * タグをフォローします。
   * @param tag_id タグのID
   * @return 空のオブジェクト
   */
  public unfollowTag = (tag_id: string) => {
    return this.delete<void>(`${this.url}${this.version}/tags/${tag_id}/following`);
  }

  /**
   * 指定されたタグが付けられた投稿一覧を、タグを付けた日時の降順で返します。
   * @param tag_id タグID
   * @param options.page ページ番号 (1から100まで)
   * @param options.per_page 1ページあたりに含まれる要素数 (1から100まで)
   * @return 投稿一覧を返す非同期反復可能オブジェクト
   */
  public fetchTaggedItems = (tag_id: string, options?: options.PaginationOptions) => {
    return this.paginationGenerator<Item[]>(`${this.url}${this.version}/tags/${tag_id}`, options);
  }

  /**
   * チーム内のテンプレート一覧を返します。
   * @param options.page ページ番号 (1から100まで)
   * @param options.per_page 1ページあたりに含まれる要素数 (1から100まで)
   * @return テンプレート一覧を返す非同期反復可能オブジェクト
   */
  public fetchTemplates = (options?: options.PaginationOptions) => {
    return this.paginationGenerator<Template[]>(`${this.url}${this.version}/templates`, options);
  }

  /**
   * テンプレートを取得します。
   * @param template_id テンプレートID
   * @return テンプレート
   */
  public fetchTempalte = (template_id: string) => {
    return this.get<Template>(`${this.url}${this.version}/templates/${template_id}`);
  }

  /**
   * 新しくテンプレートを作成します。
   * @param options.body テンプレートの本文
   * @param options.name テンプレートを判別するための名前
   * @param options.tags タグ一覧
   * @param options.title 生成される投稿のタイトルの雛形
   * @return テンプレート
   */
  public createTemplate = (options: options.CreateTemplateOptions) => {
    return this.post<Template>(`${this.url}${this.version}/templates`, options);
  }

  /**
   * テンプレートを更新します。
   * @param options.body テンプレートの本文
   * @param options.name テンプレートを判別するための名前
   * @param options.tags タグ一覧
   * @param options.title 生成される投稿のタイトルの雛形
   * @return テンプレート
   */
  public updateTempalte = (options?: options.UpdateTemplateOptions) => {
    return this.patch<Template>(`${this.url}${this.version}/templates`, options);
  }

  /**
   * テンプレートを削除します。
   * @param template_id テンプレートID
   * @return 空のオブジェクト
   */
  public deleteTemplate = (template_id: string) => {
    return this.delete<void>(`${this.url}${this.version}/templates/${template_id}`);
  }

  /**
   * チーム内に存在するプロジェクト一覧をプロジェクト作成日時の降順で返します。
   * @param options.page ページ番号 (1から100まで)
   * @param options.per_page 1ページあたりに含まれる要素数 (1から100まで)
   * @return プロジェクト一覧
   */
  public fetchProjects = (options?: options.PaginationOptions) => {
    return this.paginationGenerator<Project[]>(`${this.url}${this.version}/projects`, options);
  }

  /**
   * プロジェクトを返します。
   * @param project_id プロジェクトID
   * @return プロジェクト
   */
  public fetchProject = (project_id: string) => {
    return this.get<Project>(`${this.url}${this.version}/projects/${project_id}`);
  }

  /**
   * プロジェクトを新たに作成します。
   * @param options.archived このプロジェクトが進行中かどうか
   * @param options.body Markdown形式の本文
   * @param options.name プロジェクト名
   * @param options.tags 投稿に付いたタグ一覧
   * @return プロジェクト
   */
  public createProject = (options: options.CreateProjectOptions) => {
    return this.post<Project>(`${this.url}${this.version}/projects`, options);
  }

  /**
   * プロジェクトを更新します。
   * @param options.archived このプロジェクトが進行中かどうか
   * @param options.body Markdown形式の本文
   * @param options.name プロジェクト名
   * @param options.tags 投稿に付いたタグ一覧
   * @return プロジェクト
   */
  public updateProject = (options?: options.UpdateProjectOptions) => {
    return this.patch<Project>(`${this.url}${this.version}/projects`, options);
  }

  /**
   * プロジェクトを削除します。
   * @param project_id プロジェクトID
   * @return 空のオブジェクト
   */
  public deleteProject = (project_id: string) => {
    return this.delete<void>(`${this.url}${this.version}/projects/${project_id}`);
  }

  /**
   * プロジェクトに付けられたコメント一覧を投稿日時の降順で取得します。
   * @param project_id プロジェクトのID
   * @return コメント一覧
   */
  public fetchProjectComments = (project_id: string) => {
    return this.get<Comment[]>(`${this.url}${this.version}/projects/${project_id}/comments`);
  }

  /**
   * プロジェクトに対してコメントを投稿します。
   * @param project_id 投稿のID
   * @param body コメントの内容を表すMarkdown形式の文字列
   * @return 投稿したコメント
   */
  public createProjectComment = (project_id: string, body: string) => {
    return this.post<Comment[]>(`${this.url}${this.version}/projects/${project_id}/comments`, { body });
  }

  /**
   * プロジェクトに付けられた絵文字リアクション一覧を作成日時の降順で返します。
   * @param project_id プロジェクトID
   * @return 絵文字リアクション一覧
   */
  public fetchProjectReactions = (project_id: string) => {
    return this.get<Reaction[]>(`${this.url}${this.version}/projects/${project_id}/reactions`);
  }

  /**
   * プロジェクトに絵文字リアクションを付けます。
   * @param project_id プロジェクトID
   * @param name 絵文字の識別子
   * @return 絵文字リアクション
   */
  public createProjectReaction = (project_id: string, name: string) => {
    return this.post<Reaction>(`${this.url}${this.version}/projects/${project_id}/reactions`, { name });
  }

  /**
   * プロジェクトから絵文字リアクションを削除します。
   * @param project_id プロジェクトID
   * @param name 絵文字の識別子
   * @return 絵文字リアクション
   */
  public deleteProjectReaction = (project_id: string, name: string) => {
    return this.delete<Reaction>(`${this.url}${this.version}/projects/${project_id}/reactions`, { name });
  }

  /**
   * 全てのユーザの一覧を作成日時の降順で取得します。
   * @param options.page ページ番号 (1から100まで)
   * @param options.per_page 1ページあたりに含まれる要素数 (1から100まで)
   * @return ユーザー一覧を返す非同期反復可能オブジェクト
   */
  public fetchUsers = (options?: options.PaginationOptions) => {
    return this.paginationGenerator<User[]>(`${this.url}${this.version}/users`, options);
  }

  /**
   * ユーザを取得します。
   * @param user_id ユーザーID
   * @return ユーザー
   */
  public fetchUser = (user_id: string) => {
    return this.get<User>(`${this.url}${this.version}/users/${user_id}`);
  }

  /**
   * ユーザがフォローしているユーザ一覧を取得します。
   * @param user_id ユーザーID
   * @param options.page ページ番号 (1から100まで)
   * @param options.per_page 1ページあたりに含まれる要素数 (1から100まで)
   * @return ユーザー一覧を返す非同期反復可能オブジェクト
   */
  public fetchUserFollowees = (user_id: string, options?: options.PaginationOptions) => {
    return this.paginationGenerator<User[]>(`${this.url}${this.version}/users/${user_id}/followees`, options);
  }

  /**
   * ユーザをフォローしているユーザ一覧を取得します。
   * @param user_id ユーザーID
   * @param options.page ページ番号 (1から100まで)
   * @param options.per_page 1ページあたりに含まれる要素数 (1から100まで)
   * @return ユーザー一覧を返す非同期反復可能オブジェクト
   */
  public fetchUserFollowers = (user_id: string, options?: options.PaginationOptions) => {
    return this.paginationGenerator<User[]>(`${this.url}${this.version}/users/${user_id}/followers`, options);
  }

  /**
   * 指定されたユーザの投稿一覧を、作成日時の降順で返します。
   * @param user_id ユーザID
   * @param options.page ページ番号 (1から100まで)
   * @param options.per_page 1ページあたりに含まれる要素数 (1から100まで)
   * @return 投稿一覧を返す非同期反復可能オブジェクト
   */
  public fetchUserItems = (user_id: string, options?: options.PaginationOptions) => {
    return this.paginationGenerator<Item[]>(`${this.url}${this.version}/users/${user_id}/items`, options);
  }

  /**
   * 指定されたユーザがストックした投稿一覧を、ストックした日時の降順で返します。
   * @param user_id ユーザID
   * @param options.page ページ番号 (1から100まで)
   * @param options.per_page 1ページあたりに含まれる要素数 (1から100まで)
   * @return 投稿一覧を返す非同期反復可能オブジェクト
   */
  public fetchUserStocks = (user_id: string, options?: options.PaginationOptions) => {
    return this.paginationGenerator<Item[]>(`${this.url}${this.version}/users/${user_id}/items`, options);
  }

  /**
   * ユーザがフォローしているタグ一覧をフォロー日時の降順で返します。
   * @param user_id ユーザーID
   * @param options.page ページ番号 (1から100まで)
   * @param options.per_page 1ページあたりに含まれる要素数 (1から100まで)
   * @return タグ一覧を返す非同期反復可能オブジェクト
   */
  public fetchUserFollowingTags = (user_id: string, options?: options.PaginationOptions) => {
    return this.paginationGenerator<Tag[]>(`${this.url}${this.version}/users/${user_id}/following_tags`, options);
  }

  /**
   * ユーザをフォローしている場合に204を返します。
   * @param user_id ユーザーID
   * @return 空のオブジェクト
   */
  public fetchIfUserFollowing = (user_id: string) => {
    return this.get<void>(`${this.url}${this.version}/users/${user_id}/following`);
  }

  /**
   * ユーザをフォローします
   * @param user_id ユーザーID
   * @return 空のオブジェクト
   */
  public followUser = (user_id: string) => {
    return this.put<void>(`${this.url}${this.version}/users/${user_id}/following`);
  }

  /**
   * ユーザへのフォローを外します。
   * @param user_id ユーザーID
   * @return 空のオブジェクト
   */
  public unfollowUser = (user_id: string) => {
    return this.delete<void>(`${this.url}${this.version}/users/${user_id}/following`);
  }

  /**
   * 投稿の一覧を作成日時の降順で返します。
   * @param options.page ページ番号 (1から100まで)
   * @param options.per_page 1ページあたりに含まれる要素数 (1から100まで)
   * @param options.query 検索クエリ
   * @return 投稿一覧を返す非同期反復可能オブジェクト
   */
  public fetchItems = (options?: options.FetchItemsOptions) => {
    return this.paginationGenerator<Item[]>(`${this.url}${this.version}/items`, options);
  }

  /**
   * 投稿を取得します。
   * @param item_id 投稿ID
   * @return 投稿
   */
  public fetchItem = (item_id: string) => {
    return this.get<Item>(`${this.url}${this.version}/items/${item_id}`);
  }

  /**
   * 新たに投稿を作成します。
   * @param options.body Markdown形式の本文
   * @param options.coediting この投稿が共同更新状態かどうか (Qiita:Teamでのみ有効)
   * @param options.gist 本文中のコードをGistに投稿するかどうか (GitHub連携を有効化している場合のみ有効)
   * @param options.groupUrlName この投稿を公開するグループの url_name (null で全体に公開。Qiita:Teamでのみ有効)
   * @param options.private 限定共有状態かどうかを表すフラグ (Qiita:Teamでは無効)
   * @param options.tag 投稿に付いたタグ一覧
   * @param options.title 投稿のタイトル
   * @param options.tweet Twitterに投稿するかどうか (Twitter連携を有効化している場合のみ有効)
   * @return 投稿
   */
  public createItem = (options: options.CreateItemOptions) => {
    return this.post<Item>(`${this.url}${this.version}/items`, options);
  }

  /**
   * 投稿を更新します。
   * @param item_id 投稿のID
   * @param options.coediting この投稿が共同更新状態かどうか (Qiita:Teamでのみ有効)
   * @param options.groupUrlName この投稿を公開するグループの url_name (null で全体に公開。Qiita:Teamでのみ有効)
   * @param options.private 限定共有状態かどうかを表すフラグ (Qiita:Teamでは無効)
   * @param options.tag 投稿に付いたタグ一覧
   * @param options.title 投稿のタイトル
   * @return 投稿
   */
  public updateItem = (item_id: string, options: options.CreateItemOptions) => {
    return this.patch<Item>(`${this.url}${this.version}/items/${item_id}`, options);
  }

  /**
   * 投稿を削除します。
   * @param item_id 投稿ID
   * @return 空のオブジェクト
   */
  public deleteItem = (item_id: string) => {
    return this.delete<void>(`${this.url}${this.version}/items/${item_id}`);
  }

  /**
   * 投稿に「いいね！」を付けているかどうかを調べます。
   * @param item_id 投稿ID
   * @return 空のオブジェクト
   */
  public fetchIfItemLiked = (item_id: string) => {
    return this.get<void>(`${this.url}${this.version}/items/${item_id}/like`);
  }

  /**
   * 投稿に「いいね！」を付けます。
   * @param item_id 投稿ID
   * @return 空のオブジェクト
   */
  public likeItem = (item_id: string) => {
    return this.put<void>(`${this.url}${this.version}/items/${item_id}/like`);
  }

  /**
   * 投稿への「いいね！」を取り消します。
   * @param item_id 投稿ID
   * @return 空のオブジェクト
   */
  public unlikeItem = (item_id: string) => {
    return this.delete<void>(`${this.url}${this.version}/items/${item_id}/like`);
  }

  /**
   * 投稿をストックしているかどうかを調べます。
   * @param item_id 投稿ID
   * @return 空のオブジェクト
   */
  public fetchIfItemStocked = (item_id: string) => {
    return this.get<void>(`${this.url}${this.version}/items/${item_id}/stock`);
  }

  /**
   * 投稿をストックします。
   * @param item_id 投稿ID
   * @return 空のオブジェクト
   */
  public stockItem = (item_id: string) => {
    return this.put<void>(`${this.url}${this.version}/items/${item_id}/stock`);
  }

  /**
   * 投稿をストックから取り除きます。
   * @param item_id 投稿ID
   * @return 空のオブジェクト
   */
  public unstockItem = (item_id: string) => {
    return this.delete<void>(`${this.url}${this.version}/items/${item_id}/stock`);
  }

  /**
   * 記事に付けられた絵文字リアクション一覧を作成日時の降順で返します。
   * @param item_id 投稿ID
   * @return 絵文字リアクション
   */
  public fetchItemReactions = (item_id: string) => {
    return this.post<Reaction[]>(`${this.url}${this.version}/items/${item_id}/reactions`);
  }

  /**
   * 記事に絵文字リアクションを付けます。
   * @param item_id 投稿ID
   * @param name 絵文字の識別子
   * @return 絵文字リアクション
   */
  public createItemReaction = (item_id: string, name: string) => {
    return this.post<Reaction>(`${this.url}${this.version}/items/${item_id}/reactions`, { name });
  }

  /**
   * 記事から絵文字リアクションを削除します。
   * @param item_id 投稿ID
   * @param name 絵文字の識別子
   * @return 絵文字リアクション
   */
  public deleteItemReaction = (item_id: string, name: string) => {
    return this.delete<Reaction>(`${this.url}${this.version}/items/${item_id}/reactions`, { name });
  }

  /**
   * 投稿につけられた「いいね！」を作成日時の降順で返します。
   * @param item_id 投稿のID
   * @return いいね！エンティティを返します
   */
  public fetchItemLikes = (item_id: string) => {
    return this.get<Like[]>(`${this.url}${this.version}/items/${item_id}/likes`);
  }

  /**
   * 投稿をストックしているユーザ一覧を、ストックした日時の降順で返します。
   * @param options.page ページ番号 (1から100まで)
   * @param options.per_page 1ページあたりに含まれる要素数 (1から100まで)
   * @return ユーザー一覧を返す非同期反復可能オブジェクト
   */
  public fetchItemStockers = (item_id: string, options?: options.PaginationOptions) => {
    return this.paginationGenerator<User[]>(`${this.url}${this.version}/items/${item_id}/stockers`, options);
  }

  /**
   * 投稿に付けられたコメント一覧を投稿日時の降順で取得します。
   * @param item_id 投稿のID
   * @return コメント一覧
   */
  public fetchItemComments = (item_id: string) => {
    return this.get<Comment[]>(`${this.url}${this.version}/items/${item_id}/comments`);
  }

  /**
   * 投稿に対してコメントを投稿します。
   * @param item_id 投稿のID
   * @param body コメントの内容を表すMarkdown形式の文字列
   * @return 投稿したコメント
   */
  public createItemComment = (item_id: string, body: string) => {
    return this.post<Comment[]>(`${this.url}${this.version}/items/${item_id}/comments`, { body });
  }

  /**
   * 投稿にタグを追加します。Qiita:Teamでのみ有効です。
   * @param item_id 投稿のID
   * @param name タグを特定するための一意な名前
   * @param versions (説明なし)
   */
  public addItemTag = (item_id: string, name: string, versions: string[]) => {
    return this.post<Tagging>(`${this.url}${this.version}/items/${item_id}/taggings`, { name, versions });
  }

  /**
   * 投稿から指定されたタグを取り除きます。Qiita:Teamでのみ有効です。
   * @param item_id 投稿のID
   * @param tagId タギングのID
   * @return 空のオブジェクト
   */
  public removeItemTag = (item_id: string, tagId: string) => {
    return this.delete<void>(`${this.url}${this.version}/items/${item_id}/taggings/${tagId}`);
  }

  /**
   * ユーザが所属している全てのチームを、チーム作成日時の降順で返します。
   * @return チーム一覧
   */
  public fetchTeams = () => {
    return this.get<Team[]>(`${this.url}${this.version}/teams`);
  }

  /**
   * 招待中のメンバーの一覧を返します
   * @return 招待
   */
  public fetchTeamInvitations = () => {
    return this.get<TeamInvitation>(`${this.url}${this.version}/team_invitations`);
  }

  /**
   * チームにメンバーを招待します
   * @return 招待
   */
  public createTeamInvitations = () => {
    return this.post<TeamInvitation>(`${this.url}${this.version}/team_invitations`);
  }

  /**
   * 招待を取り消します
   * @return 空のオブジェクト
   */
  public deleteTeamInvitation = () => {
    return this.delete<void>(`${this.url}${this.version}/team_invitations`);
  }

  /**
   * アクセストークンに紐付いたユーザを返します。
   * @return 認証中のユーザ
   */
  public fetchAuthenticatedUser = () => {
    return this.get<AuthenticatedUser>(`${this.url}${this.version}/authenticated_user`);
  }

  /**
   * 認証中のユーザの投稿の一覧を作成日時の降順で返します。
   * @param options.page ページ番号 (1から100まで)
   * @param options.per_page 1ページあたりに含まれる要素数 (1から100まで)
   * @return 投稿一覧を返す非同期反復可能オブジェクト
   */
  public fetchAuthenticatedUserItems = (options?: options.PaginationOptions) => {
    return this.paginationGenerator<Item[]>(`${this.url}${this.version}/authenticated_user/items`, options);
  }

  /**
   * `Qiita.fetchAuthenticatedUser` のシノニムです
   * @return 認証中のユーザ
   */
  public fetchMe = () => this.fetchAuthenticatedUser();

  /**
   * `Qiita.fetchAuthenticatedUserItems` のシノニムです
   * @param options.page ページ番号 (1から100まで)
   * @param options.per_page 1ページあたりに含まれる要素数 (1から100まで)
   * @return 投稿一覧を返す非同期反復可能オブジェクト
   */
  public fetchMyItems = (options?: options.PaginationOptions) => this.fetchAuthenticatedUserItems(options);
}
