export interface FetchTagsOptions {
  /** ページ番号 (1から100まで) */
  page?: string;
  /** 1ページあたりに含まれる要素数 (1から100まで) */
  perPage?: string;
  /** 並び順 (countで投稿数順、nameで名前順) */
  sort?: 'count'|'name';
  /** [ドキュメント記載無し] */
  q?: string;
}
