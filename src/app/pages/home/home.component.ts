import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, filter, fromEvent, tap } from 'rxjs';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  newTask: string = '';
  isEditingActive: boolean = false;
  editingTaskId: string | null = null;
  editingTask: string = '';

  submitObs$ = fromEvent<KeyboardEvent>(document, 'keyup').pipe(
    filter((e) => e.code === 'Enter' || e.code === 'Escape')
  );
  subscription?: Subscription;

  filter: 'none' | 'completed' | 'pending' = 'none';

  tasks$ = this.tasksService.tasks$;
  pendingTasksCounter$ = this.tasksService.pendingTasksCounter$;
  completedTasksCounter$ = this.tasksService.completedTasksCounter$;

  constructor(private router: Router, private tasksService: TasksService) {
    if (this.router.url === '/all') {
      this.filter = 'none';
      this.tasks$ = this.tasksService.tasks$;
    }
    if (this.router.url === '/completed') {
      this.filter = 'completed';
      this.tasks$ = this.tasksService.completedTasks$;
    }
    if (this.router.url === '/pending') {
      this.filter = 'pending';
      this.tasks$ = this.tasksService.pendingTasks$;
    }
  }

  ngOnInit(): void {
    this.submitSubscription();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  submitSubscription(): void {
    this.submitObs$.subscribe((e) => {
      if (this.isEditingActive) {
        if (e.code === 'Enter' && this.editingTaskId) {
          this.tasksService.editTask(this.editingTaskId, this.editingTask);
        }
        this.closeEditMode();
      }
      if (e.code === 'Enter' && this.newTask.trim().length > 0) {
        this.tasksService.addTask(this.newTask);
        this.newTask = '';
      }
    });
  }

  toggleTaskStatus(taskId: string): void {
    this.tasksService.toggleTaskStatus(taskId);
  }

  openEditMode(taskId: string): void {
    this.isEditingActive = true;
    this.editingTaskId = taskId;
    this.editingTask = this.tasksService.getTextFromTask(taskId);
  }

  closeEditMode(): void {
    this.isEditingActive = false;
    this.editingTaskId = null;
  }

  clearCompletedTasks(): void {
    this.tasksService.clearCompletedTasks();
  }
}
