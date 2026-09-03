import React from 'react';
import { RotateCcw, Home, Trophy, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Player, Language } from '../types';
import { t } from '../data/translations';
import { audioManager } from '../utils/audioManager';
import { CornerBorders } from './CornerBorders';

interface RoundEndProps {
  winner: Player;
  lang: Language;
  onReplay: () => void;
  onMainMenu: () => void;
}

export const RoundEnd: React.FC<RoundEndProps> = ({
  winner,
  lang,
  onReplay,
  onMainMenu,
}) => {
  const handleReplay = () => {
    audioManager.playQuack();
    onReplay();
  };

  const handleMainMenu = () => {
    audioManager.playQuack();
    onMainMenu();
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-[calc(100vh-80px)] flex flex-col justify-between p-4 select-none">
      <div className="space-y-6 my-auto text-center">
        {/* Celebration Trophy Badge */}
        <motion.div
          initial={{ scale: 0.5, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 10 }}
          className="relative mx-auto w-32 h-32 rounded-3xl p-2 bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-600 shadow-2xl shadow-amber-500/30 flex items-center justify-center border border-white/30"
        >
          <div className="w-full h-full rounded-2xl bg-slate-950 flex flex-col items-center justify-center text-5xl">
            🎉
          </div>
          <div className="absolute -top-3 -right-3 p-2.5 rounded-full bg-amber-400 text-slate-950 shadow-lg border border-white/40">
            <Trophy className="w-5 h-5 fill-slate-950" />
          </div>
        </motion.div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'سهرة هايلة!' : 'Great Round!'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white">
            {lang === 'ar' ? 'انتهت الجولة بنجاح!' : 'Round Completed!'}
          </h2>
          <p className="text-sm text-slate-300">
            {lang === 'ar'
              ? `يعطيك الصحة ${winner.name} على الروح الرياضية! 😂`
              : `Shout out to ${winner.name} for being a good sport! 😂`}
          </p>
        </div>
      </div>

      {/* Two Essential Bottom Action Buttons with Glassy Edges & Defined Colors */}
      <div className="space-y-3 pt-4">
        {/* Replay with Same Players */}
        <button
          id="btn-replay-round"
          onClick={handleReplay}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 text-slate-950 font-black text-lg border border-white/35 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.6),0_8px_24px_rgba(245,158,11,0.35)] hover:brightness-105 active:scale-95 transition flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>{t('replaySamePlayers', lang)}</span>
        </button>

        {/* Main Menu */}
        <button
          id="btn-return-main-menu"
          onClick={handleMainMenu}
          className="w-full py-3.5 px-6 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/20 hover:border-amber-400/60 text-slate-100 font-bold text-base hover:bg-slate-800 transition active:scale-95 flex items-center justify-center gap-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
        >
          <Home className="w-5 h-5 text-amber-400" />
          <span>{t('mainMenu', lang)}</span>
        </button>
      </div>
    </div>
  );
};
