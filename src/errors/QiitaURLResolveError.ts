import { QiitaError } from './QiitaError';

export class QiitaURLResolveError extends QiitaError {
  constructor (message: string) {
    super('QiitaURLResolveError', message);
  }
}
