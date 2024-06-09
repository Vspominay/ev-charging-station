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

    const days = Math.abs(diff.days());
    const hours = Math.abs(diff.hours());
    const minutes = Math.abs(diff.minutes());
    const seconds = Math.abs(diff.seconds());

    const timeStr = days ? `${days}d ` : '';
    return `${timeStr}${hours}h ${minutes}m ${seconds}s`;
  }
}
