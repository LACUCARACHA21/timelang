import moo from 'moo';

const lexer = moo.compile({
  // Whitespace - capture for potential preservation
  ws: /[ \t]+/,
  newline: { match: /\r?\n/, lineBreaks: true },

  // Time patterns (must come before numbers to match correctly)
  time: /(?:0?[0-9]|1[0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9])?/,

  // Quarter notation: Q1, Q2, Q3, Q4 (case insensitive via alternation)
  quarter: { match: /[Qq][1-4]/, value: (s: string) => s.toUpperCase() },

  // Half notation: H1, H2 (case insensitive via alternation)
  half: { match: /[Hh][1-2]/, value: (s: string) => s.toUpperCase() },

  // Ordinal numbers: 1st, 2nd, 3rd, 4th-31st (case insensitive suffixes)
  ordinal: {
    match: /(?:3[01]|[12]?[0-9])(?:[Ss][Tt]|[Nn][Dd]|[Rr][Dd]|[Tt][Hh])/,
    value: (s: string) => s.toLowerCase(),
  },

  // Decimal numbers (must come before integer)
  decimal: /\d+\.\d+/,

  // Integer numbers
  integer: /\d+/,

  // AM/PM (must come before general keywords)
  ampm: { match: /[Aa][Mm]|[Pp][Mm]/, value: (s: string) => s.toLowerCase() },

  // Keywords - match words and normalize to lowercase
  // Using a regex to match any word, then checking against known keywords
  // The transform function in moo.keywords makes matching case-insensitive
  word: {
    match: /[a-zA-Z][a-zA-Z0-9#]*/,
    type: moo.keywords({
      // Time words
      timeWord: ['today', 'tomorrow', 'yesterday', 'now', 'noon', 'midnight'],
      // Relative modifiers
      relative: ['next', 'last', 'this', 'previous', 'coming', 'upcoming', 'past'],
      // Period modifiers
      modifier: ['early', 'mid', 'late', 'beginning', 'middle', 'end', 'start'],
      // Ordinal words
      ordinalWord: [
        'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth',
        'eleventh', 'twelfth',
      ],
      // Half word
      halfWord: ['half'],
      // Connectors
      connector: [
        'to', 'from', 'until', 'til', 'till', 'through', 'between', 'and', 'for', 'in', 'on', 'at', 'of', 'the',
        'within', 'over', 'during', 'starting', 'by', 'before', 'after', 'around', 'about', 'sometime',
      ],
      // Periods/units
      unit: [
        'day', 'days', 'week', 'weeks', 'month', 'months', 'year', 'years',
        'quarter', 'quarters', 'hour', 'hours', 'minute', 'minutes', 'second', 'seconds',
        'hr', 'hrs', 'min', 'mins', 'sec', 'secs', 'wk', 'wks', 'mo', 'mos', 'yr', 'yrs',
      ],
      // Seasons
      season: ['spring', 'summer', 'fall', 'autumn', 'winter'],
      // Word numbers
      wordNumber: [
        'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
        'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
        'a', 'an', 'couple',
      ],
      // Months - full names
      month: [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december',
        'jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'sept', 'oct', 'nov', 'dec',
      ],
      // Weekdays
      weekday: [
        'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
        'mon', 'tue', 'tues', 'wed', 'thu', 'thur', 'thurs', 'fri', 'sat', 'sun',
      ],
      // Other keywords
      otherKeyword: ['fiscal', 'fy', 'daily', 'weekly', 'monthly', 'yearly', 'annually', 'ago', 'hence', 'later'],
    }), // Keywords are matched against lowercase input
  },

  // Punctuation and separators
  lparen: '(',
  rparen: ')',
  lbracket: '[',
  rbracket: ']',
  lbrace: '{',
  rbrace: '}',
  colon: ':',
  semicolon: ';',
  comma: ',',
  dash: /[-–—]/,  // Regular dash, en-dash, em-dash
  slash: '/',

  // Any other single character
  other: /./,
});

// Helper to tokenize input (case-insensitive)
// We convert to lowercase before tokenizing since moo.keywords doesn't support case-insensitive matching
function tokenize(input: string) {
  lexer.reset(input.toLowerCase());
  return Array.from(lexer);
}

// Tokenize while preserving original case information
// Returns tokens with an additional 'original' property
function tokenizeWithOriginal(input: string) {
  const normalized = input.toLowerCase();
  lexer.reset(normalized);
  const tokens = Array.from(lexer);

  // Map back original text based on positions
  return tokens.map(token => ({
    ...token,
    original: input.slice(token.offset, token.offset + token.text.length),
  }));
}

// Token type constants for use in grammar
const TokenTypes = {
  WS: 'ws',
  NEWLINE: 'newline',
  TIME: 'time',
  QUARTER: 'quarter',
  HALF: 'half',
  ORDINAL: 'ordinal',
  DECIMAL: 'decimal',
  INTEGER: 'integer',
  AMPM: 'ampm',
  TIME_WORD: 'timeWord',
  RELATIVE: 'relative',
  MODIFIER: 'modifier',
  ORDINAL_WORD: 'ordinalWord',
  HALF_WORD: 'halfWord',
  CONNECTOR: 'connector',
  UNIT: 'unit',
  SEASON: 'season',
  WORD_NUMBER: 'wordNumber',
  MONTH: 'month',
  WEEKDAY: 'weekday',
  OTHER_KEYWORD: 'otherKeyword',
  WORD: 'word',
  LPAREN: 'lparen',
  RPAREN: 'rparen',
  LBRACKET: 'lbracket',
  RBRACKET: 'rbracket',
  LBRACE: 'lbrace',
  RBRACE: 'rbrace',
  COLON: 'colon',
  SEMICOLON: 'semicolon',
  COMMA: 'comma',
  DASH: 'dash',
  SLASH: 'slash',
  OTHER: 'other',
} as const;

export { lexer, tokenize, tokenizeWithOriginal, TokenTypes };
