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
