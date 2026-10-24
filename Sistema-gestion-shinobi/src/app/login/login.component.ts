import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormsModule, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Api } from '../services/api';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { eye, eyeOff, shieldCheckmarkOutline, alertCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class LoginComponent {
  passwordVisible = false;
  loginForm: FormGroup;
  error: string | null = null;




  constructor(private fb: FormBuilder, private api: Api, private router: Router) {

    addIcons({
      'eye': eye,
      'eye-off': eyeOff,
      'shield-checkmark-outline': shieldCheckmarkOutline,
      'alert-circle-outline': alertCircleOutline
    });

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }


  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      const credenciales = { username, password };
      this.api.login(credenciales).subscribe({
        next: (res) => {
          this.router.navigate(['/misiones'], { replaceUrl: true });
        },
        error: (err) => {
          this.error = "Usuario o contraseña incorrectos, intenta de nuevo.";
        }
      });
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

}
