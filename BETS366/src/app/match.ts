export interface Match {
  id: number;
  jornada: number;
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  status: 'live' | 'pending' | 'finished';
  time: string;
  league: string;
  events: MatchEvent[];
  minute?: number;
}

export interface MatchEvent {
  type: string;
  team: string;
  player: string;
  playerId: number;
  playerAvatar: string;
  minute: number;
  score: string;
}