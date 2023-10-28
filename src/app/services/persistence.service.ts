import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class PersistenceService {
  constructor() {}

  getValues(): string | null {
    const tasks = localStorage.getItem('mydayapp-angular');
    if (tasks) {
      return JSON.parse(tasks);
    }
    return null;
  }

  setValues(tasks: Task[]): void {
    localStorage.setItem('mydayapp-angular', JSON.stringify(tasks));
  }
}
