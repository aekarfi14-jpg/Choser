import { Player } from '../types';

export const ALGERIAN_PLAYER_PALETTE = [
  '#06b6d4', // Cyan
  '#f43f5e', // Rose
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#3b82f6', // Blue
  '#14b8a6', // Teal
  '#ef4444', // Red
  '#84cc16', // Lime
];

export const DEFAULT_PLAYERS: Player[] = [
  { id: 'p1', name: 'أمين', color: '#06b6d4', isTempOut: false },
  { id: 'p2', name: 'ياسين', color: '#f43f5e', isTempOut: false },
  { id: 'p3', name: 'سارة', color: '#10b981', isTempOut: false },
  { id: 'p4', name: 'إيناس', color: '#f59e0b', isTempOut: false },
];

export function getStoredPlayers(): Player[] {
  try {
    const saved = localStorage.getItem('shooser_players');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return DEFAULT_PLAYERS;
}

export function saveStoredPlayers(players: Player[]) {
  try {
    localStorage.setItem('shooser_players', JSON.stringify(players));
  } catch {}
}
