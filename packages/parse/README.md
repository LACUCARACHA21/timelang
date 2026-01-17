# @timelang/parse

Parse natural language time expressions into dates, durations, and ranges.

[![npm version](https://img.shields.io/npm/v/@timelang/parse)](https://www.npmjs.com/package/@timelang/parse)

## Installation

```bash
npm install @timelang/parse
```

## Quick Example

```javascript
import { parseDate, parseDuration, parseSpan } from '@timelang/parse';

parseDate('next friday at 3pm');  // Date
parseDuration('2h 30m');          // 9000000 (milliseconds)
parseSpan('jan 5 to jan 20');     // { start: Date, end: Date, duration: number }
```

## Documentation

For full API reference and examples, visit **[timelang.dev](https://timelang.dev/)**.

## License

MIT
