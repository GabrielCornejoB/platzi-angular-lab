import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PendingTasksPipe } from './pipes/pending-tasks.pipe';
import { AllComponent } from './components/all/all.component';
import { PendingComponent } from './components/pending/pending.component';
import { CompletedComponent } from './components/completed/completed.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, PendingTasksPipe, AllComponent, PendingComponent, CompletedComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
