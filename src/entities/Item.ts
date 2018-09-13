import { Group } from './Group';
import { Tagging } from './Tagging';
import { User } from './User';

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
