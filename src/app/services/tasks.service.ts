import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Task } from '../models/task.model';
import { PersistenceService } from './persistence.service';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private tasks: Task[] = [];
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();
  pendingTasks$ = this.tasks$.pipe(
    map((tasks) => tasks.filter((task) => !task.completed))
  );
  completedTasks$ = this.tasks$.pipe(
    map((tasks) => tasks.filter((task) => task.completed))
  );
  pendingTasksCounter$ = this.pendingTasks$.pipe(map((tasks) => tasks.length));
  completedTasksCounter$ = this.completedTasks$.pipe(
    map((tasks) => tasks.length)
  );

  constructor(private ls: PersistenceService) {
    const values = this.ls.getValues();
    if (values) {
      this.tasks = values;
      this.tasksSubject.next(this.tasks);
    }
  }

  private persistTasks(): void {
    this.ls.setValues(this.tasks);
    this.tasksSubject.next(this.tasks);
  }

  addTask(taskTitle: string): void {
    if (taskTitle.trim().length > 0) {
      this.tasks.push({
        id: new Date().toString() + Math.floor(Math.random() * 2000),
        title: taskTitle.trim(),
        completed: false,
      });
      this.persistTasks();
    }
  }

  editTask(taskId: string, taskTitle: string): void {
    if (taskTitle.trim().length > 0) {
      this.tasks = this.tasks.map((task) =>
        task.id === taskId ? { ...task, title: taskTitle.trim() } : task
      );
      this.persistTasks();
    }
  }

  toggleTaskStatus(taskId: string): void {
    this.tasks = this.tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    this.persistTasks();
  }

  clearCompletedTasks(): void {
    this.tasks = this.tasks.filter((task) => !task.completed);
    this.persistTasks();
  }

  getTextFromTask(taskId: string): string {
    const task = this.tasks.find((task) => task.id === taskId);
    return task ? task.title : '';
  }
}
