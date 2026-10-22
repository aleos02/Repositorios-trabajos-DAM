import { Component } from '@angular/core';
import { TaskItem} from '../task-item/task-item';
import { Input } from '@angular/core';
import { TaskInput } from '../task-input/task-input';

@Component({
  selector: 'app-task-list',
  imports: [TaskItem, TaskInput],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export class TaskList {
  @Input() tasks: string[] = [];

  onAddTask(nombreTarea: string) {
    this.tasks.push(nombreTarea);
  }

  onDeleteTask(nombreTarea: string) {
    this.tasks.splice(this.tasks.indexOf(nombreTarea), 1);
  }
}
