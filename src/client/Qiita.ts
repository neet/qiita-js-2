import { Gateway } from './Gateway';

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
   * @param params リクエストのオプション
   */
  public async * paginationGenerator <T extends any[]> (url: string, params?: any) {
    // Qiitaのページネーションインデックスは1から始まります
    let page = 1;

    while (true) {
      const data = await this.get<T>(url, { ...params, page });
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
   * @param clientId 登録されたAPIクライアントを特定するためのID
   * @param clientSecret 登録されたAPIクライアントを認証するための秘密鍵
   * @param code リダイレクト用のURLに付与された、アクセストークンと交換するための文字列
   * @return アクセストークン
   */
  public fetchAccessToken = (clientId: string, clientSecret: string, code: string) => {
    return this.post<AccessToken>(`${this.url}${this.version}/access_tokens`, {
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
  public deleteAccessToken = (token: string) => {
    return this.delete<void>(`${this.url}${this.version}/access_tokens/${token}`);
  }

  /**
   * コメントを取得します。
   * @param commentId コメントのID
   * @return コメントのエンティティを返します
   */
  public fetchComment = (commentId: string) => {
    return this.get<Comment>(`${this.url}${this.version}/comments/${commentId}`);
  }

  /**
   * コメントを更新します。
   * @param commentId コメントのID
   * @param body コメントの内容を表すMarkdown形式の文字列
   */
  public updateComment = (commentId: string, body: string) => {
    return this.patch<Comment>(`${this.url}${this.version}/comments/${commentId}`, { body });
  }

  /**
   * コメントを削除します。
   * @param commentId コメントのID
   * @return 空のオブジェクト
   */
  public deleteComment = (commentId: string) => {
    return this.delete<void>(`${this.url}${this.version}/comments/${commentId}`);
  }

  /**
   * コメントに付けられた絵文字リアクション一覧を作成日時の降順で返します。
   * @param commentId コメントID
   * @return 絵文字リアクション
   */
  public fetchCommentReactions = (commentId: string) => {
    return this.get<Reaction[]>(`${this.url}${this.version}/comments/${commentId}/reactions`);
  }

  /**
   * コメントに絵文字リアクションを付けます。
   * @param commentId コメントID
   * @param name 絵文字の識別子
   * @return 絵文字リアクション
   */
  public createCommentReaction = (commentId: string, name: string) => {
    return this.post<Reaction>(`${this.url}${this.version}/comments/${commentId}/reactions`, { name });
  }

  /**
   * コメントから絵文字リアクションを削除します。
   * @param commentId コメントID
   * @param name 絵文字の識別子
   * @return 絵文字リアクション
   */
  public deleteCommentReaction = (commentId: string, name: string) => {
    return this.delete<Reaction>(`${this.url}${this.version}/comments/${commentId}/reactions`, { name });
  }

  /**
   * タグ一覧を作成日時の降順で返します。
   * @param page ページ番号 (1から100まで)
   * @param perPage 1ページあたりに含まれる要素数 (1から100まで)
   * @param sort 並び順 (countで投稿数順、nameで名前順)
   * @return タグ一覧を返す非同期反復可能オブジェクト
   */
  public fetchTags = (page: string, perPage: string, sort: string) => {
    return this.paginationGenerator<Tag[]>(`${this.url}${this.version}/tags`, {
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
  public fetchTag = (tagId: string) => {
    return this.get<Tag>(`${this.url}${this.version}/tags/${tagId}`);
  }

  /**
   * タグをフォローしているかどうかを調べます。
   * @param tagId タグのID
   * @return タグ
   */
  public checkIfFollowingTag = (tagId: string) => {
    return this.get<Tag>(`${this.url}${this.version}/tags/${tagId}/following`);
  }

  /**
   * タグをフォローします。
   * @param tagId タグのID
   * @return 空のオブジェクト
   */
  public followTag = (tagId: string) => {
    return this.put<Tag>(`${this.url}${this.version}/tags/${tagId}/following`);
  }

  /**
   * タグをフォローします。
   * @param tagId タグのID
   * @return 空のオブジェクト
   */
  public unfollowTag = (tagId: string) => {
    return this.delete<void>(`${this.url}${this.version}/tags/${tagId}/following`);
  }

  /**
   * 指定されたタグが付けられた投稿一覧を、タグを付けた日時の降順で返します。
   * @param tagId タグID
   * @param page ページ番号 (1から100まで)
   * @param perPage 1ページあたりに含まれる要素数 (1から100まで)
   * @return 投稿一覧を返す非同期反復可能オブジェクト
   */
  public fetchTaggedItems = (tagId: string, page: string, perPage: string) => {
    return this.paginationGenerator<Item[]>(`${this.url}${this.version}/tags/${tagId}`, {
      page,
      per_page: perPage,
    });
  }

  /**
   * チーム内のテンプレート一覧を返します。
   * @param page ページ番号 (1から100まで)
   * @param perPage 1ページあたりに含まれる要素数 (1から100まで)
   * @return テンプレート一覧を返す非同期反復可能オブジェクト
   */
  public fetchTemplates = (page: string, perPage: string) => {
    return this.paginationGenerator<Template[]>(`${this.url}${this.version}/templates`, {
      page,
      per_page: perPage,
    });
  }

  /**
   * テンプレートを取得します。
   * @param tempalteId テンプレートID
   * @return テンプレート
   */
  public fetchTempalte = (templateId: string) => {
    return this.get<Template>(`${this.url}${this.version}/templates/${templateId}`);
  }

  /**
   * 新しくテンプレートを作成します。
   * @param body テンプレートの本文
   * @param name テンプレートを判別するための名前
   * @param tags タグ一覧
   * @param title 生成される投稿のタイトルの雛形
   * @return テンプレート
   */
  public createTemplate = (body: string, name: string, tags: Tagging[], title: string) => {
    return this.post<Template>(`${this.url}${this.version}/templates`, { body, name, tags, title });
  }

  /**
   * テンプレートを更新します。
   * @param body テンプレートの本文
   * @param name テンプレートを判別するための名前
   * @param tags タグ一覧
   * @param title 生成される投稿のタイトルの雛形
   * @return テンプレート
   */
  public updateTempalte = (body: string, name: string, tags: Tagging[], title: string) => {
    return this.patch<Template>(`${this.url}${this.version}/templates`, { body, name, tags, title });
  }

  /**
   * テンプレートを削除します。
   * @param templateId テンプレートID
   * @return 空のオブジェクト
   */
  public deleteTemplate = (templateId: string) => {
    return this.delete<void>(`${this.url}${this.version}/templates/${templateId}`);
  }

  /**
   * チーム内に存在するプロジェクト一覧をプロジェクト作成日時の降順で返します。
   * @param page ページ番号 (1から100まで)
   * @param perPage 1ページあたりに含まれる要素数 (1から100まで)
   * @return プロジェクト一覧
   */
  public fetchProjects = (page: string, perPage: string) => {
    return this.paginationGenerator<Project[]>(`${this.url}${this.version}/projects`, {
      page,
      per_page: perPage,
    });
  }

  /**
   * プロジェクトを返します。
   * @param projectId プロジェクトID
   * @return プロジェクト
   */
  public fetchProject = (projectId: string) => {
    return this.get<Project>(`${this.url}${this.version}/projects/${projectId}`);
  }

  /**
   * プロジェクトを新たに作成します。
   * @param archived このプロジェクトが進行中かどうか
   * @param body Markdown形式の本文
   * @param name プロジェクト名
   * @param tags 投稿に付いたタグ一覧
   * @return プロジェクト
   */
  public createProject = (archived: boolean, body: string, name: string, tags: Tagging[]) => {
    return this.post<Project>(`${this.url}${this.version}/projects`, { archived, body, name, tags });
  }

  /**
   * プロジェクトを更新します。
   * @param archived このプロジェクトが進行中かどうか
   * @param body Markdown形式の本文
   * @param name プロジェクト名
   * @param tags 投稿に付いたタグ一覧
   * @return プロジェクト
   */
  public updateProject = (archived: boolean, body: string, name: string, tags: Tagging[]) => {
    return this.patch<Project>(`${this.url}${this.version}/projects`, { archived, body, name, tags });
  }

  /**
   * プロジェクトを削除します。
   * @param projectId プロジェクトID
   * @return 空のオブジェクト
   */
  public deleteProject = (projectId: string) => {
    return this.delete<void>(`${this.url}${this.version}/projects/${projectId}`);
  }

  /**
   * プロジェクトに付けられたコメント一覧を投稿日時の降順で取得します。
   * @param projectId プロジェクトのID
   * @return コメント一覧
   */
  public fetchProjectComments = (projectId: string) => {
    return this.get<Comment[]>(`${this.url}${this.version}/projects/${projectId}/comments`);
  }

  /**
   * プロジェクトに対してコメントを投稿します。
   * @param projectId 投稿のID
   * @param body コメントの内容を表すMarkdown形式の文字列
   * @return 投稿したコメント
   */
  public createProjectComment = (projectId: string, body: string) => {
    return this.post<Comment[]>(`${this.url}${this.version}/projects/${projectId}/comments`, { body });
  }

  /**
   * プロジェクトに付けられた絵文字リアクション一覧を作成日時の降順で返します。
   * @param projectId プロジェクトID
   * @return 絵文字リアクション一覧
   */
  public fetchProjectReactions = (projectId: string) => {
    return this.get<Reaction[]>(`${this.url}${this.version}/projects/${projectId}/reactions`);
  }

  /**
   * プロジェクトに絵文字リアクションを付けます。
   * @param projectId プロジェクトID
   * @param name 絵文字の識別子
   * @return 絵文字リアクション
   */
  public createProjectReaction = (projectId: string, name: string) => {
    return this.post<Reaction>(`${this.url}${this.version}/projects/${projectId}/reactions`, { name });
  }

  /**
   * プロジェクトから絵文字リアクションを削除します。
   * @param projectId プロジェクトID
   * @param name 絵文字の識別子
   * @return 絵文字リアクション
   */
  public deleteProjectReaction = (projectId: string, name: string) => {
    return this.delete<Reaction>(`${this.url}${this.version}/projects/${projectId}/reactions`, { name });
  }

  /**
   * 全てのユーザの一覧を作成日時の降順で取得します。
   * @param page ページ番号 (1から100まで)
   * @param perPage 1ページあたりに含まれる要素数 (1から100まで)
   * @return ユーザー一覧を返す非同期反復可能オブジェクト
   */
  public fetchUsers = (page: string, perPage: string) => {
    return this.paginationGenerator<User[]>(`${this.url}${this.version}/users`, {
      page,
      per_page: perPage,
    });
  }

  /**
   * ユーザを取得します。
   * @param userId ユーザーID
   * @return ユーザー
   */
  public fetchUser = (userId: string) => {
    return this.get<User>(`${this.url}${this.version}/users/${userId}`);
  }

  /**
   * ユーザがフォローしているユーザ一覧を取得します。
   * @param userId ユーザーID
   * @param page ページ番号 (1から100まで)
   * @param perPage 1ページあたりに含まれる要素数 (1から100まで)
   * @return ユーザー一覧を返す非同期反復可能オブジェクト
   */
  public fetchUserFollowees = (userId: string, page: string, perPage: string) => {
    return this.paginationGenerator<User[]>(`${this.url}${this.version}/users/${userId}/followees`, {
      page,
      per_page: perPage,
    });
  }

  /**
   * ユーザをフォローしているユーザ一覧を取得します。
   * @param userId ユーザーID
   * @param page ページ番号 (1から100まで)
   * @param perPage 1ページあたりに含まれる要素数 (1から100まで)
   * @return ユーザー一覧を返す非同期反復可能オブジェクト
   */
  public fetchUserFollowers = (userId: string, page: string, perPage: string) => {
    return this.paginationGenerator<User[]>(`${this.url}${this.version}/users/${userId}/followers`, {
      page,
      per_page: perPage,
    });
  }

  /**
   * 指定されたユーザの投稿一覧を、作成日時の降順で返します。
   * @param userId ユーザID
   * @param page ページ番号 (1から100まで)
   * @param perPage 1ページあたりに含まれる要素数 (1から100まで)
   * @return 投稿一覧を返す非同期反復可能オブジェクト
   */
  public fetchUserItems = (userId: string, page: string, perPage: string) => {
    return this.paginationGenerator<Item[]>(`${this.url}${this.version}/users/${userId}/items`, {
      page,
      per_page: perPage,
    });
  }

  /**
   * 指定されたユーザがストックした投稿一覧を、ストックした日時の降順で返します。
   * @param userId ユーザID
   * @param page ページ番号 (1から100まで)
   * @param perPage 1ページあたりに含まれる要素数 (1から100まで)
   * @return 投稿一覧を返す非同期反復可能オブジェクト
   */
  public fetchUserStocks = (userId: string, page: string, perPage: string) => {
    return this.paginationGenerator<Item[]>(`${this.url}${this.version}/users/${userId}/items`, {
      page,
      per_page: perPage,
    });
  }

  /**
   * ユーザがフォローしているタグ一覧をフォロー日時の降順で返します。
   * @param userId ユーザーID
   * @param page ページ番号 (1から100まで)
   * @param perPage 1ページあたりに含まれる要素数 (1から100まで)
   * @return タグ一覧を返す非同期反復可能オブジェクト
   */
  public fetchUserFollowingTags = (userId: string, page: string, perPage: string) => {
    return this.paginationGenerator<Tag[]>(`${this.url}${this.version}/users/${userId}/following_tags`, {
      page,
      per_page: perPage,
    });
  }

  /**
   * ユーザをフォローしている場合に204を返します。
   * @param userId ユーザーID
   * @return 空のオブジェクト
   */
  public checkIfFollowingUser = (userId: string) => {
    return this.get<void>(`${this.url}${this.version}/users/${userId}/following`);
  }

  /**
   * ユーザをフォローします
   * @param userId ユーザーID
   * @return 空のオブジェクト
   */
  public followUser = (userId: string) => {
    return this.put<void>(`${this.url}${this.version}/users/${userId}/following`);
  }

  /**
   * ユーザへのフォローを外します。
   * @param userId ユーザーID
   * @return 空のオブジェクト
   */
  public unfollowUser = (userId: string) => {
    return this.delete<void>(`${this.url}${this.version}/users/${userId}/following`);
  }

  /**
   * 投稿の一覧を作成日時の降順で返します。
   * @param page ページ番号 (1から100まで)
   * @param perPage 1ページあたりに含まれる要素数 (1から100まで)
   * @param query 検索クエリ
   * @return 投稿一覧を返す非同期反復可能オブジェクト
   */
  public fetchItems = (page: string, perPage: string, query: string) => {
    return this.paginationGenerator<Item[]>(`${this.url}${this.version}/items`, {
      page,
      per_page: perPage,
      query,
    });
  }

  /**
   * 投稿を取得します。
   * @param itemId 投稿ID
   * @return 投稿
   */
  public fetchItem = (itemId: string) => {
    return this.get<Item>(`${this.url}${this.version}/items/${itemId}`);
  }

  /**
   * 新たに投稿を作成します。
   * @param params.body Markdown形式の本文
   * @param params.coediting この投稿が共同更新状態かどうか (Qiita:Teamでのみ有効)
   * @param params.gist 本文中のコードをGistに投稿するかどうか (GitHub連携を有効化している場合のみ有効)
   * @param params.groupUrlName この投稿を公開するグループの url_name (null で全体に公開。Qiita:Teamでのみ有効)
   * @param params.private 限定共有状態かどうかを表すフラグ (Qiita:Teamでは無効)
   * @param params.tag 投稿に付いたタグ一覧
   * @param params.title 投稿のタイトル
   * @param params.tweet Twitterに投稿するかどうか (Twitter連携を有効化している場合のみ有効)
   * @return 投稿
   */
  public createItem = (params: {
    body: string;
    coediting: boolean;
    gist: boolean;
    groupUrlName?: string|null;
    private: boolean;
    tags: Tagging;
    title: string;
    tweet: boolean;
  }) => {
    return this.post<Item>(`${this.url}${this.version}/items`, {
      body: params.body,
      coediting: params.coediting,
      gist: params.gist,
      group_url_name: params.groupUrlName,
      private: params.private,
      tags: params.tags,
      title: params.title,
      tweet: params.tweet,
    });
  }

  /**
   * 投稿を更新します。
   * @param itemId 投稿のID
   * @param params.coediting この投稿が共同更新状態かどうか (Qiita:Teamでのみ有効)
   * @param params.groupUrlName この投稿を公開するグループの url_name (null で全体に公開。Qiita:Teamでのみ有効)
   * @param params.private 限定共有状態かどうかを表すフラグ (Qiita:Teamでは無効)
   * @param params.tag 投稿に付いたタグ一覧
   * @param params.title 投稿のタイトル
   * @return 投稿
   */
  public updateItem = (itemId: string, params: {
    body: string;
    coediting: boolean;
    groupUrlName?: string|null;
    private: boolean;
    tags: Tagging;
    title: string;
  }) => {
    return this.patch<Item>(`${this.url}${this.version}/items/${itemId}`, {
      body: params.body,
      coediting: params.coediting,
      group_url_name: params.groupUrlName,
      private: params.private,
      tags: params.tags,
      title: params.title,
    });
  }

  /**
   * 投稿を削除します。
   * @param itemId 投稿ID
   * @return 空のオブジェクト
   */
  public deleteItem = (itemId: string) => {
    return this.delete<void>(`${this.url}${this.version}/items/${itemId}`);
  }

  /**
   * 投稿に「いいね！」を付けているかどうかを調べます。
   * @param itemId 投稿ID
   * @return 空のオブジェクト
   */
  public checkIfLikedItem = (itemId: string) => {
    return this.get<void>(`${this.url}${this.version}/items/${itemId}/like`);
  }

  /**
   * 投稿に「いいね！」を付けます。
   * @param itemId 投稿ID
   * @return 空のオブジェクト
   */
  public likeItem = (itemId: string) => {
    return this.put<void>(`${this.url}${this.version}/items/${itemId}/like`);
  }

  /**
   * 投稿への「いいね！」を取り消します。
   * @param itemId 投稿ID
   * @return 空のオブジェクト
   */
  public unlikeItem = (itemId: string) => {
    return this.delete<void>(`${this.url}${this.version}/items/${itemId}/like`);
  }

  /**
   * 投稿をストックしているかどうかを調べます。
   * @param itemId 投稿ID
   * @return 空のオブジェクト
   */
  public checkIfStockedItem = (itemId: string) => {
    return this.get<void>(`${this.url}${this.version}/items/${itemId}/stock`);
  }

  /**
   * 投稿をストックします。
   * @param itemId 投稿ID
   * @return 空のオブジェクト
   */
  public stockItem = (itemId: string) => {
    return this.put<void>(`${this.url}${this.version}/items/${itemId}/stock`);
  }

  /**
   * 投稿をストックから取り除きます。
   * @param itemId 投稿ID
   * @return 空のオブジェクト
   */
  public unstockItem = (itemId: string) => {
    return this.delete<void>(`${this.url}${this.version}/items/${itemId}/stock`);
  }

  /**
   * 記事に付けられた絵文字リアクション一覧を作成日時の降順で返します。
   * @param itemId 投稿ID
   * @return 絵文字リアクション
   */
  public fetchItemReactions = (itemId: string) => {
    return this.post<Reaction[]>(`${this.url}${this.version}/items/${itemId}/reactions`);
  }

  /**
   * 記事に絵文字リアクションを付けます。
   * @param itemId 投稿ID
   * @param name 絵文字の識別子
   * @return 絵文字リアクション
   */
  public createItemReaction = (itemId: string, name: string) => {
    return this.post<Reaction>(`${this.url}${this.version}/items/${itemId}/reactions`, { name });
  }

  /**
   * 記事から絵文字リアクションを削除します。
   * @param itemId 投稿ID
   * @param name 絵文字の識別子
   * @return 絵文字リアクション
   */
  public deleteItemReaction = (itemId: string, name: string) => {
    return this.delete<Reaction>(`${this.url}${this.version}/items/${itemId}/reactions`, { name });
  }

  /**
   * 投稿につけられた「いいね！」を作成日時の降順で返します。
   * @param itemId 投稿のID
   * @return いいね！エンティティを返します
   */
  public fetchItemLikes = (itemId: string) => {
    return this.get<Like[]>(`${this.url}${this.version}/items/${itemId}/likes`);
  }

  /**
   * 投稿をストックしているユーザ一覧を、ストックした日時の降順で返します。
   * @param page ページ番号 (1から100まで)
   * @param perPage 1ページあたりに含まれる要素数 (1から100まで)
   * @return ユーザー一覧を返す非同期反復可能オブジェクト
   */
  public fetchItemStockers = (itemId: string, page: string, perPage: string) => {
    return this.paginationGenerator<User[]>(`${this.url}${this.version}/items/${itemId}/stockers`, {
      page,
      per_page: perPage,
    });
  }

  /**
   * 投稿に付けられたコメント一覧を投稿日時の降順で取得します。
   * @param itemId 投稿のID
   * @return コメント一覧
   */
  public fetchItemComments = (itemId: string) => {
    return this.get<Comment[]>(`${this.url}${this.version}/items/${itemId}/comments`);
  }

  /**
   * 投稿に対してコメントを投稿します。
   * @param itemId 投稿のID
   * @param body コメントの内容を表すMarkdown形式の文字列
   * @return 投稿したコメント
   */
  public createItemComment = (itemId: string, body: string) => {
    return this.post<Comment[]>(`${this.url}${this.version}/items/${itemId}/comments`, { body });
  }

  /**
   * 投稿にタグを追加します。Qiita:Teamでのみ有効です。
   * @param itemId 投稿のID
   * @param name タグを特定するための一意な名前
   * @param versions (説明なし)
   */
  public addItemTag = (itemId: string, name: string, versions: string[]) => {
    return this.post<Tagging>(`${this.url}${this.version}/items/${itemId}/taggings`, { name, versions });
  }

  /**
   * 投稿から指定されたタグを取り除きます。Qiita:Teamでのみ有効です。
   * @param itemId 投稿のID
   * @param tagId タギングのID
   * @return 空のオブジェクト
   */
  public removeItemTag = (itemId: string, tagId: string) => {
    return this.delete<void>(`${this.url}${this.version}/items/${itemId}/taggings/${tagId}`);
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
  public fetchMe = () => {
    return this.get<AuthenticatedUser>(`${this.url}${this.version}/authenticated_user`);
  }

  /**
   * 認証中のユーザの投稿の一覧を作成日時の降順で返します。
   * @param page ページ番号 (1から100まで)
   * @param perPage 1ページあたりに含まれる要素数 (1から100まで)
   * @return 投稿一覧を返す非同期反復可能オブジェクト
   */
  public fetchMyItems = (page: string, perPage: string) => {
    return this.paginationGenerator<Item[]>(`${this.url}${this.version}/authenticated_user/items`, {
      page,
      per_page: perPage,
    });
  }
}
