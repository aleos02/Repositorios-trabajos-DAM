import { Component, OnInit } from '@angular/core';
import { Api } from '../services/api';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.component.html',
  styleUrls: ['./equipo.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class EquipoComponent implements OnInit {
  public teamName: string = '';
  public players: any[] = [];
  public currentUser: any = {};
  public isLoading: boolean = true;

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

  constructor(
    private api: Api,
    public router: Router,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    await this.loadUserData();
    this.route.params.subscribe(params => {
      this.teamName = params['name'];
      if (this.teamName) {
        this.loadPlayers();
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

  loadPlayers() {
    this.isLoading = true;
    this.api.getTeamPlayers(this.teamName).subscribe({
      next: (data) => {
        this.players = data.sort((a, b) => b.goals - a.goals);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando jugadores:', err);
        this.isLoading = false;
      }
    });
  }

  getEscudoUrl(): string {
    const fileName = this.logos[this.teamName];
    return fileName ? `assets/escudos/${fileName}` : 'assets/escudos/default-logo.png';
  }

  getAvatar(playerName: string) {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${playerName}`;
  }

  goTo(path: string) { this.router.navigate([path]); }
  onLogout() { this.router.navigate(['/login']); }
}