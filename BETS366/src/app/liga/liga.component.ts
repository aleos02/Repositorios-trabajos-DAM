import { Component, OnInit } from '@angular/core';
import { Api } from '../services/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-liga',
  templateUrl: './liga.component.html',
  styleUrls: ['./liga.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class LigaComponent implements OnInit {
  public standings: any[] = [];
  public matchdayMatches: any[] = [];
  public currentMatchday: number = 1;
  public currentUser: any = {};

  private readonly logos: { [key: string]: string } = {
    'Real Madrid': 'real_madrid.png',
    'FC Barcelona': 'fc_barcelona.png',
    'Atlético Madrid': 'atletico.png',
    'Real Sociedad': 'real_sociedad.png',
    'Villarreal': 'villarreal.png',
    'Sevilla FC': 'sevilla.png',
    'Real Betis': 'betis.png',
    'Athletic Club': 'athletic.png',
    'Girona FC': 'girona.png',
    'Valencia CF': 'valencia.png',
    'Osasuna': 'osasuna.png',
    'Getafe CF': 'getafe.png',
    'Rayo Vallecano': 'rayo.png',
    'RCD Mallorca': 'mallorca.png',
    'Celta de Vigo': 'celta.png',
    'UD Almería': 'almeria.png',
    'Granada CF': 'granada.png',
    'Cádiz CF': 'cadiz.png',
    'Deportivo Alavés': 'alaves.png',
    'UD Las Palmas': 'las_palmas.png'
  };

  constructor(private api: Api, public router: Router) { }

  async ngOnInit() {
    await this.loadUserData();
    this.loadStandings();
    this.api.getSimulationState().subscribe({
      next: (state) => {
        this.currentMatchday = state.jornada || 1;
        this.loadMatchday(this.currentMatchday);
      },
      error: (e) => {
        console.error('Error al obtener estado de simulación', e);
        this.loadMatchday(this.currentMatchday);
      }
    });
  }

  async loadUserData() {
    const { value } = await Preferences.get({ key: 'user_data' });
    if (value) {
      const user = JSON.parse(value);
      this.currentUser = {
        username: user.username || 'Usuario',
        profilePic: user.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
      };
    }
  }

  loadStandings() {
    this.api.getStandings().subscribe({
      next: (data) => {
        this.standings = data;
        if (data.length > 0) {
          console.log('Estructura del primer equipo:', data[0]);
        }
      },
      error: (e) => console.error('Error al cargar clasificación', e)
    });
  }

  loadMatchday(jornada: number) {
    this.api.getMatchesByJornada(jornada).subscribe(data => {
      this.matchdayMatches = data;
    });
  }

  changeMatchday(delta: number) {
    this.currentMatchday += delta;
    this.loadMatchday(this.currentMatchday);
  }

  getEscudoUrl(teamName: string): string {
    const fileName = this.logos[teamName];

    if (fileName) {
      return `assets/escudos/${fileName}`;
    }

    return 'assets/escudos/default-logo.png';
  }

  verEquipo(teamName: string) {
    if (!teamName) return;
    this.router.navigate(['/equipo', teamName]);
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }

  onLogout() {
    this.router.navigate(['/login']);
  }
}
