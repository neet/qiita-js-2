export class QiitaError extends Error {
  /**
   * Qiitaの概説的なエラーを示すErrorです
   * @param name エラーの種類です
   * @param message 人間が読むエラーの説明です
   */
  constructor (public name: string, public message: string) {
    super();
  }
}
