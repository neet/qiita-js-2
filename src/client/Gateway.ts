import nodeFetch from 'node-fetch';
import * as querystring from 'querystring';

import { QiitaError } from '../errors/QiitaError';
import { QiitaNotFoundError } from '../errors/QiitaNotFoundError';
import { QiitaUnauthorizedError } from '../errors/QiitaUnauthorizedError';
import { QiitaURLResolveError } from '../errors/QiitaURLResolveError';

export abstract class Gateway {

  /** Qiitaのホストです */
  protected url = 'https://qiita.com';

  /** ユーザーのアクセストークンです */
  protected token = '';

  /** APIバージョンを示すロケーションです */
  protected version = '/api/v2';

  /**
   * @param options オプショナルなパラメーター
   * @param options.url Qiitaのホストです
   * @param options.version APIバージョンを示すロケーションです
   * @param options.token ユーザーのアクセストークンです
   */
  constructor (options?: { url?: string, token?: string, version?: string }) {
    if (options && options.url) {
      this.url     = options.url;
    }

    if (options && options.token) {
      this.version = options.version || '';
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
   * Qiita Teamへのエンドポイントを設定します
   * @param url Qiitaのホスト
   * @return 何も返しません
   */
  public setURL (url: string): void {
    this.url = url;
  }

  /**
   * Qiita APIへのパスを指定します．
   * @param version APIへのパスの文字列 (e.g. `/api/v2`)
   * @return 何も返しません
   */
  public setVersion (version: string): void {
    this.version = version;
  }

  /**
   * Fetch APIのラッパー関数です
   * @param url リクエストするURLです
   * @param options Fetch APIの第二引数に渡されるオプションです
   * @return パースされたJSONオブジェクトを解決するPromiseです
   */
  protected async request <T> (url: string, options: { [key: string]: any } = {}): Promise<T> {
    if ( !options.headers ) {
      options.headers = {};
    }

    if (!options.headers['Content-Type']) {
      options.headers['Content-Type']  = 'application/json';
    }

    if ( !this.url ) {
      throw new QiitaURLResolveError('Qiitaのホストが指定されていません。`Qiita.setURL` でAPIのホストを指定してからメソッドを呼び出してください。');
    }

    if ( this.token ) {
      options.headers.Authorization = `Bearer ${this.token}`;
    }

    const response = typeof window === 'undefined'
      ? await nodeFetch(url, options)
      : await fetch(url, options);

    const data = await response.json();

    if (response.ok) {
      return data as T;
    } else {
      switch (response.status) {
        case 401:
          throw new QiitaUnauthorizedError(data.error);
        case 404:
          throw new QiitaNotFoundError(data.error);
        default:
          throw new QiitaError('QiitaError', data.error || 'Qiita APIのリクエスト中に予期せぬエラーが発生しました');
      }
    }
  }

  /**
   * HTTP GET
   * @param url URL to request
   * @param params Query strings
   * @param options Fetch API options
   */
  protected get <T> (url: string, params = {}, options = {}): Promise<T> {
    return this.request(url + (Object.keys(params).length ? '?' + querystring.stringify(params) : ''), { method: 'GET', ...options });
  }

  /**
   * HTTP POST
   * @param url URL to request
   * @param body Payload
   * @param options Fetch API options
   */
  protected post <T> (url: string, body = {}, options = {}): Promise<T> {
    return this.request(url, { method: 'POST', body: JSON.stringify(body), ...options });
  }

  /**
   * HTTP PUT
   * @param url URL to request
   * @param body Payload
   * @param options Fetch API options
   */
  protected put <T> (url: string, body = {}, options = {}): Promise<T> {
    return this.request(url, { method: 'PUT', body: JSON.stringify(body), ...options });
  }

  /**
   * HTTP DELETE
   * @param url URL to request
   * @param body Payload
   * @param options Fetch API options
   */
  protected delete <T> (url: string, body = {}, options = {}): Promise<T> {
    return this.request(url, { method: 'DELETE', body: JSON.stringify(body), ...options });
  }

  /**
   * HTTP PATCH
   * @param url URL to request
   * @param body Payload
   * @param options Fetch API options
   */
  protected patch <T> (url: string, body = {}, options = {}): Promise<T> {
    return this.request(url, { method: 'PATCH', body: JSON.stringify(body), ...options });
  }
}
