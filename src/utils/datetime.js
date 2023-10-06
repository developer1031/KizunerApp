import moment from 'moment-timezone';

export const defaultFormat = 'YYYY-MM-DD HH:mm:ss';

export const formatDate = 'YYYY-MM-DD';

export function defaultFormatDate(date) {
  return moment(date).format(formatDate);
}

export function shortFormat(date, utc) {
  const thisDate = utc ? moment.utc(date) : moment(date);
  if (thisDate.isSame(moment(), 'day')) {
    return thisDate.format('HH:mm');
  }
  if (thisDate.isSame(moment(), 'week')) {
    return thisDate.format('ddd');
  }
  if (thisDate.isSame(moment(), 'month')) {
    return thisDate.format('ddd DD');
  }
  if (thisDate.isSame(moment(), 'year')) {
    return thisDate.format('MM/DD');
  }
  return thisDate.format('YYYY/MM/DD');
}

export function hangoutFormat(date, utc, timezone) {
  if (!date || !moment(date).isValid()) {
    return '';
  }
  date = timezone ? moment(date).tz(timezone) : moment(date);
  return utc
    ? moment.utc(date).calendar(null, {
        lastDay: `[Yesterday at] ${timezone ? 'HH:mm Z' : 'HH:mm'}`,
        sameDay: `[Today at] ${timezone ? 'HH:mm Z' : 'HH:mm'}`,
        nextDay: `[Tomorrow at] ${timezone ? 'HH:mm Z' : 'HH:mm'}`,
        lastWeek: `[last] dddd [at] ${timezone ? 'HH:mm Z' : 'HH:mm'}`,
        nextWeek: `dddd [at] ${timezone ? 'HH:mm Z' : 'HH:mm'}`,
        sameElse: `L [at] ${timezone ? 'HH:mm Z' : 'HH:mm'}`,
      })
    : date.calendar(null, {
        lastDay: `[Yesterday at] ${timezone ? 'HH:mm Z' : 'HH:mm'}`,
        sameDay: `[Today at] ${timezone ? 'HH:mm Z' : 'HH:mm'}`,
        nextDay: `[Tomorrow at] ${timezone ? 'HH:mm Z' : 'HH:mm'}`,
        lastWeek: `[last] dddd [at] ${timezone ? 'HH:mm Z' : 'HH:mm'}`,
        nextWeek: `dddd [at] ${timezone ? 'HH:mm Z' : 'HH:mm'}`,
        sameElse: `L [at] ${timezone ? 'HH:mm Z' : 'HH:mm'}`,
      });
}

export function hangoutRangeFormat(start, end, utc, timezone) {
  let startTime = utc ? moment.utc(start) : moment(start);
  let endTime = utc ? moment.utc(end) : moment(end);
  if (timezone) {
    startTime = startTime.tz(timezone);
    endTime = endTime.tz(timezone);
  }
  if (moment(startTime).isSame(moment(endTime), 'day')) {
    return `${moment(startTime).calendar(null, {
      lastDay: `[Yesterday from] ${timezone ? 'HH:mm Z' : 'HH:mm'} [to]`,
      sameDay: `[Today from] ${timezone ? 'HH:mm Z' : 'HH:mm'} [to]`,
      nextDay: `[Tomorrow from] ${timezone ? 'HH:mm Z' : 'HH:mm'} [to]`,
      lastWeek: `[last] dddd [from] ${timezone ? 'HH:mm Z' : 'HH:mm'} [to]`,
      nextWeek: `dddd [from] ${timezone ? 'HH:mm Z' : 'HH:mm'} [to]`,
      sameElse: `L [from] ${timezone ? 'HH:mm Z' : 'HH:mm'} [to]`,
    })} ${moment(endTime).format(timezone ? 'HH:mm Z' : 'HH:mm')}`;
  }
  if (
    hangoutFormat(startTime, utc, timezone) &&
    hangoutFormat(endTime, utc, timezone)
  ) {
    return `${hangoutFormat(startTime, utc, timezone)} - ${hangoutFormat(
      endTime,
      utc,
      timezone,
    )}`;
  }
  return '';
}

export function isExpriedTime(end) {
  return moment(end).isBefore(moment());
}
