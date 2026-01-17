# timelang

> Packages to work with natural language time expressions.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Docs](https://img.shields.io/badge/docs-timelang.dev-purple)](https://timelang.dev)

| Package | What it does? | Version |
|---------|-------------|---------|
| [@timelang/parse](https://timelang.dev/) | Parse natural language time expressions into dates, durations, and ranges | [![npm version](https://img.shields.io/npm/v/@timelang/parse)](https://www.npmjs.com/package/@timelang/parse) |
| [@timelang/suggest](https://timelang.dev/suggest/) | Autocomplete suggestions for time expressions | [![npm version](https://img.shields.io/npm/v/@timelang/suggest)](https://www.npmjs.com/package/@timelang/suggest) |

## @timelang/parse

```bash
npm install @timelang/parse
```

```javascript
import { parse, parseDate, parseDuration, parseSpan, scan } from '@timelang/parse';

parseDate('next friday at 3pm');        // Date
parseDuration('2h 30m');                // 9000000 (milliseconds)
parseSpan('jan 5 to jan 20');           // { start: Date, end: Date, duration: number }

parse('Team Sync - next monday');       // { type: 'date', date, title: 'Team Sync' }
parse('mid Q1');                        // { type: 'fuzzy', start, end, approximate: true }

scan("let's meet next monday at 530pm");
// [{ result: {...}, match: 'next monday at 530pm', start: 11, end: 31 }]
```

For full API reference and examples, visit **[timelang.dev](https://timelang.dev/)**.

## @timelang/suggest

```bash
npm install @timelang/suggest
```

```javascript
import { suggest, suggestTime } from '@timelang/suggest';

suggest('tom');
// [
//   { label: 'tomorrow at 9am', date: Date },
//   { label: 'tomorrow at 2pm', date: Date },
//   ...
// ]

suggestTime('9');
// [
//   { label: '09:00 am', hour: 9, minute: 0, period: 'am' },
//   { label: '09:00 pm', hour: 9, minute: 0, period: 'pm' },
//   ...
// ]
```

For full API reference and examples, visit **[timelang.dev/suggest](https://timelang.dev/suggest/)**.

## License

MIT
