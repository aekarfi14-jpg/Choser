import React from 'react';
import { Play, Settings, Music, Globe, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Language } from '../types';
import { t } from '../data/translations';
import { audioManager } from '../utils/audioManager';
import { CornerBorders } from './CornerBorders';

interface MainMenuProps {
  lang: Language;
  onStartGame: () => void;
  onOpenSettings: () => void;
  onToggleLang: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  lang,
  onStartGame,
  onOpenSettings,
  onToggleLang,
}) => {
  const isMusicOn = audioManager.isMusicOn();

  const handlePlay = () => {
    audioManager.playQuack();
    audioManager.playMusic(); // Start background music smoothly if enabled
    onStartGame();
  };

  const handleMusicToggle = () => {
    audioManager.playQuack();
    audioManager.toggleMusic();
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-64px)] flex flex-col items-center justify-between p-6 select-none">
      {/* Subtle modern ambient depth - no garish neon */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-slate-800/30 blur-3xl" />
      </div>

      {/* Hero Branding Section */}
      <div className="w-full max-w-sm flex flex-col items-center text-center mt-4 z-10">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.45, type: 'spring' }}
          className="relative mb-5"
        >
          {/* Sraha app icon badge with glassy border and corner engravings */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl p-1 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border border-white/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_12px_28px_rgba(0,0,0,0.5)]">
            <CornerBorders color="border-amber-400/40" size="w-2.5 h-2.5" />
            <img
              id="app-icon-img"
              src="/assets/sraha.jpg"
              alt="Shooser Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-[22px]"
            />
            <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full shadow-md border border-white/40">
              DZ 🇩🇿
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="space-y-1.5"
        >
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900/80 border border-amber-400/30 text-amber-300 text-xs font-semibold shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('tagline', lang)}</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-white drop-shadow-sm">
            {lang === 'ar' ? 'شوزر' : 'SHOOSER'}
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-300 max-w-xs leading-relaxed">
            {lang === 'ar'
              ? 'صراحة، جرأة، واختيار الأصابع الأكثر حماسًا وسوسبانس!'
              : 'Truth, Dare, & the ultimate finger-selection suspense!'}
          </p>
        </motion.div>
      </div>

      {/* Main Menu Action Buttons with Glassy Edges & Clear Distinct Colors */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="w-full max-w-xs flex flex-col gap-3.5 my-auto z-10"
      >
        {/* Play Button ▶️ بدأ اللعب - Defined Amber/Gold with Glassy Rim */}
        <button
          id="btn-main-play"
          onClick={handlePlay}
          className="group relative w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black text-xl border border-amber-100/60 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.7),inset_0_-2px_4px_rgba(0,0,0,0.2),0_8px_24px_-4px_rgba(245,158,11,0.35)] hover:brightness-105 active:scale-95 transition flex items-center justify-center gap-3 overflow-hidden"
        >
          <CornerBorders color="border-slate-950/30" size="w-2 h-2" showTicks={false} />
          <Play className="w-6 h-6 fill-slate-950 text-slate-950 transition-transform group-hover:scale-110 shrink-0" />
          <span>{t('play', lang)}</span>
        </button>

        {/* Settings Button ⚙️ الإعدادات - Frosted Glass Button with Glass Border */}
        <button
          id="btn-main-settings"
          onClick={() => {
            audioManager.playQuack();
            onOpenSettings();
          }}
          className="group relative w-full py-3.5 px-5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/20 hover:border-white/40 text-slate-100 font-bold text-base hover:bg-slate-800/90 transition active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_4px_16px_rgba(0,0,0,0.3)] flex items-center justify-center gap-2.5 overflow-hidden"
        >
          <CornerBorders color="border-white/15" size="w-2 h-2" showTicks={false} />
          <Settings className="w-5 h-5 text-amber-400 transition-transform group-hover:rotate-45" />
          <span>{t('settings', lang)}</span>
        </button>

        {/* Music Control 🎵 الموسيقى - Frosted Glass Button */}
        <button
          id="btn-main-music"
          onClick={handleMusicToggle}
          className="group relative w-full py-3.5 px-5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/20 hover:border-purple-400/50 text-slate-100 font-bold text-base hover:bg-slate-800/90 transition active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_4px_16px_rgba(0,0,0,0.3)] flex items-center justify-center gap-2.5 overflow-hidden"
        >
          <CornerBorders color="border-white/15" size="w-2 h-2" showTicks={false} />
          <Music className={`w-5 h-5 ${isMusicOn ? 'text-purple-400' : 'text-slate-500'}`} />
          <span>{t('music', lang)}</span>
          <span className="text-xs px-2.5 py-0.5 rounded-lg bg-slate-800/90 border border-white/15 text-slate-300 font-semibold shadow-inner">
            {isMusicOn ? (lang === 'ar' ? 'مشتغلة' : 'ON') : (lang === 'ar' ? 'موقفة' : 'OFF')}
          </span>
        </button>

        {/* Language Switcher 🌐 العربية / English - Frosted Glass Button */}
        <button
          id="btn-main-lang"
          onClick={() => {
            audioManager.playQuack();
            onToggleLang();
          }}
          className="group relative w-full py-3.5 px-5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/20 hover:border-sky-400/50 text-slate-100 font-bold text-base hover:bg-slate-800/90 transition active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_4px_16px_rgba(0,0,0,0.3)] flex items-center justify-center gap-2.5 overflow-hidden"
        >
          <CornerBorders color="border-white/15" size="w-2 h-2" showTicks={false} />
          <Globe className="w-5 h-5 text-sky-400" />
          <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
        </button>
      </motion.div>

      {/* Footer Branding */}
      <div className="text-center text-xs text-slate-400 pt-3 z-10 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span>Shooser • 100% Offline Ready</span>
      </div>
    </div>
  );
};
