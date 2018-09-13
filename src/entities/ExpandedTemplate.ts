import { Tagging } from './Tagging';

export interface ExpandedTemplate {
  /** 変数を展開した状態の本文 */
  expanded_body: string;
  /** 変数を展開した状態のタグ一覧 */
  expanded_tags: Tagging[];
  /** 変数を展開した状態のタイトル */
  expanded_title: string;
}
