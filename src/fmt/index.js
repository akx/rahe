import R from 'ramda';

import importNordea from './nordea';


export const importerList = [
  {
    id: 'nordea',
    name: 'Nordea TSV',
    importer: importNordea,
    format: 'text',
    encoding: 'UTF-8',
  },
];

export const importerMap = R.fromPairs(R.zip(R.pluck('id', importerList), importerList));
