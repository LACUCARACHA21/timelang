# @timelang/suggest

Smart autocomplete suggestions for date and time inputs.

[![npm version](https://img.shields.io/npm/v/@timelang/suggest)](https://www.npmjs.com/package/@timelang/suggest)

## Installation

```bash
npm install @timelang/suggest
```

## Quick Example

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

## Documentation

For full API reference and examples, visit **[timelang.dev/suggest](https://timelang.dev/suggest/)**.

## License

MIT
