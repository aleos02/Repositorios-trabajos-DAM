import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Api } from '../services/api';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginComponent {

  constructor(private router: Router, private api: Api) { }

  showPassword = false;
  error: string = "";

  loginData = {
    email: '',
    password: ''
  };

  onLogin() {
    this.error = "";

    if (!this.loginData.email || !this.loginData.password) {
      this.error = "Por favor, completa todos los campos.";
      return;
    }

    this.api.login(this.loginData).subscribe({
      next: (res) => {
        this.router.navigate(['/panel'], { replaceUrl: true });
      },
      error: (err) => {
        this.error = "Correo o contraseña incorrectos, intenta de nuevo.";
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

}
