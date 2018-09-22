import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as querystring from 'querystring';

import { QiitaError } from '../errors/QiitaError';
import { QiitaForbiddenError } from '../errors/QiitaForbiddenError';
import { QiitaInternalServerError } from '../errors/QiitaInternalServerError';
import { QiitaNotFoundError } from '../errors/QiitaNotFoundError';
import { QiitaRateLimitError } from '../errors/QiitaRateLimitError';
import { QiitaUnauthorizedError } from '../errors/QiitaUnauthorizedError';
import { QiitaURLResolveError } from '../errors/QiitaURLResolveError';

export abstract class Gateway {

  /** Qiitaのホストです */
  protected url = 'https://qiita.com';

  /** ユーザーのアクセストークンです */
  protected token = '';

  /** APIバージョンを示すパスです */
  protected version = '/api/v2';

  /**
   * @param options オプショナルなパラメーター
   * @param options.url Qiitaのホストです
   * @param options.version APIバージョンを示すパスです
   * @param options.token ユーザーのアクセストークンです
   */
  constructor (options?: { url?: string, token?: string, version?: string }) {
    if (options && options.url) {
      this.url = options.url;
    }

    if (options && options.version) {
      this.version = options.version;
    }

    if (options && options.token) {
      this.token = options.token;
    }
  }

  /**
   * Qiita APIにアクセスするためのトークンを設定します
   * @param token トークン文字列
   * @return 何も返しません
   */
  public setToken (token: string): void {
    this.token = token;
  }

  /**
   * QiitaへのURLを設定します
   * @param url Qiitaのホスト
   * @return 何も返しません
   */
  public setUrl (url: string): void {
    // トレーリングスラッシュを削除
    this.url = url.replace(/\/$/, '');
  }

  /**
   * Qiita APIへのパスを指定します．
   * @param version APIへのパスの文字列 (e.g. `/api/v2`)
   * @return 何も返しません
   */
  public setVersion (version: string): void {
    // トレーリングスラッシュを削除
    this.version = version.replace(/\/$/, '');
  }

  /**
   * APIクライアントに設定されたトークンを返します
   * トークンの取得を行うには `Qiita.fetchAccessToken` をご利用ください。
   * @return 設定されたトークン
   */
  public getToken = () => this.token;

  /**
   * APIクライアントに設定されたURLを返します
   * @return 設定されたURL
   */
  public getUrl = () => this.url;

  /**
   * APIクライアントに設定されたバージョンを示すパスを返します
   * @return 設定されたパス
   */
  public getVersion = () => this.version;


  /**
   * Fetch APIのラッパー関数です
   * @param url リクエストするURLです
   * @param options Fetch APIの第二引数に渡されるオプションです
   * @return パースされたJSONオブジェクトを解決するPromiseです
   */
  protected async request <T> (options: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    if ( !options.headers ) {
      options.headers = {};
    }

    if (!options.headers['Content-Type']) {
      options.headers['Content-Type']  = 'application/json';
    }

    if ( !this.url ) {
      throw new QiitaURLResolveError('Qiitaのホストが指定されていません。`Qiita.setUrl` でAPIのホストを指定してからメソッドを呼び出してください。');
    }

    if ( this.token ) {
      options.headers.Authorization = `Bearer ${this.token}`;
    }

    options.transformResponse = [(data) => {
      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    }];

    try {
      return await axios.request<T>(options);
    } catch (error) {
      const { message, status } = error.response;

      switch (status) {
        case 401:
          throw new QiitaUnauthorizedError(message);
        case 403:
          throw new QiitaForbiddenError(message);
        case 404:
          throw new QiitaNotFoundError(message);
        case 429:
          throw new QiitaRateLimitError(message);
        case 500:
          throw new QiitaInternalServerError(message);
        default:
          throw new QiitaError('QiitaError', message);
      }
    }
  }

  /**
   * HTTP GETのラッパー関数です
   * @param url リクエストするURL
   * @param params クエリ文字列
   * @param options Fetch APIの第二引数になるオブジェクト
   */
  protected get <T> (url: string, params = {}, options = {}) {
    return this.request<T>({
      method: 'GET',
      url: url + (Object.keys(params).length ? '?' + querystring.stringify(params) : ''),
      ...options,
    });
  }

  /**
   * HTTP POSTのラッパー関数です
   * @param url リクエストするURL
   * @param body リクエストボディ
   * @param options Fetch APIの第二引数になるオブジェクト
   */
  protected post <T> (url: string, body = {}, options = {}) {
    return this.request<T>({
      method: 'POST',
      url,
      data: JSON.stringify(body),
      ...options,
    });
  }

  /**
   * HTTP PUTのラッパー関数です
   * @param url リクエストするURL
   * @param body リクエストボディ
   * @param options Fetch APIの第二引数になるオブジェクト
   */
  protected put <T> (url: string, body = {}, options = {}) {
    return this.request<T>({
      method: 'PUT',
      url,
      data: JSON.stringify(body),
      ...options,
    });
  }

  /**
   * HTTP DELETEのラッパー関数です
   * @param url リクエストするURL
   * @param body リクエストボディ
   * @param options Fetch APIの第二引数になるオブジェクト
   */
  protected delete <T> (url: string, body = {}, options = {}) {
    return this.request<T>({
      method: 'DELETE',
      url,
      data: JSON.stringify(body),
      ...options,
    });
  }

  /**
   * HTTP PATCHのラッパー関数です
   * @param url リクエストするURL
   * @param body リクエストボディ
   * @param options Fetch APIの第二引数になるオブジェクト
   */
  protected patch <T> (url: string, body = {}, options = {}) {
    return this.request<T>({
      method: 'PATCH',
      url,
      data: JSON.stringify(body),
      ...options,
    });
  }
}
