import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pendingTasks',
})
export class PendingTasksPipe implements PipeTransform {
  transform(value: number | null): string {
    if (value === 1) return 'item left';
    return 'items left';
  }
}
