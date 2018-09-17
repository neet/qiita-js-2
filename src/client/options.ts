import { Tagging } from '../entities/Tagging';

export interface PaginationOptions {
  /** ページ番号 (1から100まで) */
  page?: string;
  /** 1ページあたりに含まれる要素数 (1から100まで) */
  per_page?: string;
}

export interface FetchTagsOptions extends PaginationOptions {
  /** 並び順 (countで投稿数順、nameで名前順) */
  sort?: 'count'|'name';
  /** [ドキュメント記載無し] 検索クエリ */
  q?: string;
}

export interface CreateTemplateOptions {
  /** テンプレートの本文 */
  body: string;
  /** テンプレートを判別するための名前 */
  name: string;
  /** タグ一覧 */
  tags: Tagging[];
  /** 生成される投稿のタイトルの雛形 */
  title: string;
}

export type UpdateTemplateOptions = Partial<CreateTemplateOptions>;

export interface CreateProjectOptions {
  /** このプロジェクトが進行中かどうか */
  archived: boolean;
  /** Markdown形式の本文 */
  body: string;
  /** プロジェクト名 */
  name: string;
  /** 投稿に付いたタグ一覧 */
  tags: Tagging[];
}

export type UpdateProjectOptions = Partial<CreateProjectOptions>;

export interface FetchItemsOptions extends PaginationOptions {
  /** 検索クエリ */
  query?: string;
}

export interface CreateItemOptions {
  /** Markdown形式の本文 */
  body: string;
  /** この投稿が共同更新状態かどうか (Qiita:Teamでのみ有効) */
  coediting?: boolean;
  /** 本文中のコードをGistに投稿するかどうか (GitHub連携を有効化している場合のみ有効) */
  gist?: boolean;
  /** この投稿を公開するグループの url_name (null で全体に公開。Qiita:Teamでのみ有効) */
  group_url_name?: string|null;
  /** 限定共有状態かどうかを表すフラグ (Qiita:Teamでは無効) */
  private?: boolean;
  /** 投稿に付いたタグ一覧 */
  tags: Tagging;
  /** 投稿のタイトル */
  title: string;
  /** Twitterに投稿するかどうか (Twitter連携を有効化している場合のみ有効) */
  tweet?: boolean;
}

export type UpdateItemOptions = Partial<CreateItemOptions>;
