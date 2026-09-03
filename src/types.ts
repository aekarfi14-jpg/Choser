export type Language = 'ar' | 'en';

export type GameMode = 'dare' | 'truth';

export type Screen =
  | 'main_menu'
  | 'player_management'
  | 'mode_selection'
  | 'dare_view'
  | 'dare_animation'
  | 'finger_screen'
  | 'winner_reveal'
  | 'dare_execute'
  | 'truth_prepare'
  | 'truth_category'
  | 'truth_question'
  | 'camera_media'
  | 'round_end';

export interface Player {
  id: string;
  name: string;
  color: string;
  isTempOut?: boolean;
}

export type TruthCategoryKey =
  | 'embarrassing'
  | 'emotional'
  | 'weird'
  | 'truth_reveal'
  | 'funny'
  | 'personal'
  | 'relationships'
  | 'scenarios'
  | 'random';

export interface TruthCategory {
  id: TruthCategoryKey;
  titleAr: string;
  titleEn: string;
  emoji: string;
}

export interface SavedMediaItem {
  id: string;
  type: 'photo' | 'video';
  url: string;
  blob?: Blob;
  date: string;
  playerName: string;
  mode: GameMode;
  challengeText: string;
}

export interface TouchPoint {
  identifier: number;
  x: number;
  y: number;
  assignedPlayerId?: string;
  color?: string;
  startTime: number;
}
