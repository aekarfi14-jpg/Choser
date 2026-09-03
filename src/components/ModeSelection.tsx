import React, { useState } from 'react';
import { Flame, MessageCircleQuestion, Dices, X, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GameMode, Language } from '../types';
import { t } from '../data/translations';
import { audioManager } from '../utils/audioManager';
import { CornerBorders } from './CornerBorders';

interface ModeSelectionProps {
  lang: Language;
  onSelectMode: (mode: GameMode) => void;
}

export const ModeSelection: React.FC<ModeSelectionProps> = ({
  lang,
  onSelectMode,
}) => {
  const [showDareReadyModal, setShowDareReadyModal] = useState(false);
  const [randomModalState, setRandomModalState] = useState<{
    open: boolean;
    rolling: boolean;
    result: GameMode | null;
  }>({
    open: false,
    rolling: false,
    result: null,
  });

  const handleDareClick = () => {
    audioManager.playQuack();
    setShowDareReadyModal(true);
  };

  const handleConfirmDare = () => {
    audioManager.playQuack();
    setShowDareReadyModal(false);
    onSelectMode('dare');
  };

  const handleTruthClick = () => {
    audioManager.playQuack();
    onSelectMode('truth');
  };

  const handleRandomClick = () => {
    audioManager.playQuack();
    const outcome: GameMode = Math.random() < 0.5 ? 'dare' : 'truth';
    setRandomModalState({
      open: true,
      rolling: true,
      result: null,
    });

    // Dramatic brief roll effect
    setTimeout(() => {
      audioManager.playFaaah();
      setRandomModalState({
        open: true,
        rolling: false,
        result: outcome,
      });
    }, 700);
  };

  const handleConfirmRandomResult = () => {
    if (!randomModalState.result) return;
    audioManager.playQuack();
    const finalMode = randomModalState.result;
    setRandomModalState({ open: false, rolling: false, result: null });
    onSelectMode(finalMode);
  };

  const handleRerollRandom = () => {
    audioManager.playQuack();
    const outcome: GameMode = Math.random() < 0.5 ? 'dare' : 'truth';
    setRandomModalState({
      open: true,
      rolling: true,
      result: null,
    });
    setTimeout(() => {
      audioManager.playFaaah();
      setRandomModalState({
        open: true,
        rolling: false,
        result: outcome,
      });
    }, 600);
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-[calc(100vh-80px)] flex flex-col justify-between p-4 select-none">
      <div className="space-y-5 my-auto">
        <div className="text-center space-y-1.5">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-100">
            {t('selectGameMode', lang)}
          </h2>
          <p className="text-sm text-slate-300">
            {lang === 'ar' ? 'واش راكم حابين تلعبوا فهاد الجولة؟' : 'Which challenge type do you dare to face?'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3.5 pt-1">
          {/* Dare Mode Card 🔥 - Defined Crimson with Glassy Edges */}
          <motion.button
            id="btn-mode-dare"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleDareClick}
            className="relative overflow-hidden p-5 rounded-3xl bg-slate-900/90 border-2 border-rose-500/50 hover:border-rose-400 text-right rtl:text-right ltr:text-left shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_8px_24px_rgba(0,0,0,0.4)] backdrop-blur-md group transition"
          >
            <CornerBorders color="border-rose-400/40" size="w-3 h-3" />
            <div className="relative z-10 flex items-center justify-between gap-3">
              <div className="space-y-1.5 min-w-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-400/30">
                  <Flame className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                  <span>{lang === 'ar' ? 'أكشن وسوسبانس' : 'Action & Hype'}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {t('dareMode', lang)}
                </h3>
                <p className="text-xs text-rose-200/90 max-w-[230px] leading-relaxed font-medium">
                  {t('dareDesc', lang)}
                </p>
              </div>

              {/* Djora Image Thumbnail */}
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden border border-rose-400/50 shadow-md shrink-0 group-hover:scale-105 transition">
                <img
                  src="/assets/Djora.jpg"
                  alt="Djora"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/Djora.jpg';
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.button>

          {/* Truth Mode Card 🗣️ - Defined Azure with Glassy Edges */}
          <motion.button
            id="btn-mode-truth"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleTruthClick}
            className="relative overflow-hidden p-5 rounded-3xl bg-slate-900/90 border-2 border-sky-500/50 hover:border-sky-400 text-right rtl:text-right ltr:text-left shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_8px_24px_rgba(0,0,0,0.4)] backdrop-blur-md group transition"
          >
            <CornerBorders color="border-sky-400/40" size="w-3 h-3" />
            <div className="relative z-10 flex items-center justify-between gap-3">
              <div className="space-y-1.5 min-w-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-400/30">
                  <MessageCircleQuestion className="w-3.5 h-3.5 text-sky-400" />
                  <span>{lang === 'ar' ? 'اعترافات وفضايح' : 'Secrets & Confessions'}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {t('truthMode', lang)}
                </h3>
                <p className="text-xs text-sky-200/90 max-w-[230px] leading-relaxed font-medium">
                  {t('truthDesc', lang)}
                </p>
              </div>

              {/* Sraha Image Thumbnail */}
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden border border-sky-400/50 shadow-md shrink-0 group-hover:scale-105 transition">
                <img
                  src="/assets/Sraha.jpg"
                  alt="Sraha"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/Sraha.jpg';
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </motion.button>

          {/* Random Mode Card 🎲 عشوائي - Defined Royal Purple with Glassy Edges */}
          <motion.button
            id="btn-mode-random"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleRandomClick}
            className="relative overflow-hidden p-5 rounded-3xl bg-slate-900/90 border-2 border-purple-500/50 hover:border-purple-400 text-right rtl:text-right ltr:text-left shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_8px_24px_rgba(0,0,0,0.4)] backdrop-blur-md group transition"
          >
            <CornerBorders color="border-purple-400/40" size="w-3 h-3" />
            <div className="relative z-10 flex items-center justify-between gap-3">
              <div className="space-y-1.5 min-w-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/30">
                  <Dices className="w-3.5 h-3.5 text-purple-400" />
                  <span>{lang === 'ar' ? 'ضربة حظ وزهر' : 'Pure Luck'}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {t('randomMode', lang)}
                </h3>
                <p className="text-xs text-purple-200/90 max-w-[230px] leading-relaxed font-medium">
                  {t('randomModeDesc', lang)}
                </p>
              </div>

              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-purple-900/60 border border-purple-400/40 p-1 flex items-center justify-center text-3xl shrink-0 group-hover:rotate-12 transition shadow-md">
                <span>🎲</span>
              </div>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Modal 1: Dare "Are you ready to see what came out?" Modal (راكم واجدين تشوفو واش خرج؟) */}
      <AnimatePresence>
        {showDareReadyModal && (
          <div
            id="modal-dare-ready-backdrop"
            onClick={() => setShowDareReadyModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm rounded-3xl bg-slate-900/95 border border-rose-500/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_20px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl overflow-hidden p-6 text-center space-y-5"
            >
              <CornerBorders color="border-rose-400/40" size="w-3 h-3" />

              {/* Close Button */}
              <button
                onClick={() => setShowDareReadyModal(false)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 border border-white/15 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Djora Image Visual */}
              <div className="relative mx-auto w-24 h-24 rounded-2xl overflow-hidden border border-rose-400/60 shadow-lg">
                <img
                  src="/assets/Djora.jpg"
                  alt="Djora Challenge"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/Djora.jpg';
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-1">
                  <span className="text-xl">🔥</span>
                </div>
              </div>

              {/* Mandatory Prompt: راكم واجدين تشوفو واش خرج */}
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {t('areYouReadyDare', lang)}
                </h3>
                <p className="text-xs text-slate-300">
                  {lang === 'ar'
                    ? 'الجرأة راح تظهر قدامكم كامل، وجدوا رواحكم!'
                    : 'The dare will be revealed to everyone, get ready!'}
                </p>
              </div>

              {/* Action Buttons with Glassy Edges */}
              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  id="btn-confirm-ready-dare"
                  onClick={handleConfirmDare}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-slate-950 font-black text-lg border border-white/35 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.6),0_8px_20px_rgba(225,29,72,0.3)] hover:brightness-105 active:scale-95 transition flex items-center justify-center gap-2"
                >
                  <span>{t('readyShowUs', lang)}</span>
                  {lang === 'ar' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setShowDareReadyModal(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-800/80 border border-white/15 text-slate-300 text-xs font-bold hover:bg-slate-700 transition"
                >
                  {t('back', lang)}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 2: Random Outcome Modal (تخرجلك نافذة اذا طلعتلك جرأة او صراحة وتكمل اللعب) */}
      <AnimatePresence>
        {randomModalState.open && (
          <div
            id="modal-random-outcome-backdrop"
            onClick={() =>
              setRandomModalState({ open: false, rolling: false, result: null })
            }
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-sm rounded-3xl bg-slate-900/95 border backdrop-blur-xl shadow-2xl overflow-hidden p-6 text-center space-y-5 ${
                randomModalState.result === 'dare'
                  ? 'border-rose-500/60'
                  : randomModalState.result === 'truth'
                  ? 'border-sky-500/60'
                  : 'border-purple-500/60'
              }`}
            >
              <CornerBorders
                color={
                  randomModalState.result === 'dare'
                    ? 'border-rose-400/40'
                    : randomModalState.result === 'truth'
                    ? 'border-sky-400/40'
                    : 'border-purple-400/40'
                }
                size="w-3 h-3"
              />

              {/* Close Button */}
              <button
                onClick={() =>
                  setRandomModalState({ open: false, rolling: false, result: null })
                }
                className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800/80 border border-white/15 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>

              {/* If rolling: suspense animation */}
              {randomModalState.rolling ? (
                <div className="py-8 space-y-4">
                  <motion.div
                    animate={{ rotate: [0, 360], scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    className="w-20 h-20 mx-auto rounded-3xl bg-slate-800 border border-purple-400/40 flex items-center justify-center text-4xl shadow-lg"
                  >
                    🎲
                  </motion.div>
                  <p className="text-base font-black text-amber-300 animate-pulse">
                    {t('rollingRandom', lang)}
                  </p>
                </div>
              ) : randomModalState.result === 'dare' ? (
                /* Random Outcome = DARE (طلعتلك جرأة!) */
                <>
                  {/* Djora Image Visual */}
                  <div className="relative mx-auto w-24 h-24 rounded-2xl overflow-hidden border border-rose-400/60 shadow-lg">
                    <img
                      src="/assets/Djora.jpg"
                      alt="Djora Challenge"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/Djora.jpg';
                      }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-1">
                      <span className="text-xl">🔥</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{t('randomMode', lang)}</span>
                    </div>
                    <h3 className="text-3xl font-black text-rose-400">
                      {t('youGotDare', lang)}
                    </h3>
                    <p className="text-base font-bold text-slate-100">
                      {t('areYouReadyDare', lang)}
                    </p>
                  </div>

                  {/* Buttons with Glassy Edges */}
                  <div className="flex flex-col gap-2.5 pt-2">
                    <button
                      id="btn-random-confirm-dare"
                      onClick={handleConfirmRandomResult}
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-slate-950 font-black text-lg border border-white/35 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.6),0_8px_20px_rgba(225,29,72,0.3)] hover:brightness-105 active:scale-95 transition flex items-center justify-center gap-2"
                    >
                      <span>{t('readyDareBtn', lang)}</span>
                      {lang === 'ar' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                    </button>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleRerollRandom}
                        className="flex-1 py-2.5 rounded-xl bg-slate-800/80 border border-white/15 text-slate-200 text-xs font-bold hover:bg-slate-700 transition"
                      >
                        {lang === 'ar' ? 'إعادة القرعة 🔄' : 'Re-roll 🔄'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setRandomModalState({ open: false, rolling: false, result: null })
                        }
                        className="flex-1 py-2.5 rounded-xl bg-slate-800/80 border border-white/15 text-slate-400 text-xs font-bold hover:bg-slate-700 transition"
                      >
                        {t('cancel', lang)}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Random Outcome = TRUTH (طلعتلك صراحة!) */
                <>
                  {/* Sraha Image Visual */}
                  <div className="relative mx-auto w-24 h-24 rounded-2xl overflow-hidden border border-sky-400/60 shadow-lg">
                    <img
                      src="/assets/Sraha.jpg"
                      alt="Sraha Challenge"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/Sraha.jpg';
                      }}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-1">
                      <span className="text-xl">🗣️</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-500/30">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{t('randomMode', lang)}</span>
                    </div>
                    <h3 className="text-3xl font-black text-sky-400">
                      {t('youGotTruth', lang)}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                      {t('truthSecretNotice', lang)}
                    </p>
                  </div>

                  {/* Buttons with Glassy Edges */}
                  <div className="flex flex-col gap-2.5 pt-2">
                    <button
                      id="btn-random-confirm-truth"
                      onClick={handleConfirmRandomResult}
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-500 to-sky-600 text-white font-black text-lg border border-white/35 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.5),0_8px_20px_rgba(14,165,233,0.3)] hover:brightness-105 active:scale-95 transition flex items-center justify-center gap-2"
                    >
                      <span>{t('readyTruthBtn', lang)}</span>
                      {lang === 'ar' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                    </button>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleRerollRandom}
                        className="flex-1 py-2.5 rounded-xl bg-slate-800/80 border border-white/15 text-slate-200 text-xs font-bold hover:bg-slate-700 transition"
                      >
                        {lang === 'ar' ? 'إعادة القرعة 🔄' : 'Re-roll 🔄'}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setRandomModalState({ open: false, rolling: false, result: null })
                        }
                        className="flex-1 py-2.5 rounded-xl bg-slate-800/80 border border-white/15 text-slate-400 text-xs font-bold hover:bg-slate-700 transition"
                      >
                        {t('cancel', lang)}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

