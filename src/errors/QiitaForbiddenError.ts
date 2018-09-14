import { QiitaError } from './QiitaError';

export class QiitaForbiddenError extends QiitaError {
  constructor (message: string) {
    super('QiitaForbiddenError', message);
  }
}
