import React, { useState } from 'react';
import { RefreshCw, Camera, Volume2, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { Player, TruthCategoryKey, Language } from '../types';
import { TruthQuestion, getRandomTruthQuestion, TRUTH_CATEGORIES } from '../data/truthData';
import { t } from '../data/translations';
import { audioManager } from '../utils/audioManager';
import { CornerBorders } from './CornerBorders';

interface TruthQuestionCardProps {
  winner: Player;
  category: TruthCategoryKey;
  question: TruthQuestion;
  setQuestion: (q: TruthQuestion) => void;
  lang: Language;
  onProceedToMedia: () => void;
}

export const TruthQuestionCard: React.FC<TruthQuestionCardProps> = ({
  winner,
  category,
  question,
  setQuestion,
  lang,
  onProceedToMedia,
}) => {
  const [changesLeft, setChangesLeft] = useState(3);

  const categoryObj = TRUTH_CATEGORIES.find((c) => c.id === category);

  const handleSwap = () => {
    if (changesLeft <= 0) return;
    audioManager.playQuack();
    setChangesLeft((prev) => prev - 1);
    const nextQ = getRandomTruthQuestion(category);
    setQuestion(nextQ);
  };

  const handleSoundEffect = () => {
    audioManager.playDryFart(); // Comical sound effect
  };

  const handleProceed = () => {
    audioManager.playQuack();
    onProceedToMedia();
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-[calc(100vh-80px)] flex flex-col justify-between p-4 select-none">
      <div className="space-y-4 my-auto">
        {/* Top Winner Card with Corner Borders */}
        <motion.div
          initial={{ y: -15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative p-4 rounded-3xl bg-slate-900/90 border border-sky-500/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_20px_rgba(0,0,0,0.3)] backdrop-blur-md flex items-center justify-between gap-4 overflow-hidden"
        >
          <CornerBorders color="border-sky-400/40" size="w-3 h-3" />
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-slate-950 shadow-md shrink-0 border border-white/20"
              style={{ backgroundColor: winner.color }}
            >
              {winner.name.charAt(0)}
            </div>
            <div>
              <span className="text-xs font-bold text-sky-400 block uppercase tracking-wider">
                {t('truthQuestionTitle', lang)}
              </span>
              <h3 className="text-2xl font-black text-white">{winner.name}</h3>
            </div>
          </div>

          <button
            onClick={handleSoundEffect}
            title="Play sound effect"
            className="p-3 rounded-2xl bg-slate-800/80 border border-white/20 hover:border-amber-400/60 text-amber-400 active:scale-90 transition shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Truth Result Card with Sraha.jpg Visual! */}
        <motion.div
          key={question.id}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="relative overflow-hidden p-6 rounded-3xl bg-slate-900/90 border-2 border-sky-500/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_12px_32px_rgba(0,0,0,0.5)] backdrop-blur-md flex flex-col items-center text-center space-y-4"
        >
          <CornerBorders color="border-sky-400/40" size="w-3.5 h-3.5" />

          {/* Sraha.jpg Result Card Image */}
          <div className="relative w-36 h-36 rounded-2xl overflow-hidden shadow-xl border border-sky-400/50 shrink-0">
            <img
              id="sraha-result-img"
              src="/assets/Sraha.jpg"
              alt="Sraha Question"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-400/30">
              <span>{categoryObj?.emoji}</span>
              <span>{lang === 'ar' ? categoryObj?.titleAr : categoryObj?.titleEn}</span>
            </div>

            <p className="text-xl sm:text-2xl font-black text-slate-100 leading-relaxed break-words px-2">
              "{lang === 'ar' ? question.textAr : question.textEn}"
            </p>
          </div>
        </motion.div>

        {/* Swap Question Button (Max 3 times) */}
        <div className="flex flex-col items-center gap-1.5 pt-1">
          <button
            id="btn-swap-truth"
            onClick={handleSwap}
            disabled={changesLeft <= 0}
            className="w-full py-3 px-4 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/20 hover:border-amber-400/60 text-slate-100 font-bold text-sm hover:bg-slate-800 disabled:opacity-40 transition active:scale-95 flex items-center justify-center gap-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
          >
            <RefreshCw className="w-4 h-4 text-amber-400" />
            <span>{t('changeQuestion', lang)}</span>
            <span className="px-2.5 py-0.5 rounded-lg bg-slate-800/90 border border-white/15 text-xs text-amber-300 font-bold">
              {changesLeft} / 3
            </span>
          </button>
        </div>
      </div>

      {/* Continue to Camera / Media Button with Defined Color & Glassy Rim */}
      <div className="pt-4">
        <button
          id="btn-truth-proceed-media"
          onClick={handleProceed}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-sky-600 text-white font-black text-lg border border-white/35 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.5),0_8px_24px_rgba(14,165,233,0.35)] hover:brightness-105 active:scale-95 transition flex items-center justify-center gap-2"
        >
          <Camera className="w-5 h-5" />
          <span>{t('mediaTitle', lang)}</span>
          {lang === 'ar' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};
