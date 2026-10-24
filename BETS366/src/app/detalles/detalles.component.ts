import { Component, OnInit } from '@angular/core';
import { Api } from '../services/api';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles.component.html',
  styleUrls: ['./detalles.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class DetallesComponent implements OnInit {
  public match: any;
  public betHomeScore: number = 0;
  public betAwayScore: number = 0;
  public isSavingBet: boolean = false;
  public currentUser: any = {
    username: '',
    profilePic: `https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder`,
    id: null
  };

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

  constructor(private api: Api, private route: ActivatedRoute, public router: Router) { }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadMatchDetails(parseInt(id));
    }
    const { value } = await Preferences.get({ key: 'user_data' });
    if (value) {
      const user = JSON.parse(value);
      this.currentUser = {
        ...user,
        username: user.username || 'Usuario',
        profilePic: user.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
      };
    }
  }

  loadMatchDetails(id: number) {
    this.api.getMatchById(id).subscribe({
      next: (data) => {
        const rawMatch = Array.isArray(data) ? data[0] : data;

        if (rawMatch) {
          rawMatch.status = rawMatch.status.trim().toLowerCase();

          if (typeof rawMatch.goals === 'string') {
            try { rawMatch.goals = JSON.parse(rawMatch.goals); } catch { rawMatch.goals = []; }
          }

          this.match = rawMatch;
        }
        console.log('Partido procesado:', this.match);
      },
      error: (err) => console.error('Error al cargar detalles:', err)
    });
  }

  placeBet() {
    this.isSavingBet = true;
    const betData = {
      userId: this.currentUser.id,
      matchId: this.match.id,
      homeScore: this.betHomeScore,
      awayScore: this.betAwayScore
    };

    this.api.postBet(betData).subscribe({
      next: (res) => {
        alert('¡Apuesta realizada con éxito!');
        this.isSavingBet = false;
      },
      error: (err) => {
        alert(err.error.error || 'Error al apostar');
        this.isSavingBet = false;
      }
    });
  }

  getEscudoUrl(teamName: string): string {
    const fileName = this.logos[teamName];

    if (fileName) {
      return `assets/escudos/${fileName}`;
    }

    return 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Logo_unknown.png';
  }
  goBack() { this.router.navigate(['/panel']); }

  goTo(path: string) {
    this.router.navigate([path]);
  }

  onLogout() {
    this.router.navigate(['/login']);
  }
}
