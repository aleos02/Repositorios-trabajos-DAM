import { Component, signal } from '@angular/core';
import { PetForm } from './pet-form/pet-form';
import { PetList } from './pet-list/pet-list';

@Component({
  selector: 'app-root',
  imports: [PetForm],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Pets');
}
