import R from 'ramda';
import padStart from 'lodash/padStart';

export const splitTSVLines = R.pipe(
  R.replace(/\r\n/g, '\n'),
  R.split('\n'),
  R.filter((l) => l.length),
  R.map(R.split('\t'))
);

export const parseFinnishDate = R.pipe(
  R.split('.'),
  ([d, m, y]) => `${padStart(y, 4, '0')}-${padStart(m, 2, '0')}-${padStart(d, 2, '0')}`
);

export const parseDecimal = (d) => parseFloat(d.replace(',', '.'));

