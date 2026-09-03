import React from 'react';
import { Flame, Camera, ArrowRight, ArrowLeft, Volume2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Player, Language } from '../types';
import { DareQuestion } from '../data/dareData';
import { t } from '../data/translations';
import { audioManager } from '../utils/audioManager';

interface DareExecuteProps {
  winner: Player;
  dare: DareQuestion;
  lang: Language;
  onProceedToMedia: () => void;
}

export const DareExecute: React.FC<DareExecuteProps> = ({
  winner,
  dare,
  lang,
  onProceedToMedia,
}) => {
  const handleProceed = () => {
    audioManager.playQuack();
    onProceedToMedia();
  };

  const handlePlaySpecialSound = () => {
    audioManager.playDryFart(); // dry-fart.mp3 sound effect!
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-[calc(100vh-80px)] flex flex-col justify-between p-4 select-none">
      <div className="space-y-4 my-auto">
        {/* Selected Player Banner */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-4 rounded-3xl bg-slate-900/90 border-2 border-rose-500/40 shadow-xl flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-slate-950 shadow-md shrink-0"
              style={{ backgroundColor: winner.color }}
            >
              {winner.name.charAt(0)}
            </div>
            <div>
              <span className="text-xs font-bold text-rose-400 block uppercase tracking-wider">
                {t('winnerChosen', lang)}
              </span>
              <h3 className="text-2xl font-black text-white">{winner.name}</h3>
            </div>
          </div>

          {/* Sound reaction button */}
          <button
            id="btn-dare-sound-fx"
            onClick={handlePlaySpecialSound}
            title="Play sound effect"
            className="p-3 rounded-2xl bg-slate-800 border border-slate-700 hover:bg-slate-700 text-amber-400 active:scale-90 transition shadow-sm"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Dare Result Card with Djora.jpg Image! */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-b from-slate-900 via-rose-950/40 to-slate-900 border-2 border-rose-500/50 shadow-2xl flex flex-col items-center text-center space-y-4"
        >
          {/* Djora.jpg Result Card Image */}
          <div className="relative w-36 h-36 rounded-2xl overflow-hidden shadow-xl border-2 border-rose-400/40 shrink-0">
            <img
              id="djora-result-img"
              src="/assets/Djora.jpg"
              alt="Djora Challenge"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold">
              <Flame className="w-3.5 h-3.5 fill-rose-400" />
              <span>{t('performDareNotice', lang)}</span>
            </div>

            <p className="text-xl sm:text-2xl font-black text-slate-100 leading-relaxed break-words px-2">
              "{lang === 'ar' ? dare.textAr : dare.textEn}"
            </p>
          </div>
        </motion.div>
      </div>

      {/* Continue to Camera / Media Documentation Button */}
      <div className="pt-4">
        <button
          id="btn-dare-proceed-media"
          onClick={handleProceed}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-amber-500 to-rose-600 text-slate-950 font-black text-lg shadow-xl shadow-rose-500/25 hover:scale-[1.02] active:scale-95 transition flex items-center justify-center gap-2"
        >
          <Camera className="w-5 h-5" />
          <span>{t('mediaTitle', lang)}</span>
          {lang === 'ar' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};
