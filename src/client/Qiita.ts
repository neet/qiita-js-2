import * as querystring from 'querystring';
import { getNextUrl } from '../client/linkHeader';
import { Gateway } from './Gateway';
import * as options from './options';

import { AccessToken } from '../entities/AccessToken';
import { AuthenticatedUser } from '../entities/AuthenticatedUser';
import { Comment } from '../entities/Comment';
import { Item } from '../entities/Item';
import { Like } from '../entities/Like';
import { Project } from '../entities/Project';
import { Reaction } from '../entities/Reaction';
import { SearchTagResult, Tag } from '../entities/Tag';
import { Tagging } from '../entities/Tagging';
import { Team } from '../entities/Team';
import { TeamInvitation } from '../entities/TeamInvitation';
import { Template } from '../entities/Template';
import { User } from '../entities/User';

export class Qiita extends Gateway {

  /**
   * Qiita APIのページネーションをラップする非同期反復可能オブジェクトを返します
   * nextの引数に文字列 'reset' を渡すと最初のインデックスに戻ることができます。
   * @param initialUrl 最初にリクエストするURL
   * @param params リクエストのオプション
   */
  protected async * paginationGenerator <T extends any[]> (url: string, params?: options.PaginationOptions) {
    const initialUrl = url + (params ? '?' + querystring.stringify(params) : '');
    let next: string|null = initialUrl;

    while (next) {
      const response = await this.get<T>(next);
      const result: T | 'reset' = yield response.data;

      if (result === 'reset') {
        next = initialUrl;
      } else {
        next = getNextUrl(response.headers);
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
  public fetchAccessToken = async (client_id: string, client_secret: string, code: string) => {
    return (await this.post<AccessToken>(`${this.url}${this.version}/access_tokens`, {
      client_id,
      client_secret,
      code,
    })).data;
  }

  /**
   * 指定されたアクセストークンを失効させ、それ以降利用できないようにします。
   * @param token アクセストークン
   * @return 空のオブジェクト
   */
  public deleteAccessToken = async (token: string) => {
    return (await this.delete<void>(`${this.url}${this.version}/access_tokens/${token}`)).data;
  }

  /**
   * コメントを取得します。
   * @param comment_id コメントのID
   * @return コメントのエンティティを返します
   */
  public fetchComment = async (comment_id: string) => {
    return (await this.get<Comment>(`${this.url}${this.version}/comments/${comment_id}`)).data;
  }

  /**
   * コメントを更新します。
   * @param comment_id コメントのID
   * @param body コメントの内容を表すMarkdown形式の文字列
   */
  public updateComment = async (comment_id: string, body: string) => {
    return (await this.patch<Comment>(`${this.url}${this.version}/comments/${comment_id}`, { body })).data;
  }

  /**
   * コメントを削除します。
   * @param comment_id コメントのID
   * @return 空のオブジェクト
   */
  public deleteComment = async (comment_id: string) => {
    return (await this.delete<void>(`${this.url}${this.version}/comments/${comment_id}`)).data;
  }

  /**
   * コメントに付けられた絵文字リアクション一覧を作成日時の降順で返します。
   * @param comment_id コメントID
   * @return 絵文字リアクション
   */
  public fetchCommentReactions = async (comment_id: string) => {
    return (await this.get<Reaction[]>(`${this.url}${this.version}/comments/${comment_id}/reactions`)).data;
  }

  /**
   * コメントに絵文字リアクションを付けます。
   * @param comment_id コメントID
   * @param name 絵文字の識別子
   * @return 絵文字リアクション
   */
  public createCommentReaction = async (comment_id: string, name: string) => {
    return (await this.post<Reaction>(`${this.url}${this.version}/comments/${comment_id}/reactions`, { name })).data;
  }

  /**
   * コメントから絵文字リアクションを削除します。
   * @param comment_id コメントID
   * @param name 絵文字の識別子
   * @return 絵文字リアクション
   */
  public deleteCommentReaction = async (comment_id: string, name: string) => {
    return (await this.delete<Reaction>(`${this.url}${this.version}/comments/${comment_id}/reactions`, { name })).data;
  }

  /**
   * タグ一覧を作成日時の降順で返します。
   * @param options.page ページ番号 (1から100まで)
   * @param options.perPage 1ページあたりに含まれる要素数 (1から100まで)
   * @param options.sort 並び順 (countで投稿数順、nameで名前順)
   * @return タグ一覧を返す非同期反復可能オブジェクト
   */
  public fetchTags = async (options?: options.FetchTagsOptions) => {
    return this.paginationGenerator<Tag[]>(`${this.url}${this.version}/tags`, options);
  }

  /**
   * タグを取得します。
   * @param tagId タグのID
   * @return タグ
   */
  public fetchTag = async (tag_id: string) => {
    return (await this.get<Tag>(`${this.url}${this.version}/tags/${tag_id}`)).data;
  }

  /**
   * タグをフォローしているかどうかを調べます。
   * @param tag_id タグのID
   * @return タグ
   */
  public fetchTagFollowing = async (tag_id: string) => {
    return (await this.get<Tag>(`${this.url}${this.version}/tags/${tag_id}/following`)).data;
  }

  /**
   * タグをフォローします。
   * @param tag_id タグのID
   * @return 空のオブジェクト
   */
  public followTag = async (tag_id: string) => {
    return (await this.put<Tag>(`${this.url}${this.version}/tags/${tag_id}/following`)).data;
  }

  /**
   * タグをフォローします。
   * @param tag_id タグのID
   * @return 空のオブジェクト
   */
  public unfollowTag = async (tag_id: string) => {
    return (await this.delete<void>(`${this.url}${this.version}/tags/${tag_id}/following`)).data;
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
  public fetchTempalte = async (template_id: string) => {
    return (await this.get<Template>(`${this.url}${this.version}/templates/${template_id}`)).data;
  }

  /**
   * [実験的] タグを検索します
   * @param q 検索クエリ文字列
   * @return タグの配列
   */
  public searchTags = async (q: string) => {
    return (await this.get<SearchTagResult[]>(`${this.url}/api/tags`, { q })).data;
  }

  /**
   * 新しくテンプレートを作成します。
   * @param options.body テンプレートの本文
   * @param options.name テンプレートを判別するための名前
   * @param options.tags タグ一覧
   * @param options.title 生成される投稿のタイトルの雛形
   * @return テンプレート
   */
  public createTemplate = async (options: options.CreateTemplateOptions) => {
    return (await this.post<Template>(`${this.url}${this.version}/templates`, options)).data;
  }

  /**
   * テンプレートを更新します。
   * @param options.body テンプレートの本文
   * @param options.name テンプレートを判別するための名前
   * @param options.tags タグ一覧
   * @param options.title 生成される投稿のタイトルの雛形
   * @return テンプレート
   */
  public updateTempalte = async (options?: options.UpdateTemplateOptions) => {
    return (await this.patch<Template>(`${this.url}${this.version}/templates`, options)).data;
  }

  /**
   * テンプレートを削除します。
   * @param template_id テンプレートID
   * @return 空のオブジェクト
   */
  public deleteTemplate = async (template_id: string) => {
    return (await this.delete<void>(`${this.url}${this.version}/templates/${template_id}`)).data;
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
  public fetchProject = async (project_id: string) => {
    return (await this.get<Project>(`${this.url}${this.version}/projects/${project_id}`)).data;
  }

  /**
   * プロジェクトを新たに作成します。
   * @param options.archived このプロジェクトが進行中かどうか
   * @param options.body Markdown形式の本文
   * @param options.name プロジェクト名
   * @param options.tags 投稿に付いたタグ一覧
   * @return プロジェクト
   */
  public createProject = async (options: options.CreateProjectOptions) => {
    return (await this.post<Project>(`${this.url}${this.version}/projects`, options)).data;
  }

  /**
   * プロジェクトを更新します。
   * @param options.archived このプロジェクトが進行中かどうか
   * @param options.body Markdown形式の本文
   * @param options.name プロジェクト名
   * @param options.tags 投稿に付いたタグ一覧
   * @return プロジェクト
   */
  public updateProject = async (options?: options.UpdateProjectOptions) => {
    return (await this.patch<Project>(`${this.url}${this.version}/projects`, options)).data;
  }

  /**
   * プロジェクトを削除します。
   * @param project_id プロジェクトID
   * @return 空のオブジェクト
   */
  public deleteProject = async (project_id: string) => {
    return (await this.delete<void>(`${this.url}${this.version}/projects/${project_id}`)).data;
  }

  /**
   * プロジェクトに付けられたコメント一覧を投稿日時の降順で取得します。
   * @param project_id プロジェクトのID
   * @return コメント一覧
   */
  public fetchProjectComments = async (project_id: string) => {
    return (await this.get<Comment[]>(`${this.url}${this.version}/projects/${project_id}/comments`)).data;
  }

  /**
   * プロジェクトに対してコメントを投稿します。
   * @param project_id 投稿のID
   * @param body コメントの内容を表すMarkdown形式の文字列
   * @return 投稿したコメント
   */
  public createProjectComment = async (project_id: string, body: string) => {
    return (await this.post<Comment[]>(`${this.url}${this.version}/projects/${project_id}/comments`, { body })).data;
  }

  /**
   * プロジェクトに付けられた絵文字リアクション一覧を作成日時の降順で返します。
   * @param project_id プロジェクトID
   * @return 絵文字リアクション一覧
   */
  public fetchProjectReactions = async (project_id: string) => {
    return (await this.get<Reaction[]>(`${this.url}${this.version}/projects/${project_id}/reactions`)).data;
  }

  /**
   * プロジェクトに絵文字リアクションを付けます。
   * @param project_id プロジェクトID
   * @param name 絵文字の識別子
   * @return 絵文字リアクション
   */
  public createProjectReaction = async (project_id: string, name: string) => {
    return (await this.post<Reaction>(`${this.url}${this.version}/projects/${project_id}/reactions`, { name })).data;
  }

  /**
   * プロジェクトから絵文字リアクションを削除します。
   * @param project_id プロジェクトID
   * @param name 絵文字の識別子
   * @return 絵文字リアクション
   */
  public deleteProjectReaction = async (project_id: string, name: string) => {
    return (await this.delete<Reaction>(`${this.url}${this.version}/projects/${project_id}/reactions`, { name })).data;
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
  public fetchUser = async (user_id: string) => {
    return (await this.get<User>(`${this.url}${this.version}/users/${user_id}`)).data;
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
  public fetchIfUserFollowing = async (user_id: string) => {
    return (await this.get<void>(`${this.url}${this.version}/users/${user_id}/following`)).data;
  }

  /**
   * ユーザをフォローします
   * @param user_id ユーザーID
   * @return 空のオブジェクト
   */
  public followUser = async (user_id: string) => {
    return (await this.put<void>(`${this.url}${this.version}/users/${user_id}/following`)).data;
  }

  /**
   * ユーザへのフォローを外します。
   * @param user_id ユーザーID
   * @return 空のオブジェクト
   */
  public unfollowUser = async (user_id: string) => {
    return (await this.delete<void>(`${this.url}${this.version}/users/${user_id}/following`)).data;
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
  public fetchItem = async (item_id: string) => {
    return (await this.get<Item>(`${this.url}${this.version}/items/${item_id}`)).data;
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
  public createItem = async (options: options.CreateItemOptions) => {
    return (await this.post<Item>(`${this.url}${this.version}/items`, options)).data;
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
  public updateItem = async (item_id: string, options: options.UpdateItemOptions) => {
    return (await this.patch<Item>(`${this.url}${this.version}/items/${item_id}`, options)).data;
  }

  /**
   * 投稿を削除します。
   * @param item_id 投稿ID
   * @return 空のオブジェクト
   */
  public deleteItem = async (item_id: string) => {
    return (await this.delete<void>(`${this.url}${this.version}/items/${item_id}`)).data;
  }

  /**
   * 投稿に「いいね！」を付けているかどうかを調べます。
   * @param item_id 投稿ID
   * @return 空のオブジェクト
   */
  public fetchIfItemLiked = async (item_id: string) => {
    return (await this.get<void>(`${this.url}${this.version}/items/${item_id}/like`)).data;
  }

  /**
   * 投稿に「いいね！」を付けます。
   * @param item_id 投稿ID
   * @return 空のオブジェクト
   */
  public likeItem = async (item_id: string) => {
    return (await this.put<void>(`${this.url}${this.version}/items/${item_id}/like`)).data;
  }

  /**
   * 投稿への「いいね！」を取り消します。
   * @param item_id 投稿ID
   * @return 空のオブジェクト
   */
  public unlikeItem = async (item_id: string) => {
    return (await this.delete<void>(`${this.url}${this.version}/items/${item_id}/like`)).data;
  }

  /**
   * 投稿をストックしているかどうかを調べます。
   * @param item_id 投稿ID
   * @return 空のオブジェクト
   */
  public fetchIfItemStocked = async (item_id: string) => {
    return (await this.get<void>(`${this.url}${this.version}/items/${item_id}/stock`)).data;
  }

  /**
   * 投稿をストックします。
   * @param item_id 投稿ID
   * @return 空のオブジェクト
   */
  public stockItem = async (item_id: string) => {
    return (await this.put<void>(`${this.url}${this.version}/items/${item_id}/stock`)).data;
  }

  /**
   * 投稿をストックから取り除きます。
   * @param item_id 投稿ID
   * @return 空のオブジェクト
   */
  public unstockItem = async (item_id: string) => {
    return (await this.delete<void>(`${this.url}${this.version}/items/${item_id}/stock`)).data;
  }

  /**
   * 記事に付けられた絵文字リアクション一覧を作成日時の降順で返します。
   * @param item_id 投稿ID
   * @return 絵文字リアクション
   */
  public fetchItemReactions = async (item_id: string) => {
    return (await this.post<Reaction[]>(`${this.url}${this.version}/items/${item_id}/reactions`)).data;
  }

  /**
   * 記事に絵文字リアクションを付けます。
   * @param item_id 投稿ID
   * @param name 絵文字の識別子
   * @return 絵文字リアクション
   */
  public createItemReaction = async (item_id: string, name: string) => {
    return (await this.post<Reaction>(`${this.url}${this.version}/items/${item_id}/reactions`, { name })).data;
  }

  /**
   * 記事から絵文字リアクションを削除します。
   * @param item_id 投稿ID
   * @param name 絵文字の識別子
   * @return 絵文字リアクション
   */
  public deleteItemReaction = async (item_id: string, name: string) => {
    return (await this.delete<Reaction>(`${this.url}${this.version}/items/${item_id}/reactions`, { name })).data;
  }

  /**
   * 投稿につけられた「いいね！」を作成日時の降順で返します。
   * @param item_id 投稿のID
   * @return いいね！エンティティを返します
   */
  public fetchItemLikes = async (item_id: string) => {
    return (await this.get<Like[]>(`${this.url}${this.version}/items/${item_id}/likes`)).data;
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
  public fetchItemComments = async (item_id: string) => {
    return (await this.get<Comment[]>(`${this.url}${this.version}/items/${item_id}/comments`)).data;
  }

  /**
   * 投稿に対してコメントを投稿します。
   * @param item_id 投稿のID
   * @param body コメントの内容を表すMarkdown形式の文字列
   * @return 投稿したコメント
   */
  public createItemComment = async (item_id: string, body: string) => {
    return (await this.post<Comment[]>(`${this.url}${this.version}/items/${item_id}/comments`, { body })).data;
  }

  /**
   * 投稿にタグを追加します。Qiita:Teamでのみ有効です。
   * @param item_id 投稿のID
   * @param name タグを特定するための一意な名前
   * @param versions (説明なし)
   */
  public addItemTag = async (item_id: string, name: string, versions: string[]) => {
    return (await this.post<Tagging>(`${this.url}${this.version}/items/${item_id}/taggings`, { name, versions })).data;
  }

  /**
   * 投稿から指定されたタグを取り除きます。Qiita:Teamでのみ有効です。
   * @param item_id 投稿のID
   * @param tagId タギングのID
   * @return 空のオブジェクト
   */
  public removeItemTag = async (item_id: string, tagId: string) => {
    return (await this.delete<void>(`${this.url}${this.version}/items/${item_id}/taggings/${tagId}`)).data;
  }

  /**
   * ユーザが所属している全てのチームを、チーム作成日時の降順で返します。
   * @return チーム一覧
   */
  public fetchTeams = async () => {
    return (await this.get<Team[]>(`${this.url}${this.version}/teams`)).data;
  }

  /**
   * 招待中のメンバーの一覧を返します
   * @return 招待
   */
  public fetchTeamInvitations = async () => {
    return (await this.get<TeamInvitation>(`${this.url}${this.version}/team_invitations`)).data;
  }

  /**
   * チームにメンバーを招待します
   * @return 招待
   */
  public createTeamInvitations = async () => {
    return (await this.post<TeamInvitation>(`${this.url}${this.version}/team_invitations`)).data;
  }

  /**
   * 招待を取り消します
   * @return 空のオブジェクト
   */
  public deleteTeamInvitation = async () => {
    return (await this.delete<void>(`${this.url}${this.version}/team_invitations`)).data;
  }

  /**
   * アクセストークンに紐付いたユーザを返します。
   * @return 認証中のユーザ
   */
  public fetchAuthenticatedUser = async () => {
    return (await this.get<AuthenticatedUser>(`${this.url}${this.version}/authenticated_user`)).data;
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
