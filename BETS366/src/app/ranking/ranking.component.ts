import { Component, OnInit } from '@angular/core';
import { Api } from '../services/api';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class RankingComponent implements OnInit {
  public leaderboard: any[] = [];
  public topThree: any[] = [];
  public currentUser: any = {};

  constructor(private api: Api, public router: Router) { }

  async ngOnInit() {
    await this.loadUserData();
    this.loadLeaderboard();
  }

  async loadUserData() {
    const { value } = await Preferences.get({ key: 'user_data' });
    if (value) {
      const user = JSON.parse(value);
      this.currentUser = {
        username: user.username || 'Usuario',
        profilePic: user.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
        points: user.points || 0
      };
    }
  }

  loadLeaderboard() {
    this.api.getLeaderboard().subscribe(data => {
      const updatedLeaderboard = data.map(u => {
        if (u.username === this.currentUser.username) {
          return { ...u, points: this.currentUser.points };
        }
        return u;
      });

      this.leaderboard = updatedLeaderboard.sort((a, b) => b.points - a.points);

      this.topThree = this.leaderboard.slice(0, 3);
    });
  }

  getAvatar(username: string) {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
  }

  goTo(path: string) { this.router.navigate([path]); }

  onLogout() { this.router.navigate(['/login']); }
}
