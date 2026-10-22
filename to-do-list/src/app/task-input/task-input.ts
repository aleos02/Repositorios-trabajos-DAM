import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-task-input',
  imports: [FormsModule],
  templateUrl: 'task-input.html',
  styleUrl: './task-input.css',
})
export class TaskInput {
  nombreTarea: string = '';

  @Output() addTask = new EventEmitter<string>();

  onAddTaskClick() {
    this.addTask.emit(this.nombreTarea);
  }
}
