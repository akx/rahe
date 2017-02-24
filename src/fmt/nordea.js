import R from 'ramda';
import {hashSimpleObject, splitTSVLines, parseFinnishDate, parseDecimal} from './utils';

const fieldNameMap = {
  'arvopäivä': 'valueDate',
  'bic': 'bic',
  'kirjauspäivä': 'bookingDate',
  'kortinnumero': 'cardNumber',
  'maksajan viite': 'payerReference',
  'maksupäivä': 'paymentDate',
  'määrä': 'amount',
  'saaja/maksaja': 'recipient',
  'tapahtuma': 'type',
  'tilinumero': 'accountNumber',
  'viesti': 'message',
  'viite': 'reference',
};

const converterMap = {
  'arvopäivä': parseFinnishDate,
  'kirjauspäivä': parseFinnishDate,
  'maksupäivä': parseFinnishDate,
  'määrä': parseDecimal,
};

const collapseWS = (s) => R.trim(`${s}`.replace(/\s+/g, ' '));

/**
 * Parse Nordea TSV exports.
 * @param data String data
 * @returns {Promise}
 */
export default function parseNordea(data) {
  return new Promise((resolve) => {
    const meta = {};
    const transactions = [];
    const lines = splitTSVLines(data);
    let fields = null;

    function parseLine(line) {
      if (line[0] === 'Tilinumero') {
        meta.account = line[1];
        return;
      }
      if (fields === null) {
        fields = line.map(R.toLower);
        return;
      }
      if (line.length !== fields.length) {
        return;
      }
      const txn = R.pipe(
        R.zip(fields),
        R.filter((pair) => pair[1] !== ''),
        R.map(([field, value]) => [fieldNameMap[field] || field, (converterMap[field] || collapseWS)(value)]),
        R.fromPairs
      )(line);
      txn.id = hashSimpleObject(txn);
      transactions.push(txn);
    }

    function tick() {
      if (lines.length === 0) {
        resolve({meta, transactions});
        return;
      }
      parseLine(lines.shift());
      process.nextTick(tick);
    }

    tick();
  });
}
