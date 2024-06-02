import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const setDayToCurrent = (
  date: dayjs.Dayjs,
  targetDay: dayjs.Dayjs = dayjs()
): dayjs.Dayjs => {
  const currentDay = targetDay.startOf('day');
  const inputTime = date.startOf('day');
  const durationTime = dayjs.duration(date.diff(inputTime));

  return currentDay.add(durationTime.asMilliseconds(), 'millisecond').startOf('second');
};
