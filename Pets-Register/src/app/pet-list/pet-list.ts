import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pet-list',
  imports: [],
  templateUrl: './pet-list.html',
  styleUrl: './pet-list.css',
})
export class PetList {
  @Input() pet!: { petName: string; petType: string; petAge: string; petMicrochip: boolean };
  
}
