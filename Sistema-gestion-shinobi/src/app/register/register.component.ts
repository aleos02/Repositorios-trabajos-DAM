import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { Api } from '../services/api';
import { Router } from '@angular/router';
import { personOutline, lockClosedOutline, shieldOutline, flashOutline, personAddOutline } from 'ionicons/icons';
import { Auth } from '../moduls/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class RegisterComponent {
  error: string | null = null;
  ninjaData: Auth = {
    username: '',
    password: '',
    afiliacion: 'genin'
  }

  constructor(private api: Api, private router: Router) {
    addIcons({
      'swords': flashOutline,
      'person': personOutline,
      'lock': lockClosedOutline,
      'shield': shieldOutline,
      'person-add': personAddOutline
    });
  }


  onRegister() {
    if (!this.ninjaData.username || !this.ninjaData.password) {
      this.error = "Usuario o contraseña vacios, intenta de nuevo.";
      return;
    }

    this.api.register(this.ninjaData).subscribe({
      next: (res) => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = "Error al registrar, intenta de nuevo.";
      }
    });
  }


}
