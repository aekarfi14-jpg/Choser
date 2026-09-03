import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserPlus, UserCheck, UserX, AlertCircle, Sparkles } from 'lucide-react';
import { Player, Language, GameMode, TouchPoint } from '../types';
import { DareQuestion } from '../data/dareData';
import { ALGERIAN_PLAYER_PALETTE, saveStoredPlayers } from '../data/players';
import { t } from '../data/translations';
import { audioManager } from '../utils/audioManager';
import { CornerBorders } from './CornerBorders';

interface FingerScreenProps {
  mode: GameMode;
  dare?: DareQuestion;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  lang: Language;
  onWinnerSelected: (winner: Player) => void;
}

export const FingerScreen: React.FC<FingerScreenProps> = ({
  mode,
  dare,
  players,
  setPlayers,
  lang,
  onWinnerSelected,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTouches, setActiveTouches] = useState<TouchPoint[]>([]);
  const [tensionActive, setTensionActive] = useState(false);
  const [tensionProgress, setTensionProgress] = useState(0); // 0 to 100
  const [winnerReveal, setWinnerReveal] = useState<{ player: Player; x: number; y: number } | null>(null);
  const [showAddLateModal, setShowAddLateModal] = useState(false);
  const [lateName, setLateName] = useState('');

  // Active participating players (excluding temporary out)
  const activePlayers = useMemo(() => {
    return players.filter((p) => !p.isTempOut);
  }, [players]);

  const requiredCount = activePlayers.length;

  const tensionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const tensionStartTimeRef = useRef<number>(0);
  const tensionDurationRef = useRef<number>(7000); // 6000 to 10000 ms
  const progressAnimRef = useRef<number | null>(null);

  // Helper to assign a unique player color to a touch
  const getTouchColor = useCallback((index: number) => {
    if (activePlayers[index]) return activePlayers[index].color;
    return ALGERIAN_PLAYER_PALETTE[index % ALGERIAN_PLAYER_PALETTE.length];
  }, [activePlayers]);

  // Cancel tension if fingers lift
  const cancelTension = useCallback(() => {
    if (tensionTimerRef.current) {
      clearTimeout(tensionTimerRef.current);
      tensionTimerRef.current = null;
    }
    if (progressAnimRef.current) {
      cancelAnimationFrame(progressAnimRef.current);
      progressAnimRef.current = null;
    }
    setTensionActive(false);
    setTensionProgress(0);
    audioManager.stopTensionSound();
  }, []);

  // Trigger winner selection
  const triggerWinner = useCallback((currentTouches: TouchPoint[]) => {
    cancelTension();
    if (currentTouches.length === 0 || activePlayers.length === 0) return;

    // Pick random touch point and random active player
    const winningTouchIndex = Math.floor(Math.random() * currentTouches.length);
    const winningTouch = currentTouches[winningTouchIndex];
    const winningPlayer = activePlayers[winningTouchIndex % activePlayers.length];

    audioManager.playSiuuu(); // Winner reveal sound!

    // Trigger haptic if on Android / mobile
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([100, 50, 200]);
    }

    setWinnerReveal({
      player: winningPlayer,
      x: winningTouch.x,
      y: winningTouch.y,
    });

    // Proceed to next phase after dramatic reveal animation
    setTimeout(() => {
      onWinnerSelected(winningPlayer);
    }, 2800);
  }, [activePlayers, cancelTension, onWinnerSelected]);

  // Start tension countdown: strictly 3 to 6 seconds (3000ms - 6000ms)
  const startTension = useCallback((currentTouches: TouchPoint[]) => {
    if (tensionTimerRef.current || winnerReveal) return;

    // Random strictly between 3000ms and 6000ms (3 to 6 seconds)
    const randomDuration = Math.floor(Math.random() * (6000 - 3000 + 1)) + 3000;
    tensionDurationRef.current = randomDuration;
    tensionStartTimeRef.current = Date.now();
    setTensionActive(true);

    audioManager.startTensionSound(randomDuration / 1000);

    // Animate tension progress
    const updateProgress = () => {
      const elapsed = Date.now() - tensionStartTimeRef.current;
      const progress = Math.min(100, (elapsed / tensionDurationRef.current) * 100);
      setTensionProgress(progress);

      if (elapsed < tensionDurationRef.current) {
        progressAnimRef.current = requestAnimationFrame(updateProgress);
      }
    };
    progressAnimRef.current = requestAnimationFrame(updateProgress);

    tensionTimerRef.current = setTimeout(() => {
      triggerWinner(currentTouches);
    }, randomDuration);
  }, [triggerWinner, winnerReveal]);

  // Evaluate touches count against required participating players
  const evaluateTouchTension = useCallback((touches: TouchPoint[]) => {
    if (winnerReveal) return;

    if (touches.length >= requiredCount && requiredCount >= 2) {
      if (!tensionTimerRef.current) {
        startTension(touches);
      }
    } else {
      cancelTension();
    }
  }, [cancelTension, requiredCount, startTension, winnerReveal]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cancelTension();
    };
  }, [cancelTension]);

  // --- Touch Event Handlers ---
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (winnerReveal) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const newTouches: TouchPoint[] = [];
    for (let i = 0; i < e.touches.length; i++) {
      const tItem = e.touches[i];
      newTouches.push({
        identifier: tItem.identifier,
        x: tItem.clientX - rect.left,
        y: tItem.clientY - rect.top,
        color: getTouchColor(i),
        startTime: Date.now(),
      });
    }

    audioManager.playTouchPop(300 + newTouches.length * 80);
    setActiveTouches(newTouches);
    evaluateTouchTension(newTouches);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (winnerReveal) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const updated = activeTouches.map((at) => {
      for (let i = 0; i < e.touches.length; i++) {
        const tItem = e.touches[i];
        if (tItem.identifier === at.identifier) {
          return {
            ...at,
            x: tItem.clientX - rect.left,
            y: tItem.clientY - rect.top,
          };
        }
      }
      return at;
    });

    setActiveTouches(updated);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (winnerReveal) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const remaining: TouchPoint[] = [];
    for (let i = 0; i < e.touches.length; i++) {
      const tItem = e.touches[i];
      const existing = activeTouches.find((at) => at.identifier === tItem.identifier);
      if (existing) {
        remaining.push({
          ...existing,
          x: tItem.clientX - rect.left,
          y: tItem.clientY - rect.top,
        });
      }
    }

    setActiveTouches(remaining);
    evaluateTouchTension(remaining);
  };

  // Pointer / Mouse emulation for desktop testing
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only use pointer event if no touches
    if (e.pointerType === 'touch' || winnerReveal) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const newTouch: TouchPoint = {
      identifier: e.pointerId,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      color: getTouchColor(activeTouches.length),
      startTime: Date.now(),
    };

    const next = [...activeTouches.filter((t) => t.identifier !== e.pointerId), newTouch];
    audioManager.playTouchPop(350);
    setActiveTouches(next);
    evaluateTouchTension(next);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch' || winnerReveal) return;
    const next = activeTouches.filter((t) => t.identifier !== e.pointerId);
    setActiveTouches(next);
    evaluateTouchTension(next);
  };

  // Toggle player temporary out/in
  const togglePlayerTempOut = (id: string) => {
    audioManager.playQuack();
    const updated = players.map((p) => (p.id === id ? { ...p, isTempOut: !p.isTempOut } : p));
    setPlayers(updated);
    saveStoredPlayers(updated);
    cancelTension();
  };

  // Add late player
  const handleAddLatePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = lateName.trim();
    if (!trimmed) return;
    audioManager.playQuack();

    const newP: Player = {
      id: 'p_late_' + Date.now(),
      name: trimmed,
      color: ALGERIAN_PLAYER_PALETTE[players.length % ALGERIAN_PLAYER_PALETTE.length],
      isTempOut: false,
    };

    const next = [...players, newP];
    setPlayers(next);
    saveStoredPlayers(next);
    setLateName('');
    setShowAddLateModal(false);
    cancelTension();
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] flex flex-col justify-between overflow-hidden select-none touch-none">
      {/* Dare Summary Banner (Only in Dare Mode, compact & non-intrusive) */}
      {mode === 'dare' && dare && (
        <div className="w-full px-4 pt-1 z-20 pointer-events-none">
          <div className="max-w-md mx-auto p-2.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 backdrop-blur-md shadow-lg flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-lg shrink-0">🔥</span>
              <p className="text-xs sm:text-sm font-bold text-rose-100 truncate">
                {lang === 'ar' ? dare.textAr : dare.textEn}
              </p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-500/30 text-rose-200 shrink-0">
              {t('dareMode', lang)}
            </span>
          </div>
        </div>
      )}

      {/* Main Touch Canvas Area */}
      <div
        ref={containerRef}
        id="finger-touch-surface"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className={`relative flex-1 w-full h-full cursor-pointer transition-colors duration-500 overflow-hidden ${
          tensionActive
            ? 'bg-rose-950/25 ring-8 ring-rose-500/40 ring-inset'
            : 'bg-slate-950/40'
        }`}
      >
        {/* Tension screen border pulse */}
        {tensionActive && (
          <motion.div
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="absolute inset-0 pointer-events-none border-4 border-amber-400 shadow-[inset_0_0_60px_rgba(245,158,11,0.4)]"
          />
        )}

        {/* Spacious Center Area (Loading info & player count removed per user request) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4 text-center z-10">
          {!winnerReveal && activeTouches.length === 0 && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.8 }}
              className="space-y-2 pointer-events-none"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-900/60 border border-slate-700/60 flex items-center justify-center text-2xl shadow-lg backdrop-blur-sm animate-bounce">
                👇
              </div>
              <p className="text-base sm:text-xl font-black text-slate-200 drop-shadow">
                {t('fingerInstruction', lang)}
              </p>
            </motion.div>
          )}
        </div>

        {/* Dynamic Multi-touch Circles */}
        {activeTouches.map((touch, i) => (
          <div
            key={touch.identifier ?? i}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-75"
            style={{
              left: `${touch.x}px`,
              top: `${touch.y}px`,
            }}
          >
            {/* Outer expanding pulsing wave */}
            <motion.div
              animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0.1, 0.6] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="absolute -inset-6 rounded-full border-2"
              style={{ borderColor: touch.color }}
            />

            {/* Neon Glow Aura */}
            <div
              className="absolute -inset-4 rounded-full blur-md opacity-70"
              style={{ backgroundColor: touch.color }}
            />

            {/* Core Circle with Gradient */}
            <div
              className="relative w-20 h-20 rounded-full flex items-center justify-center shadow-2xl border-4 border-white"
              style={{
                background: `radial-gradient(circle, ${touch.color} 30%, rgba(15,23,42,0.9) 100%)`,
              }}
            >
              <div className="w-6 h-6 rounded-full bg-white shadow-inner animate-pulse" />
            </div>
          </div>
        ))}

        {/* Winner Reveal Dramatic Fullscreen Animation */}
        <AnimatePresence>
          {winnerReveal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-40 flex flex-col items-center justify-center p-6 bg-black/60 backdrop-blur-md text-center overflow-hidden"
            >
              {/* Warm Golden Glow Flare */}
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-transparent to-purple-900/20 pointer-events-none" />
              {/* Expanding Shockwave from winner touch coordinate */}
              <motion.div
                initial={{ scale: 0.1, opacity: 1 }}
                animate={{ scale: 12, opacity: 0 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="absolute w-40 h-40 rounded-full pointer-events-none"
                style={{
                  left: `${winnerReveal.x - 80}px`,
                  top: `${winnerReveal.y - 80}px`,
                  backgroundColor: winnerReveal.player.color,
                }}
              />

              <motion.div
                initial={{ scale: 0.2, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 120 }}
                className="relative z-50 space-y-4 max-w-sm"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-sm shadow-xl">
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>{t('winnerChosen', lang)}</span>
                </div>

                {/* Player Avatar Circle */}
                <div className="relative mx-auto w-32 h-32 rounded-full p-2 bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shadow-2xl shadow-rose-500/50">
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center text-5xl font-black text-slate-950 shadow-inner"
                    style={{ backgroundColor: winnerReveal.player.color }}
                  >
                    {winnerReveal.player.name.charAt(0)}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-4xl sm:text-5xl font-black text-white tracking-wide drop-shadow-lg">
                    {winnerReveal.player.name}
                  </h3>
                  <p className="text-sm sm:text-base font-bold text-amber-300">
                    {mode === 'dare'
                      ? (lang === 'ar' ? 'يا خويا دورك في الجرأة! 😂' : 'Your turn to face the dare! 😂')
                      : (lang === 'ar' ? 'حضّر روحك لأسئلة الصراحة!' : 'Prepare for truth questions!')}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Live In-Game Player Management Bar (Bottom compact strip) */}
      <div className="w-full px-4 py-2.5 bg-slate-900/90 border-t border-white/15 backdrop-blur-md z-20 select-none">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2 overflow-x-auto py-1">
          {/* Active / Away Toggles for Players */}
          <div className="flex items-center gap-1.5 overflow-x-auto pr-1">
            {players.map((p) => (
              <button
                key={p.id}
                onClick={() => togglePlayerTempOut(p.id)}
                title={p.isTempOut ? t('rejoin', lang) : t('tempExit', lang)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 ${
                  p.isTempOut
                    ? 'bg-slate-900/60 text-slate-500 line-through border border-white/10'
                    : 'bg-slate-800/90 text-slate-100 border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] hover:border-white/40'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/30"
                  style={{ backgroundColor: p.isTempOut ? '#64748b' : p.color }}
                />
                <span className="truncate max-w-[70px]">{p.name}</span>
                {p.isTempOut ? (
                  <UserX className="w-3 h-3 text-rose-400" />
                ) : (
                  <UserCheck className="w-3 h-3 text-emerald-400" />
                )}
              </button>
            ))}
          </div>

          {/* Add Late Player Button */}
          <button
            id="btn-add-late-player"
            onClick={() => {
              audioManager.playQuack();
              setShowAddLateModal(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center gap-1.5 hover:bg-amber-500/30 hover:border-amber-400/70 transition shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('addPlayer', lang)}</span>
          </button>
        </div>
      </div>

      {/* Add Late Player Modal */}
      <AnimatePresence>
        {showAddLateModal && (
          <div
            id="modal-add-late-player-backdrop"
            onClick={() => setShowAddLateModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xs p-5 rounded-3xl bg-slate-900/95 border border-white/20 shadow-2xl backdrop-blur-xl space-y-3 overflow-hidden"
            >
              <CornerBorders color="border-white/20" size="w-3 h-3" />
              <h4 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-amber-400" />
                <span>{t('addPlayer', lang)}</span>
              </h4>
              <form onSubmit={handleAddLatePlayer} className="space-y-3">
                <input
                  type="text"
                  value={lateName}
                  onChange={(e) => setLateName(e.target.value)}
                  placeholder={t('playerNamePlaceholder', lang)}
                  autoFocus
                  className="w-full bg-slate-800/90 border border-white/15 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-400 shadow-inner"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddLateModal(false)}
                    className="flex-1 py-2 rounded-xl bg-slate-800/80 border border-white/15 text-slate-300 text-xs font-bold hover:bg-slate-700 transition"
                  >
                    {t('cancel', lang)}
                  </button>
                  <button
                    type="submit"
                    disabled={!lateName.trim()}
                    className="flex-1 py-2 rounded-xl bg-amber-500 border border-white/25 text-slate-950 text-xs font-bold hover:bg-amber-400 disabled:opacity-40 shadow-md transition"
                  >
                    {t('save', lang)}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
