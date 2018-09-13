import { User } from './User';

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
