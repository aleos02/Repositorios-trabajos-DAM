import { Component, signal } from '@angular/core';
import { TaskList } from './task-list/task-list';

@Component({
  selector: 'app-root',
  imports: [TaskList],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('to-do-list');

  addTask(nombreTarea: String) {
    
    '<p>Task added: {{nombreTarea}}</p>'
  }
}
