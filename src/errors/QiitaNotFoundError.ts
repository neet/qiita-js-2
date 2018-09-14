import { QiitaError } from './QiitaError';

export class QiitaNotFoundError extends QiitaError {
  constructor (message: string) {
    super('QiitaNotFoundError', message);
  }
}
