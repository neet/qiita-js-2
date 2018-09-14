import { QiitaError } from './QiitaError';

export class QiitaRateLimitError extends QiitaError {
  constructor (message: string) {
    super('QiitaRateLimitError', message);
  }
}
