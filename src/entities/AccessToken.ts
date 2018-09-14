export interface AccessToken {
  /** 登録されたAPIクライアントを特定するためのIDです。40桁の16進数で表現されます。 */
  client_id: string;
  /** アプリケーションが利用するスコープをスペース区切りで指定できます。 */
  scopes: string[];
  /** CSRF対策のため、認可後にリダイレクトするURLのクエリに含まれる値を指定できます。 */
  token: string;
}
