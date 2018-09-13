export interface Team {
  /** チームが利用可能な状態かどうか */
  active: boolean;
  /** チームの一意なID */
  id: string;
  /** チームに設定されている名前を表します。 */
  name: string;
}
