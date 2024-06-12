import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const adaptToLocalTime = (time: string | Date) => {
  const stringTime = typeof time === 'string' ? time : time.toISOString();

  const isUtcFormat = stringTime.endsWith('Z');
  if (isUtcFormat) return dayjs(time).format();

  const offset = dayjs().utcOffset();
  const target = dayjs(time).utc();

  return target.add(offset, 'minute').format();
};
