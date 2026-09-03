import React, { useState } from 'react';
import { UserPlus, Trash2, Edit2, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Player, Language } from '../types';
import { ALGERIAN_PLAYER_PALETTE, saveStoredPlayers } from '../data/players';
import { t } from '../data/translations';
import { audioManager } from '../utils/audioManager';
import { CornerBorders } from './CornerBorders';

interface PlayerManagementProps {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  lang: Language;
  onContinue: () => void;
}

export const PlayerManagement: React.FC<PlayerManagementProps> = ({
  players,
  setPlayers,
  lang,
  onContinue,
}) => {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedColor, setSelectedColor] = useState(ALGERIAN_PLAYER_PALETTE[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newPlayerName.trim();
    if (!trimmed) return;

    audioManager.playQuack();
    const newPlayer: Player = {
      id: 'p_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name: trimmed,
      color: selectedColor,
      isTempOut: false,
    };

    const nextPlayers = [...players, newPlayer];
    setPlayers(nextPlayers);
    saveStoredPlayers(nextPlayers);
    setNewPlayerName('');
    setErrorMsg('');

    // Rotate color to next in palette
    const nextColorIndex = (ALGERIAN_PLAYER_PALETTE.indexOf(selectedColor) + 1) % ALGERIAN_PLAYER_PALETTE.length;
    setSelectedColor(ALGERIAN_PLAYER_PALETTE[nextColorIndex]);
  };

  const handleDeletePlayer = (id: string) => {
    if (players.length <= 2) {
      setErrorMsg(t('minPlayersWarning', lang));
      return;
    }
    audioManager.playDeletePlayer(); // plays yyy_ahqVbsA delete sound!
    const nextPlayers = players.filter(p => p.id !== id);
    setPlayers(nextPlayers);
    saveStoredPlayers(nextPlayers);
    setErrorMsg('');
  };

  const startRename = (player: Player) => {
    audioManager.playQuack();
    setEditingId(player.id);
    setEditingName(player.name);
  };

  const saveRename = (id: string) => {
    const trimmed = editingName.trim();
    if (!trimmed) return;
    audioManager.playQuack();
    const nextPlayers = players.map(p => (p.id === id ? { ...p, name: trimmed } : p));
    setPlayers(nextPlayers);
    saveStoredPlayers(nextPlayers);
    setEditingId(null);
    setEditingName('');
  };

  const changePlayerColor = (id: string, newColor: string) => {
    audioManager.playQuack();
    const nextPlayers = players.map(p => (p.id === id ? { ...p, color: newColor } : p));
    setPlayers(nextPlayers);
    saveStoredPlayers(nextPlayers);
  };

  const handleProceed = () => {
    if (players.length < 2) {
      setErrorMsg(t('minPlayersWarning', lang));
      return;
    }
    audioManager.playQuack();
    onContinue();
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-[calc(100vh-80px)] flex flex-col justify-between p-4 select-none">
      <div className="space-y-4">
        {/* Title Header */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
            {t('managePlayers', lang)}
          </h2>
          <p className="text-xs text-slate-400">
            {t('playerSettingsNotice', lang)}
          </p>
        </div>

        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold text-center">
            {errorMsg}
          </div>
        )}

        {/* Add Player Input Form with Corner Borders & Glass */}
        <form onSubmit={handleAddPlayer} className="relative p-4 rounded-3xl bg-slate-900/90 border border-white/20 backdrop-blur-md space-y-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_24px_rgba(0,0,0,0.3)] overflow-hidden">
          <CornerBorders color="border-white/25" size="w-3 h-3" />
          <div className="flex gap-2">
            <input
              id="input-new-player"
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder={t('playerNamePlaceholder', lang)}
              maxLength={20}
              className="flex-1 bg-slate-800/90 border border-white/15 rounded-2xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400 shadow-inner"
            />
            <button
              id="btn-add-player"
              type="submit"
              disabled={!newPlayerName.trim()}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm flex items-center gap-1.5 border border-white/30 hover:brightness-105 active:scale-95 disabled:opacity-40 transition shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t('addPlayer', lang)}</span>
            </button>
          </div>

          {/* Color Picker Swatches */}
          <div className="flex items-center justify-between gap-1.5 pt-1 overflow-x-auto py-1">
            {ALGERIAN_PLAYER_PALETTE.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedColor(c)}
                className={`w-7 h-7 rounded-full transition-transform shrink-0 border border-white/20 ${
                  selectedColor === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'hover:scale-110 opacity-80'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </form>

        {/* Player Roster Cards */}
        <div className="space-y-2 max-h-[46vh] overflow-y-auto pr-1">
          <AnimatePresence>
            {players.map((player) => {
              const isEditing = editingId === player.id;
              return (
                <motion.div
                  key={player.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-white/15 hover:border-white/30 backdrop-blur-md transition shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Color bubble */}
                    <div className="relative group">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-slate-950 text-xs shadow-md shrink-0 cursor-pointer border border-white/25"
                        style={{ backgroundColor: player.color }}
                        title="Click to cycle color"
                        onClick={() => {
                          const curr = ALGERIAN_PLAYER_PALETTE.indexOf(player.color);
                          const next = ALGERIAN_PLAYER_PALETTE[(curr + 1) % ALGERIAN_PLAYER_PALETTE.length];
                          changePlayerColor(player.id, next);
                        }}
                      >
                        {player.name.charAt(0)}
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="bg-slate-800 border border-white/20 rounded-xl px-2.5 py-1 text-sm text-slate-100 flex-1 focus:outline-none focus:border-amber-400"
                          autoFocus
                        />
                        <button
                          onClick={() => saveRename(player.id)}
                          className="p-1.5 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 border border-white/30 shadow"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="truncate">
                        <span className="font-bold text-slate-100 text-base">{player.name}</span>
                      </div>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <button
                        onClick={() => startRename(player)}
                        className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800/80 border border-white/10 hover:border-white/25 transition"
                        title={t('rename', lang)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePlayer(player.id)}
                        className="p-2 rounded-xl text-rose-300 hover:text-white bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/30 transition"
                        title={t('delete', lang)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Continue Button */}
      <div className="pt-4">
        <button
          id="btn-players-continue"
          onClick={handleProceed}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 text-slate-950 font-black text-lg border border-white/35 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.6),0_8px_24px_rgba(245,158,11,0.35)] hover:brightness-105 active:scale-95 transition flex items-center justify-center gap-2"
        >
          <span>{t('continue', lang)}</span>
          {lang === 'ar' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};
