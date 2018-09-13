export interface TeamInvitation {
  /** 招待中のメンバーのemailアドレスです。 */
  email: string;
  /** 招待用URLです。有効期限は1日です。 */
  url: string;
}
