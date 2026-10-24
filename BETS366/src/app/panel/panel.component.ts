import { Component, OnInit } from '@angular/core';
import { Api } from '../services/api';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Match } from '../match';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PanelComponent implements OnInit {

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

  getEscudoUrl(teamName: string): string {
    const fileName = this.logos[teamName];

    if (fileName) {
      return `assets/escudos/${fileName}`;
    }

    return 'assets/escudos/default-logo.png';
  }

  public matches: Match[] = [];
  public filteredMatches: Match[] = [];

  public filterStatus: string = 'all';
  public searchTerm: string = '';
  public isLoading: boolean = true;

  public currentUser: any = {
    username: 'Cargando...',
    profilePic: 'assets/default-avatar.png',
  };

  public today: Date = new Date();
  private timer: any;

  constructor(private api: Api, public router: Router) { }

  async ngOnInit() {
    await this.loadUserData();
    this.timer = setInterval(() => {
      this.today = new Date();
    }, 1000);
    this.loadMatches();
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

  loadMatches() {
    this.isLoading = true;
    this.api.getMatches().subscribe({
      next: (data) => {
        this.matches = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando partidos:', err);
        this.isLoading = false;
      }
    });
  }

  handleSearch(event: any) {
    this.searchTerm = event.detail.value ? event.detail.value.toLowerCase() : '';
    this.applyFilters();
  }

  applyFilters() {
    if (!this.matches) return;

    this.filteredMatches = this.matches.filter(match => {
      const matchesSearch =
        match.home.toLowerCase().includes(this.searchTerm) ||
        match.away.toLowerCase().includes(this.searchTerm);

      const matchesStatus =
        this.filterStatus === 'all' ||
        match.status === this.filterStatus;

      return matchesSearch && matchesStatus;
    });
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }

  goToDetalles(id: number) {
    this.router.navigate(['/detalles', id]);
  }

  onLogout() {
    this.router.navigate(['/login']);
  }

  doRefresh(event: any) {
    this.api.getMatches().subscribe({
      next: (data) => {
        this.matches = data;
        this.applyFilters();
        event.target.complete();
      },
      error: () => event.target.complete()
    });
  }

  setFilter(status: string) {
    this.filterStatus = status;
    this.applyFilters();
  }

}
