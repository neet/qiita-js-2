import * as LinkHeader from 'http-link-header';

export const getNextUrl = (headers: { [K: string]: any }): string | null => {
  const link = headers.link || '';
  const refs = LinkHeader.parse(link).refs.filter((ref) => ref.rel === 'next');

  return refs.length > 0
    ? refs[0].uri
    : null;
};
