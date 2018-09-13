import { User } from './User';

export interface AuthenticatedUser extends User {
  /** 1ヶ月あたりにQiitaにアップロードできる画像の総容量 */
  image_monthly_upload_limit: number;
  /** その月にQiitaにアップロードできる画像の残りの容量 */
  image_monthly_upload_remaining: number;
  /** Qiita:Team専用モードに設定されているかどうか */
  team_only: boolean;
}
