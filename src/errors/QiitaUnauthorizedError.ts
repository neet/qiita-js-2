import { QiitaError } from './QiitaError';

export class QiitaUnauthorizedError extends QiitaError {
  constructor (message: string) {
    super('QiitaUnauthorizedError', message);
  }
}
