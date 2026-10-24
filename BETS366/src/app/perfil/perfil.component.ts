import { Component, OnInit } from '@angular/core';
import { Api } from '../services/api';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class PerfilComponent implements OnInit {
  public currentUser: any = {};
  public newUsername: string = '';
  public selectedAvatarIcon: string = 'person';

  public avatarIcons: string[] = [
    'person', 'sports_soccer', 'star', 'emoji_events',
    'military_tech', 'workspace_premium', 'groups',
    'rocket_launch', 'local_fire_department', 'bolt'
  ];

  constructor(private api: Api, public router: Router) { }

  async ngOnInit() {
    await this.loadUserData();
  }

  async loadUserData() {
    const { value } = await Preferences.get({ key: 'user_data' });
    if (value) {
      const user = JSON.parse(value);
      this.currentUser = {
        ...user,
        username: user.username || 'Usuario',
        profilePic: user.profilePic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
      };
      this.newUsername = this.currentUser.username;
      this.selectedAvatarIcon = user.avatar || 'person';
    }
  }

  selectIcon(icon: string) {
    this.selectedAvatarIcon = icon;
  }

  async saveChanges() {
    const updatedData = {
      username: this.newUsername,
      avatar: this.selectedAvatarIcon
    };

    this.api.updateProfile(this.currentUser.id, updatedData).subscribe(res => {
      Preferences.set({ key: 'user_data', value: JSON.stringify(res) });
      this.currentUser = {
        ...res,
        profilePic: `https://api.dicebear.com/7.x/avataaars/svg?seed=${res.username}`
      };
      alert('Perfil actualizado correctamente');
    });
  }

  goTo(path: string) { this.router.navigate([path]); }
  async onLogout() { await this.api.logout(); this.router.navigate(['/login']); }
}