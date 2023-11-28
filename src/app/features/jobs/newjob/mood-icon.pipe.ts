import { Pipe } from '@angular/core';

@Pipe({
  name: 'getMoodIcon',
  standalone: true
})
export class GetMoodIcon {
  transform(mood: number): string {
    mood *= 100;
  
    if (mood >= 80) return '😁';
    if (mood >= 60) return '🙂';
    if (mood >= 20) return '😐';

    return '☹️';
  }
}
