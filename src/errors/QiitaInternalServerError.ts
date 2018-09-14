import { QiitaError } from './QiitaError';

export class QiitaInternalServerError extends QiitaError {
  constructor (message: string) {
    super('QiitaInternalServerError', message);
  }
}
