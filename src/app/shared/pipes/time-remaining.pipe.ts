import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';

dayjs.extend(duration);
dayjs.extend(utc);

@Pipe({
  name: 'remainingTime',
  standalone: true
})
export class RemainingTimePipe implements PipeTransform {
  public transform(scheduledTime?: Date | string): string {
    if (!scheduledTime || !dayjs(scheduledTime).isValid()) return '';

    const now = dayjs().utc();
    let target = dayjs(scheduledTime).utc();

    const offset = dayjs().utcOffset();
    target = target.add(offset, 'minute');

    const diff = dayjs.duration(target.diff(now));

    const days = diff.days();
    const hours = diff.hours();
    const minutes = diff.minutes();
    const seconds = diff.seconds();

    const timeStr = days ? `${days}d ` : '';
    return `${timeStr}${hours}h ${minutes}m ${seconds}s`;
  }
}
