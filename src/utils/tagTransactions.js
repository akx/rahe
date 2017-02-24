import {identity} from 'lodash';
import compileTag from './compileTag';

export default function tagTransactions(transactions, tags, onlyMatching = false) {
  const tagFns = tags.map(compileTag);
  const processTransaction = (txn) => {
    const matches = tagFns.map((tagFn) => tagFn(txn)).filter(identity);
    if (matches.length) {
      const mergedTags = Object.assign.apply(null, [{}].concat(matches));
      return Object.assign({tags: mergedTags}, txn);
    }
    if (onlyMatching) return null;
    return txn;
  };
  return new Promise((resolve) => {
    let index = 0;
    const output = [];

    function tick() {
      if (index >= transactions.length) {
        resolve(output);
        return;
      }
      const processedTxn = processTransaction(transactions[index]);
      if (processedTxn !== null) {
        output.push(processedTxn);
      }
      index += 1;
      process.nextTick(tick);
    }

    tick();
  });
}
