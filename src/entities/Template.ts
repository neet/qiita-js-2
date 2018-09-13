import { Tagging } from './Tagging';

export interface Template {
  /** テンプレートの本文 */
  body: string;
  /** テンプレートの一意なID */
  id: number;
  /** テンプレートを判別するための名前 */
  name: string;
  /** 変数を展開した状態の本文 */
  expanded_body: string;
  /** 変数を展開した状態のタグ一覧 */
  expanded_tags: Tagging[];
  /** 変数を展開した状態のタイトル */
  expanded_title: string;
  /** タグ一覧 */
  tags: Tagging[];
  /** 生成される投稿のタイトルの雛形 */
  title: string;
}
