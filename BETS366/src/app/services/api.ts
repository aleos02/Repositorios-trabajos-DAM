import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, from, switchMap, map } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private baseURL = 'http://localhost:3000/api';
  private readonly TOKEN_KEY = 'token';

  constructor(private http: HttpClient) { }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.baseURL}/register`, userData)
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseURL}/login`, credentials).pipe(
      tap(async (res) => {
        if (res && res.token) {
          await Preferences.set({ key: this.TOKEN_KEY, value: res.token });
          await Preferences.set({
            key: 'user_data',
            value: JSON.stringify(res.user),
          });
        }
      })
    );
  }

  async logout(): Promise<void> {
    await Preferences.remove({ key: this.TOKEN_KEY });
    await Preferences.remove({ key: 'user_data' });
  }

  async getToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: this.TOKEN_KEY });
    return value;
  }


  getMatches(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseURL}/matches`);
  }

  getStandings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseURL}/league/standings`);
  }

  getMatchesByJornada(jornada: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseURL}/league/results/${jornada}`);
  }

  getMatchById(id: number): Observable<any> {
    return this.getHttpOptions().pipe(
      switchMap(options =>
        this.http.get(`${this.baseURL}/matches/${id}`, options)
      )
    );
  }

  postBet(betData: any): Observable<any> {
    return this.getHttpOptions().pipe(
      switchMap(options =>
        this.http.post(`${this.baseURL}/bets`, betData, options)
      )
    );
  }

  getUserBets(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseURL}/bets/user/${userId}`);
  }

  getLeaderboard(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseURL}/leaderboard`);
  }

  getResultsByJornada(jornada: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseURL}/league/results/${jornada}`);
  }

  getTeamPlayers(teamName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseURL}/teams/${teamName}/players`);
  }

  getTopScorers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseURL}/players/top-scorers`);
  }

  getSimulationState(): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/simulation/state`);
  }

  updateProfile(id: number, data: any): Observable<any> {
    return this.getHttpOptions().pipe(
      switchMap(options =>
        this.http.put(`${this.baseURL}/users/${id}`, data, options)
      )
    );
  }

  private getHttpOptions(): Observable<{ headers: HttpHeaders }> {
    return from(Preferences.get({ key: this.TOKEN_KEY })).pipe(
      map(res => {
        const token = res.value;
        return {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          })
        };
      })
    );
  }
}
