import R from 'ramda';
import {isString, isNumber, padStart} from 'lodash';
import crypto from 'crypto';

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

const hashSep = '\x1E';
export const hashSimpleObject = (object, encoding = 'hex') => {
  const hasher = crypto.createHash('sha1');
  Object.keys(object).sort().forEach((key) => {
    const value = object[key];
    if (!(isString(value) || isNumber(value))) {
      throw new Error(`unable to hash value ${value}`);
    }
    const sValue = `${value}`;
    if (sValue.indexOf(hashSep) > -1) {
      throw new Error(`${sValue} contains invalid character 0x1E`);
    }
    hasher.update(`${key.length}${hashSep}${key}${hashSep}${sValue}${hashSep}`);
  });
  return hasher.digest(encoding);
};
