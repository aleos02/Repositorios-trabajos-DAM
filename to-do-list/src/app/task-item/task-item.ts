import { Component, Output, Input } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-item',
  imports: [FormsModule],
  templateUrl: './task-item.html',
  styleUrl: './task-item.css',
})
export class TaskItem {
  @Output() deleteTask = new EventEmitter<string>();
  @Input() nombreTarea: string|undefined;

  onDeleteTaskClick() {
    if(this.nombreTarea) {
      this.deleteTask.emit(this.nombreTarea);
    }
  }
}
