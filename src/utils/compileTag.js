import R from 'ramda';
import {isUndefined} from 'lodash';

const ops = {
  '^=': (fieldValue, value) => fieldValue.indexOf(value) === 0,
  '=': (fieldValue, value) => fieldValue === value,
  '~=': (fieldValue, value) => fieldValue.indexOf(value) > -1,
};

const exprFnRe = new RegExp(`^(.+?)\s*(${Object.keys(ops).join('|')})\s*(.+)$`);
const never = R.always(null);

function compileMatcher(tag) {
  if (!tag.expr) return null;
  const exprFnMatch = exprFnRe.exec(tag.expr);
  if (exprFnMatch) {
    const [_, field, op, value] = exprFnMatch;  // eslint-disable-line no-unused-vars
    const opfn = ops[op];
    if (!opfn) {
      return null;
    }
    return function complexMatcher(txn) {
      const fieldValue = txn[field];
      if (fieldValue === null || isUndefined(fieldValue)) return false;
      return opfn(fieldValue, value);
    };
  }
  return function simpleMatcher(txn) {
    return Object.keys(txn).some((key) => `${txn[key]}`.indexOf(tag.expr) > -1);
  };
}


export default function compileTag(tag) {
  const matcher = compileMatcher(tag);
  if (!matcher) {
    console.warn('unable to compile', tag);
    return never;
  }
  return function taggerFn(txn) {
    if (matcher(txn)) return tag.result;
    return null;
  };
}
