import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { Api } from '../services/api';
import { Router } from '@angular/router';
import { Mission } from '../moduls/missions';
import {
  gridOutline, compassOutline, medalOutline, logOutOutline,
  searchOutline, notificationsOutline, settingsOutline,
  star, locationOutline, addCircleOutline
} from 'ionicons/icons';
import { Ninja } from '../moduls/ninja';
import { Stats } from '../moduls/stats';

@Component({
  selector: 'app-misiones',
  templateUrl: './misiones.component.html',
  styleUrls: ['./misiones.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class MisionesComponent implements OnInit {
  misiones: Mission[] = [];
  misionesFiltradas: Mission[] = [];
  filtro: string = 'DISPONIBLE';
  usuario: Stats = {
    username: 'Guest',
    rank: 'genin',
    experience: 0,
    avatar: ''
  };

  ngOnInit() {
    this.cargarDatosUsuario();
  }

  ionViewWillEnter() {
    this.cargarMisiones();
  }

  constructor(private api: Api, private router: Router) {
    addIcons({
      'dashboard': gridOutline,
      'explore': compassOutline,
      'military-tech': medalOutline,
      'logout': logOutOutline,
      'search': searchOutline,
      'notifications': notificationsOutline,
      'settings': settingsOutline,
      'stars': star,
      'location': locationOutline,
      'mission-add': addCircleOutline
    });
  }

  cargarDatosUsuario() {
    this.api.getMeStats().subscribe({
      next: (res: any) => {
        this.usuario = res.profile;

        if (!this.usuario.avatar) {
          this.usuario.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.usuario.username}`;
        }
      }
    });
  }

  async onLogout() {
    await this.api.logout();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  cargarMisiones() {
    this.api.getMissions().subscribe({
      next: (res) => {
        this.misiones = res.data;
        this.cambiarFiltro('DISPONIBLE');
      },
      error: (err) => {
        console.error('Error de la API:', err);
      }
    });
  }

  cambiarFiltro(estado: string) {
    this.filtro = estado;
    this.misionesFiltradas = this.misiones.filter(m => m.status === estado);
  }

  verDetalles(id: string) {
    this.router.navigate(['detalles', id]);
  }

  buscarMisiones(event: any) {
    const texto = event.target.value.toLowerCase().trim();

    if (texto === '') {
      this.misionesFiltradas = this.misiones.filter(m => m.status === this.filtro);
      return;
    }

    this.misionesFiltradas = this.misiones.filter(m => {
      const coincideEstado = m.status === this.filtro;
      const coincideTexto = m.title.toLowerCase().includes(texto) ||
        m.rankRequirement.toLowerCase().includes(texto);

      return coincideEstado && coincideTexto;
    });
  }

}
