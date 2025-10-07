import * as ms from 'ms';

export const TIMES_MILLISECONDS = Object.freeze({
  ONE_SECOND: ms('1s'),
  FIVE_SECONDS: ms('5s'),
  TEN_SECONDS: ms('10s'),
  THIRTY_SECONDS: ms('30s'),

  ONE_MINUTE: ms('1m'),
  FIVE_MINUTES: ms('5m'),
  TEN_MINUTES: ms('10m'),
  THIRTY_MINUTES: ms('30m'),

  ONE_HOUR: ms('1h'),
  TWO_HOURS: ms('2h'),
  SIX_HOURS: ms('6h'),
  TWELVE_HOURS: ms('12h'),

  ONE_DAY: ms('1d'),
  THREE_DAYS: ms('3d'),
  SEVEN_DAYS: ms('7d'),
});
