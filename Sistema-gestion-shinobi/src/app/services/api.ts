import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { from, switchMap, map } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { Auth } from '../moduls/auth';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private baseUrl = 'https://pr3-lista-misiones-konoha-backend.vercel.app';
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private http: HttpClient) { }

  register(ninjaData: Auth): Observable<any> {
    const credenciales = {
      username: ninjaData.username,
      password: ninjaData.password,
      rank: ninjaData.afiliacion
    }
    return this.http.post<any>(`${this.baseUrl}/auth/register`, credenciales);
  }

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/auth/login`, credentials).pipe(
      tap(async (res) => {
        if (res && res.token) {
          await Preferences.set({ key: this.TOKEN_KEY, value: res.token });
          await Preferences.set({
            key: 'user_data',
            value: JSON.stringify(res.ninja),
          });
        }
      }),
    );
  }

  getMeStats(): Observable<any> {
    return from(this.getToken()).pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.get<any>(`${this.baseUrl}/ninjas/me/stats`, { headers, });
      }),
    );
  }

  async getToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: this.TOKEN_KEY });
    return value;
  }

  async logout(): Promise<void> {
    await Preferences.remove({ key: this.TOKEN_KEY });
    await Preferences.remove({ key: 'user_data' });
  }

  getMissions() {
    return from(this.getToken()).pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.get<any>(`${this.baseUrl}/missions`, { headers });
      }),
    );
  }

  getMissionById(id: string): Observable<any> {
    return this.getMissions().pipe(
      map((res: any) => res.data.find((m: any) => m.id === id))
    );
  }

  aceptarMision(id: string): Observable<any> {
    return from(this.getToken()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        return this.http.patch(`${this.baseUrl}/missions/${id}/accept`, {}, { headers });
      })
    );
  }

  abandonarMision(id: string): Observable<any> {
    return from(this.getToken()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        return this.http.delete(`${this.baseUrl}/missions/${id}/abandon`, { headers });
      })
    );
  }

  completarMision(id: string): Observable<any> {
    return from(this.getToken()).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
        return this.http.post(`${this.baseUrl}/missions/${id}/report`, {}, { headers });
      })
    );
  }
}
