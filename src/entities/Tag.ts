export interface Tag {
  /** このタグをフォローしているユーザの数 */
  followers_count: number;
  /** このタグに設定されたアイコン画像のURL */
  icon_url?: string;
  /** タグを特定するための一意な名前 */
  id: string;
  /** このタグが付けられた投稿の数 */
  items_count: number;
}
