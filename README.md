# timelang

Parse natural language time expressions into dates, durations, and ranges.

<img src="./.github/header.png" align="right" width="500" />

Install the package:

```bash
npm install timelang
```

Start parsing natural language date inputs:

```javascript
import { parse, parseDate, parseDuration, parseSpan, extract } from 'timelang';

// Single dates (returns Date object)
parseDate('tomorrow');                  // Date
parseDate('next friday at 3pm');        // Date
parseDate('march 15th 2025');           // Date
parseDate('monday next week at 10am');  // Date
parseDate('day after tomorrow at 5pm'); // Date
parseDate('mid january')                // Date

// Durations (returns milliseconds)
parseDuration('2 weeks');       // 1209600000 (milliseconds)
parseDuration('2h 30m');        // 9000000
parseDuration('1.5 hours');     // 5400000

// Ranges (returns { start: Date, end: Date, duration: number })
parseSpan('jan 5 to jan 20');   // { start, end, duration }
parseSpan('last 30 days');      // { start, end, duration }
parseSpan('next whole month');  // { start, end, duration }

// With titles
parse('Team Sync - next monday');  // { type: 'date', date: Date, title: 'Team Sync' }
parse('Sprint 1: jan 5 to jan 19'); // { type: 'span', start, end, title: 'Sprint 1' }

// Multiple items from text
extract(`Kickoff - Jan 5, Sprint 1 - Jan 6 to Jan 19, Launch - Feb 1`);
// Returns array of 3 parsed results with titles
```

## Why this library?

I needed natural language date input for a project at work where users could pass the dates, times, durations and date ranges in natural language e.g. "next monday", "in a week", "5 minutes", "at 5pm for 10 minutes", "Team sync - next monday at 10am" or "Sprint 1: Jan 6 to Jan 19" and it should work.

timelang is designed to work with a wide variety of inputs, handle edge cases, and return accurate results or null for invalid input.

- **Fuzzy inputs**: "mid Q1", "early january", "end of month"
- **Flexible formatting**: Extra spaces, mixed case, missing separators all work
- **Edge cases**: Year rollovers, leap years, fiscal year quarters
- **Multiple formats**: "jan 5", "5th jan", "january 5th", "2025-01-05"
- **Title extraction**: Gets "Team Sync" from "Team Sync - next monday"
- **Customizable options**: Reference date, fiscal year start, week start day, date format
- **No dependencies**: Lightweight and fast

## API

### `parse(input, options?)`

Main function. Returns different result types based on input.

```typescript
// Date result
parse('tomorrow');
// { type: 'date', date: Date, title: null }

parse('next friday');
// { type: 'date', date: Date, title: null }

parse('march 15th 2025');
// { type: 'date', date: Date, title: null }

// Duration result
parse('2 weeks');
// { type: 'duration', duration: 1209600000, title: null }

parse('1h 30m');
// { type: 'duration', duration: 5400000, title: null }

// Span result
parse('jan 5 to jan 20');
// { type: 'span', start: Date, end: Date, duration: number, title: null }

parse('last 30 days');
// { type: 'span', start: Date, end: Date, duration: number, title: null }

// Fuzzy result (approximate dates)
parse('mid Q1');
// { type: 'fuzzy', start: Date, end: Date, approximate: true, title: null }

parse('early january');
// { type: 'fuzzy', start: Date, end: Date, approximate: true, title: null }

// With titles (dash separator)
parse('Team Sync - next monday');
// { type: 'date', date: Date, title: 'Team Sync' }

// With titles (colon separator)
parse('Sprint 1: jan 5 to jan 19');
// { type: 'span', start: Date, end: Date, duration: number, title: 'Sprint 1' }

// With titles (parentheses)
parse('Meeting (Jan 15 at 2pm)');
// { type: 'date', date: Date, title: 'Meeting' }

// With titles (brackets)
parse('Project Kickoff [March 1st]');
// { type: 'date', date: Date, title: 'Project Kickoff' }

// Invalid input
parse('random text');
// null
```

### `parseDate(input, options?)`

Returns a Date or null. Use when you only want single dates.

```typescript
// Relative dates
parseDate('today');
parseDate('tomorrow');
parseDate('yesterday');
parseDate('day after tomorrow');

// Weekdays
parseDate('monday');                   // next Monday
parseDate('next friday');
parseDate('last tuesday');
parseDate('this wednesday');

// Month and day
parseDate('march 15');
parseDate('march 15th');
parseDate('15th march');
parseDate('the 15th of march');
parseDate('march 15th 2025');

// With time
parseDate('tomorrow at 3pm');
parseDate('next monday at 9:30am');
parseDate('march 15 at 14:00');

// ISO format
parseDate('2025-03-15');
parseDate('2025-03-15T14:30:00');

// Relative time
parseDate('in 30 minutes');
parseDate('in 2 hours');

// Period boundaries
parseDate('end of month');
parseDate('end of week');
parseDate('end of day');
parseDate('beginning of year');
parseDate('beginning of month');

// Invalid input
parseDate('not a date');               // null
parseDate('february 30');              // null (invalid date)
parseDate('2 weeks');                  // null (duration, not date)
```

### `parseDuration(input, options?)`

Returns duration in milliseconds or null.

