import React from 'react';
import { motion } from 'motion/react';
import { TruthCategoryKey, Language } from '../types';
import { TRUTH_CATEGORIES } from '../data/truthData';
import { t } from '../data/translations';
import { audioManager } from '../utils/audioManager';
import { CornerBorders } from './CornerBorders';

interface TruthCategorySelectProps {
  lang: Language;
  onSelectCategory: (category: TruthCategoryKey) => void;
}

export const TruthCategorySelect: React.FC<TruthCategorySelectProps> = ({
  lang,
  onSelectCategory,
}) => {
  const handleSelect = (key: TruthCategoryKey) => {
    audioManager.playQuack();
    onSelectCategory(key);
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-[calc(100vh-80px)] flex flex-col justify-between p-4 select-none">
      <div className="space-y-4 my-auto">
        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
            {t('selectCategory', lang)}
          </h2>
          <p className="text-xs text-slate-400">
            {lang === 'ar' ? 'اختر فئة السؤال لي راح تجاوب عليه' : 'Select the question category'}
          </p>
        </div>

        {/* 9 Category Grid (8 categories + Random) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
          {TRUTH_CATEGORIES.map((cat, idx) => {
            const isRandom = cat.id === 'random';
            return (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(cat.id)}
                className={`relative overflow-hidden p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_4px_16px_rgba(0,0,0,0.3)] backdrop-blur-md ${
                  isRandom
                    ? 'col-span-2 sm:col-span-1 bg-gradient-to-br from-amber-500/25 via-purple-600/25 to-sky-500/25 border-amber-400/50 hover:border-amber-300'
                    : 'bg-slate-900/80 border-white/15 hover:border-sky-400/60 hover:bg-slate-800/90'
                }`}
              >
                <CornerBorders
                  color={isRandom ? 'border-amber-400/40' : 'border-white/20'}
                  size="w-2.5 h-2.5"
                />
                <span className="text-2xl sm:text-3xl drop-shadow">{cat.emoji}</span>
                <span className="font-bold text-xs sm:text-sm text-slate-100">
                  {lang === 'ar' ? cat.titleAr : cat.titleEn}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
