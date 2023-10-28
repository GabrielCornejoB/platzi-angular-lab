import { Component, OnInit } from '@angular/core';
import { filter, fromEvent, tap } from 'rxjs';
import { Task } from 'src/app/models/task.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  tasks: Task[] = [];
  newTask: string = '';

  isEditingActive: boolean = false;
  editingTaskId: string | null = null;
  counter: number = 0;
  editingTask: string = '';

  pendingTasksCounter: number = 0;

  submitObs$ = fromEvent<KeyboardEvent>(document, 'keyup').pipe(
    filter((e) => e.code === 'Enter' || e.code === 'Escape')
  );

  constructor() {}

  ngOnInit(): void {
    this.submitSubscription();
  }

  submitSubscription(): void {
    this.submitObs$.subscribe((e) => {
      if (this.isEditingActive) {
        this.editTask(e);
      }
      if (e.code === 'Enter' && this.newTask.trim().length > 0) {
        this.createTask();
      }
    });
  }

  createTask() {
    this.tasks.push({
      id: this.counter.toString(),
      title: this.newTask,
      completed: false,
      isEditing: false,
    });
    this.newTask = '';
    this.counter++;
    this.pendingTasksCounter++;
  }

  toggleTaskStatus(taskId: string): void {
    this.tasks = this.tasks.map((task) => {
      if (task.id === taskId) {
        this.pendingTasksCounter = task.completed
          ? this.pendingTasksCounter + 1
          : this.pendingTasksCounter - 1;
        return { ...task, completed: !task.completed };
      }
      return task;
    });
  }

  openEditMode(taskId: string): void {
    this.tasks = this.tasks.map((task) => {
      if (task.id === taskId) {
        this.editingTask = task.title;
        this.editingTaskId = task.id;
        return { ...task, isEditing: true };
      }
      return { ...task, isEditing: false };
    });
    this.isEditingActive = true;
  }

  editTask(e: KeyboardEvent) {
    if (e.code === 'Enter' && this.editingTask) {
      this.tasks = this.tasks.map((task) =>
        task.id === this.editingTaskId
          ? { ...task, title: this.editingTask }
          : task
      );
    }
    this.closeEditMode();
  }

  closeEditMode(): void {
    this.tasks = this.tasks.map((task) => ({ ...task, isEditing: false }));
    this.isEditingActive = false;
    this.editingTaskId = null;
  }
}
