import React, { useEffect } from 'react';
import { Flame, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { Language } from '../types';
import { t } from '../data/translations';
import { audioManager } from '../utils/audioManager';

interface DareAnimationProps {
  lang: Language;
  onAnimationEnd: () => void;
}

export const DareAnimation: React.FC<DareAnimationProps> = ({
  lang,
  onAnimationEnd,
}) => {
  useEffect(() => {
    audioManager.playFaaah(); // Energetic hype sound!
    const timer = setTimeout(() => {
      onAnimationEnd();
    }, 1800);
    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 overflow-hidden p-6 select-none">
      <motion.div
        initial={{ scale: 0.3, opacity: 0, rotate: -15 }}
        animate={{ scale: [0.3, 1.25, 1], opacity: 1, rotate: [0, 5, 0] }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center text-center space-y-4"
      >
        <div className="relative">
          <motion.div
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-rose-600 via-amber-500 to-rose-400 p-1 flex items-center justify-center shadow-2xl shadow-rose-500/60"
          >
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-5xl sm:text-6xl">
              🔥
            </div>
          </motion.div>
          <div className="absolute -top-3 -right-3 p-2 rounded-full bg-amber-400 text-slate-950 shadow-lg animate-bounce">
            <Zap className="w-6 h-6 fill-slate-950" />
          </div>
        </div>

        <div className="space-y-2 max-w-sm">
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-400 to-amber-200 drop-shadow-md"
          >
            {t('dareHypeTitle', lang)}
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-sm sm:text-base font-bold text-rose-200/90"
          >
            {t('dareHypeSubtitle', lang)}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};
