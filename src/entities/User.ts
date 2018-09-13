export interface User {
  /** 自己紹介文 */
  description?: string;
  /** Facebook ID  */
  facebook_id?: string;
  /** このユーザがフォローしているユーザの数  */
  followees_count: number;
  /** このユーザをフォローしているユーザの数 */
  followers_count: number;
  /** GitHub ID */
  github_login_name?: string;
  /** ユーザID */
  id: string;
  /** このユーザが qiita.com 上で公開している投稿の数 (Qiita:Teamでの投稿数は含まれません) */
  items_count: number;
  /** LinkedIn ID */
  linkedin_id?: string;
  /** 居住地 */
  location?: string;
  /** 設定している名前 */
  name?: string;
  /** 所属している組織 */
  organization?: string;
  /** ユーザごとに割り当てられる整数のID */
  permanent_id: number;
  /** 設定しているプロフィール画像のURL */
  profile_image_url: string;
  /** Twitterのスクリーンネーム */
  twitter_screen_name?: string;
  /** 設定しているWebサイトのURL */
  website_url?: string;
}
