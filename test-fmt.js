import fs from 'fs';
import parseNordea from './src/fmt/nordea';


const data = fs.readFileSync(process.argv[2], 'UTF-8');

parseNordea(data).then((d) => {
  console.log(JSON.stringify(d, null, 2));
}).catch((e) => {
  throw e;
});
