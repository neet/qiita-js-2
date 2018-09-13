import { User } from './User';

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
