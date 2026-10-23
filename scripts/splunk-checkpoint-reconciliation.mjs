import {simulatorChange} from './simulator-reconciliation.mjs';
import {v20Change} from './splunk-v20-reconciliation.mjs';
import {windowsAdChange} from './windows-ad-reconciliation.mjs';
import {linuxChange} from './linux-reconciliation.mjs';
import {socChange} from './soc-reconciliation.mjs';
import {repasoSocChange} from './repaso-soc-reconciliation.mjs';
// Only the exact documentary checkpoint requested in RETOMAR is reconciled.
// Historical inventories and their backups are never rewritten.
export function checkpointDocumentChange(file, expected, actual) {
  return file === 'docs/RETOMAR.md'
    && expected === '8f7a2fd30583e0ee0651901097f82a6df78ba2b968846a5ea329d50fc4f9da4c'
    && actual === 'a26bd328a11f4e5733fc298d369188a7c1a4edc9eae8254bbd989e2867614d95';
}

// Exact minimal guard edits needed to recognize that one documentary change.
const guardEdits={
  "scripts/splunk-integrity.mjs": {
    "expected": "22b44b765da80f768fee08014ca1b3418488e8c09828813b28b9d1d2c961ce35",
    "actual": "8976430b5c6b62c2df752698aa39c1b05ac9b1edca6b0ae2dc2a5a44dccf9358"
  },
  "scripts/splunk-v12-integrity.mjs": {
    "expected": "e7a68acbe127833430bbb92bf39f3339a0318269bea710da9c84ab3e568a155e",
    "actual": "a53c6c83a74cce7c758d6f50e4b2c4ee9e4002590ffceb091cea3409176a352d"
  }
};
export function authorizedHistoricalChange(file,expected,actual) {
  const edit=guardEdits[file];
  return simulatorChange(file,expected,actual) || v20Change(file,expected,actual) || windowsAdChange(file,expected,actual) || linuxChange(file,expected,actual) || socChange(file,expected,actual) || repasoSocChange(file,expected,actual) || checkpointDocumentChange(file,expected,actual) || !!edit && edit.expected===expected && edit.actual===actual || file===readerV122Edit.file&&expected===readerV122Edit.expected&&actual===readerV122Edit.actual || file===readerHeadingFix.file&&expected===readerHeadingFix.expected&&actual===readerHeadingFix.actual;
}

// V1.2.2 authorized reader-only replacement; no educational or map exception.
const readerV122Edit={file:"src/splunk/SplunkReader.tsx",expected:"37854338bbdbb872c71eb691c5ef4082a6a03b142b54cf3a565e5efbc6afb91c",actual:"a21b2030b7c32c5593bc68e2fa51af04e2189b8071ee0215196b78c4b01617a2"};

// Exact presentation-only heading fix; default Markdown rendering is unchanged.
const readerHeadingFix={file:"src/splunk/SplunkMarkdown.tsx",expected:"a40c1b6f10ec25a6064b4558c1ec9a68e0787e11e331260df42f07da765b9545",actual:"a9440cb73ce0547c959ddcc688286d87839cc5a7ada23ac995f25785082da5d7"};