```typescript
// Basic units
parseDuration('3 days');
parseDuration('2 weeks');
parseDuration('1 month');
parseDuration('1 year');
parseDuration('6 hours');
parseDuration('30 minutes');
parseDuration('45 seconds');

// Abbreviated (m = minutes, mo = months)
parseDuration('3d');
parseDuration('2w');
parseDuration('3mo');
parseDuration('1y');
parseDuration('2h');
parseDuration('30m');
parseDuration('45s');

// Word numbers
parseDuration('one week');
parseDuration('two days');
parseDuration('a month');
parseDuration('an hour');

// Fractional
parseDuration('1.5 days');
parseDuration('half a week');
parseDuration('quarter hour');
parseDuration('one and a half hours');

// Combined
parseDuration('1 week and 2 days');
parseDuration('2h 30m');
parseDuration('1 hour 45 minutes');
parseDuration('1h 30m 15s');

// With 'for' prefix
parseDuration('for 2 weeks');
parseDuration('for 3 days');

// Invalid input
parseDuration('tomorrow');             // null (not a duration)
parseDuration('random');               // null
```

### `parseSpan(input, options?)`

Returns `{ start: Date, end: Date, duration: number }` or null.

```typescript
// Date ranges - "to" pattern
parseSpan('jan 5 to jan 20');
parseSpan('january 5 to january 20');

// Date ranges - "from-to" pattern
parseSpan('from march 1 to march 15');

// Date ranges - dash pattern
parseSpan('January 1 - January 15');
parseSpan('Jan1-Jan15');

// Date ranges - "between" pattern
parseSpan('between feb 1 and feb 14');

// Date ranges - "through" pattern
parseSpan('january 1 through january 15');

// Date ranges - "until" pattern
parseSpan('january 1 until january 15');

// Date with duration
parseSpan('july 3rd for 10 days');
parseSpan('tomorrow for 3 days');
parseSpan('next monday for 2 weeks');

// Starting pattern
parseSpan('starting march 1 for 2 weeks');

// In pattern
parseSpan('in january for two days');

// Relative spans - past
parseSpan('last 30 days');
parseSpan('last 2 weeks');
parseSpan('past 7 days');
parseSpan('past 2 weeks');

// Relative spans - future
parseSpan('next 30 days');
parseSpan('next 7 days');
parseSpan('coming 2 weeks');

// Relative spans - within
parseSpan('within 30 days');
parseSpan('within the next month');

// Period spans
parseSpan('this week');
parseSpan('this month');
parseSpan('this year');
parseSpan('next week');
parseSpan('next month');
parseSpan('last week');
parseSpan('last month');
parseSpan('last year');

// Quarters
parseSpan('Q1');
parseSpan('Q2 2025');
parseSpan('first quarter');
parseSpan('second quarter 2025');

// Seasons
parseSpan('spring');
parseSpan('summer 2025');
parseSpan('fall');
parseSpan('winter');

// Year parts
parseSpan('first half of 2025');
parseSpan('second half of 2025');
parseSpan('H1 2025');
parseSpan('H2 2025');

// Year to date
parseSpan('ytd');
parseSpan('year to date');

// Invalid input
parseSpan('tomorrow');                 // null (single date, not span)
parseSpan('2 weeks');                  // null (duration, not span)
parseSpan('random text');              // null
```

### `extract(input, options?)`

Extracts multiple time expressions from text. Returns array of parsed results.

```typescript
// Comma separated
extract('Kickoff - Jan 5, Sprint 1 - Jan 6 to Jan 19, Launch - Feb 1');
// [
//   { type: 'date', date: Date, title: 'Kickoff' },
//   { type: 'span', start: Date, end: Date, duration: number, title: 'Sprint 1' },
//   { type: 'date', date: Date, title: 'Launch' }
// ]

// Semicolon separated
extract('Phase 1 - Jan 1-15; Phase 2 - Jan 16-31; Phase 3 - Feb 1-15');
// Array of 3 span results

// Project planning
extract(`
  Design Phase - Jan 1 to Jan 15,
  Development - Jan 16 to Feb 28,
  Testing - March 1-15,
  Launch - March 20
`);
// Array of 4 results with titles

// Empty or invalid
extract('no dates here');              // []
extract('');                           // []
```

## Options

```typescript
interface ParseOptions {
  referenceDate?: Date;           // Default: new Date()
  fiscalYearStart?: 'january' | 'april' | 'july' | 'october';
  weekStartsOn?: 'sunday' | 'monday';
  dateFormat?: 'us' | 'intl' | 'auto';
}
```

### referenceDate

What "today" means. Default is current date.

```typescript
const ref = new Date('2025-06-15');

parseDate('tomorrow', { referenceDate: ref });
// June 16, 2025

parseDate('next monday', { referenceDate: ref });
// Based on June 15, 2025

parseSpan('last 7 days', { referenceDate: ref });
// June 8-15, 2025
```

### fiscalYearStart

When Q1 starts. Different countries use different fiscal years.

```typescript
// Default (January)
parseSpan('Q1');                                    // Jan-Mar

// UK, Japan (April)
parseSpan('Q1', { fiscalYearStart: 'april' });      // Apr-Jun

// Australia (July)
parseSpan('Q1', { fiscalYearStart: 'july' });       // Jul-Sep

// US Federal (October)
parseSpan('Q1', { fiscalYearStart: 'october' });    // Oct-Dec
```

### weekStartsOn

First day of week. Used for "this week" calculations.

```typescript
// Default (Sunday)
parseSpan('this week');                             // Sun-Sat

// Monday start
parseSpan('this week', { weekStartsOn: 'monday' }); // Mon-Sun
```

### dateFormat

How to parse dates like "01/02/2025".

```typescript
// 'intl' (default) - DD/MM/YYYY
parseDate('01/02/2025');                            // February 1st

// 'us' - MM/DD/YYYY
parseDate('01/02/2025', { dateFormat: 'us' });      // January 2nd

// 'auto' - returns null if ambiguous
parseDate('01/02/2025', { dateFormat: 'auto' });    // null (ambiguous)
parseDate('25/01/2025', { dateFormat: 'auto' });    // January 25th (not ambiguous)
```

ISO format (YYYY-MM-DD) always works regardless of this option.

## License

MIT
