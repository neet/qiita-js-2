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
