import React, { useState } from 'react';
import { RefreshCw, PenTool, Flame, ArrowRight, ArrowLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DareQuestion, getRandomDare } from '../data/dareData';
import { Language } from '../types';
import { t } from '../data/translations';
import { audioManager } from '../utils/audioManager';
import { CornerBorders } from './CornerBorders';

interface DareViewProps {
  dare: DareQuestion;
  setDare: (dare: DareQuestion) => void;
  lang: Language;
  onAcceptDare: () => void;
}

export const DareView: React.FC<DareViewProps> = ({
  dare,
  setDare,
  lang,
  onAcceptDare,
}) => {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customText, setCustomText] = useState('');

  const handleSwap = () => {
    audioManager.playQuack();
    const nextDare = getRandomDare(dare.id);
    setDare(nextDare);
  };

  const handleOpenCustom = () => {
    audioManager.playQuack();
    setCustomText('');
    setShowCustomModal(true);
  };

  const handleSaveCustom = () => {
    const trimmed = customText.trim();
    if (!trimmed) return;
    audioManager.playQuack();
    setDare({
      id: 'custom_' + Date.now(),
      textAr: trimmed,
      textEn: trimmed,
    });
    setShowCustomModal(false);
  };

  const handleContinue = () => {
    audioManager.playQuack();
    onAcceptDare();
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-[calc(100vh-80px)] flex flex-col justify-between p-4 select-none">
      <div className="space-y-4 my-auto">
        {/* Header Badge */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
            <Flame className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span>{t('dareMode', lang)}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
            {lang === 'ar' ? 'الجرأة المقترحة' : 'The Proposed Dare'}
          </h2>
          <p className="text-xs text-slate-400">
            {t('dareDesc', lang)}
          </p>
        </div>

        {/* Dare Card with Corner Borders & Glass Effect */}
        <motion.div
          key={dare.id}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="relative p-6 sm:p-8 rounded-3xl bg-slate-900/90 border-2 border-rose-500/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_12px_32px_rgba(0,0,0,0.5)] backdrop-blur-md flex flex-col items-center text-center space-y-4 min-h-[220px] justify-center overflow-hidden"
        >
          <CornerBorders color="border-rose-400/40" size="w-3.5 h-3.5" />
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-2xl shadow-inner">
            ⚡
          </div>

          <p className="text-xl sm:text-2xl font-bold text-slate-100 leading-relaxed max-w-xs break-words">
            "{lang === 'ar' ? dare.textAr : dare.textEn}"
          </p>

          <span className="text-[11px] font-semibold text-rose-300/80 uppercase tracking-wider">
            {lang === 'ar' ? 'الكل يقرأ الجرأة قبل وضع الأصابع' : 'Everyone reads before fingers down'}
          </span>
        </motion.div>

        {/* Secondary Action Controls with Glassy Borders */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Swap Dare */}
          <button
            id="btn-swap-dare"
            onClick={handleSwap}
            className="py-3 px-3 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/20 hover:border-amber-400/60 text-slate-100 font-bold text-xs sm:text-sm hover:bg-slate-800 transition active:scale-95 flex items-center justify-center gap-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
          >
            <RefreshCw className="w-4 h-4 text-amber-400" />
            <span>{t('swapDare', lang)}</span>
          </button>

          {/* Group Custom Dare */}
          <button
            id="btn-custom-dare"
            onClick={handleOpenCustom}
            className="py-3 px-3 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/20 hover:border-sky-400/60 text-slate-100 font-bold text-xs sm:text-sm hover:bg-slate-800 transition active:scale-95 flex items-center justify-center gap-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
          >
            <PenTool className="w-4 h-4 text-sky-400" />
            <span>{t('customDare', lang)}</span>
          </button>
        </div>
      </div>

      {/* Main Start / Continue Button with Defined Color & Glassy Rim */}
      <div className="pt-4">
        <button
          id="btn-accept-dare"
          onClick={handleContinue}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-slate-950 font-black text-lg border border-white/35 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.6),0_8px_24px_rgba(225,29,72,0.35)] hover:brightness-105 active:scale-95 transition flex items-center justify-center gap-2"
        >
          <span>{lang === 'ar' ? 'موافقين! يلا للأصابع' : 'Agreed! To the Fingers'}</span>
          {lang === 'ar' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
        </button>
      </div>

      {/* Custom Dare Modal */}
      <AnimatePresence>
        {showCustomModal && (
          <div
            id="modal-custom-dare-backdrop"
            onClick={() => setShowCustomModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm p-5 rounded-3xl bg-slate-900/95 border border-white/20 shadow-2xl backdrop-blur-xl space-y-4 overflow-hidden"
            >
              <CornerBorders color="border-white/20" size="w-3 h-3" />
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-amber-400" />
                  <span>{t('customDare', lang)}</span>
                </h3>
                <button
                  onClick={() => setShowCustomModal(false)}
                  className="p-1.5 rounded-xl bg-slate-800/80 border border-white/10 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-slate-300 font-medium">
                  {t('enterCustomDare', lang)}
                </label>
                <textarea
                  id="textarea-custom-dare"
                  rows={3}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: غني مقطع راي بالصوت العالي...' : 'e.g. Sing a high-pitched song...'}
                  className="w-full p-3 rounded-2xl bg-slate-800/90 border border-white/15 text-slate-100 text-sm focus:outline-none focus:border-amber-400 resize-none shadow-inner"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800/80 border border-white/15 text-slate-300 font-bold text-sm hover:bg-slate-700 transition"
                >
                  {t('cancel', lang)}
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  disabled={!customText.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 border border-white/25 text-slate-950 font-bold text-sm hover:bg-amber-400 disabled:opacity-40 shadow-md transition"
                >
                  {t('useThisDare', lang)}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
