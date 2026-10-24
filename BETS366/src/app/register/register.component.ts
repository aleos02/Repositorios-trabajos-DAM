import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Api } from '../services/api';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [FormsModule, CommonModule, IonicModule]
})
export class RegisterComponent {
  registerData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  error: string = "";

  constructor(private api: Api, private router: Router) { }

  onRegister() {
    this.error = "";
    const { username, email, password } = this.registerData;

    if (!username || !email || !password) {
      this.error = "Completa todos los campos para continuar.";
      return;
    }

    this.api.register({ username, email, password }).subscribe({
      next: (res) => {
        this.router.navigate(['/login'], { replaceUrl: true });
      },
      error: (err) => {
        this.error = err.error?.error || "Error al crear la cuenta.";
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
