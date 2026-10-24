import { Component, OnInit } from '@angular/core';
import { Api } from '../services/api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class HistorialComponent implements OnInit {
  public bets: any[] = [];
  public currentUser: any = { username: '', profilePic: '', id: null };
  public isLoading: boolean = true;

  public totalPoints: number = 0;
  public winRate: number = 0;
  public totalBets: number = 0;

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
    const { value } = await Preferences.get({ key: 'user_data' });
    if (value) {
      this.currentUser = JSON.parse(value);
      if (!this.currentUser.profilePic) {
        this.currentUser.profilePic = `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.currentUser.username}`;
      }
      this.loadUserBets(this.currentUser.id);
    }
  }

  loadUserBets(userId: number) {
    this.api.getUserBets(userId).subscribe({
      next: (data) => {
        this.bets = data.map(bet => {
          let points = 0;
          const m = bet.match;

          if (m && m.status === 'finished') {
            const actualHome = m.homeScore;
            const actualAway = m.awayScore;
            const predictedHome = bet.homeScore;
            const predictedAway = bet.awayScore;

            if (predictedHome === actualHome && predictedAway === actualAway) {
              points = 10;
            }
            else if (
              (predictedHome > predictedAway && actualHome > actualAway) ||
              (predictedHome < predictedAway && actualHome < actualAway) ||
              (predictedHome === predictedAway && actualHome === actualAway)
            ) {
              points = 5;
            }
          }
          return { ...bet, pointsCalculated: points };
        });

        this.calculateStats();
        this.isLoading = false;
      }
    });
  }

  calculateStats() {
    this.totalBets = this.bets.length;
    if (this.totalBets > 0) {
      this.totalPoints = this.bets.reduce((acc, bet) => acc + (bet.pointsCalculated || 0), 0);

      const wins = this.bets.filter(bet => bet.pointsCalculated > 0).length;
      this.winRate = Math.round((wins / this.totalBets) * 100);

      console.log('Puntos totales calculados para enviar:', this.totalPoints);
      this.syncPointsWithProfile();
    }
  }

  async syncPointsWithProfile() {
    const { value } = await Preferences.get({ key: 'user_data' });
    if (value) {
      const user = JSON.parse(value);
      user.points = this.totalPoints;
      await Preferences.set({ key: 'user_data', value: JSON.stringify(user) });
      this.currentUser.points = this.totalPoints;
    }

    this.api.updateProfile(this.currentUser.id, {
      points: this.totalPoints
    }).subscribe({
      next: () => console.log('Puntos sincronizados con éxito en el servidor'),
      error: (err) => console.error('Error: El servidor rechazó la actualización de puntos', err)
    });
  }

  getEscudoUrl(teamName: string): string {
    const fileName = this.logos[teamName];

    if (fileName) {
      return `assets/escudos/${fileName}`;
    }

    return 'assets/escudos/default-logo.png';
  }

  goTo(path: string) { this.router.navigate([path]); }
  onLogout() { this.router.navigate(['/login']); }
}