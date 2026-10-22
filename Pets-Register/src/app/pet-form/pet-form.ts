import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PetList } from '../pet-list/pet-list';

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PetList],
  templateUrl: './pet-form.html',
  styleUrl: './pet-form.css',
})
export class PetForm {
  private fb = inject(FormBuilder);
  pet = false;
  pet1 = { petName: '', petType: '', petAge: '', petMicrochip: false };

  @Output() addPet = new EventEmitter<any>();

  petForm = this.fb.nonNullable.group({
    petName: ['', [Validators.required, Validators.minLength(2)]],
    petType: ['', [Validators.required]],
    petAge: ['', [Validators.required, Validators.min(0)]],
    petMicrochip: [false],
  });

  get petName() { return this.petForm.get('petName'); }
  get petType() { return this.petForm.get('petType'); }
  get petAge() { return this.petForm.get('petAge'); }
  get petMicrochip() { return this.petForm.get('petMicrochip'); }

  onSubmit() {
    if (this.petForm.valid) {
      this.pet1 = this.petForm.getRawValue();
      this.pet = true;
      this.addPet.emit(this.petForm.getRawValue());
      this.petForm.reset();
    }
  }
}
