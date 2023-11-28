import { Pipe } from '@angular/core';

@Pipe({
  name: 'getMoodStyle',
  standalone: true
})
export class GetMoodStyle {
  transform(mood: number): string {
    mood *= 100;

    if (mood >= 80) return 'success';
    if (mood >= 60) return 'secondary';
    if (mood >= 20) return 'warning';

    return 'danger';
  }
}
