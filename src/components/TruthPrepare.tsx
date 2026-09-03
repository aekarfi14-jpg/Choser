import React from 'react';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { Player, Language } from '../types';
import { t } from '../data/translations';
import { audioManager } from '../utils/audioManager';

interface TruthPrepareProps {
  winner: Player;
  lang: Language;
  onProceedToCategory: () => void;
}

export const TruthPrepare: React.FC<TruthPrepareProps> = ({
  winner,
  lang,
  onProceedToCategory,
}) => {
  const handleProceed = () => {
    audioManager.playQuack();
    onProceedToCategory();
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-[calc(100vh-80px)] flex flex-col justify-between p-4 select-none">
      <div className="space-y-6 my-auto text-center">
        {/* Player Avatar */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring' }}
          className="relative mx-auto w-32 h-32 rounded-3xl p-1.5 bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-600 shadow-2xl shadow-sky-500/30"
        >
          <div
            className="w-full h-full rounded-[20px] flex items-center justify-center text-5xl font-black text-slate-950 shadow-inner"
            style={{ backgroundColor: winner.color }}
          >
            {winner.name.charAt(0)}
          </div>
        </motion.div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{winner.name}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white">
            {t('truthPrepareTitle', lang)}
          </h2>
          <p className="text-sm text-slate-300 max-w-xs mx-auto leading-relaxed">
            {t('truthPrepareSubtitle', lang)}
          </p>
        </div>
      </div>

      <div className="pt-4">
        <button
          id="btn-truth-to-categories"
          onClick={handleProceed}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 text-white font-black text-lg shadow-xl shadow-sky-500/25 hover:scale-[1.02] active:scale-95 transition flex items-center justify-center gap-2"
        >
          <span>{t('selectCategory', lang)}</span>
          {lang === 'ar' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};
