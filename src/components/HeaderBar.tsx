import React, { useState } from 'react';
import { Volume2, VolumeX, Music, Settings, ArrowLeft, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { audioManager } from '../utils/audioManager';

interface HeaderBarProps {
  lang: Language;
  onToggleLang: () => void;
  onOpenSettings: () => void;
  onBack?: () => void;
  showBack?: boolean;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  lang,
  onToggleLang,
  onOpenSettings,
  onBack,
  showBack,
}) => {
  const [musicOn, setMusicOn] = useState(audioManager.isMusicOn());
  const [sfxOn, setSfxOn] = useState(audioManager.isSfxOn());

  const handleToggleMusic = () => {
    const next = audioManager.toggleMusic();
    setMusicOn(next);
  };

  const handleToggleSfx = () => {
    const next = audioManager.toggleSfx();
    setSfxOn(next);
    if (next) audioManager.playQuack();
  };

  return (
    <header className="w-full flex items-center justify-between px-4 py-3.5 z-30 select-none border-b border-white/[0.06] backdrop-blur-md bg-slate-950/40">
      <div className="flex items-center gap-2">
        {showBack && onBack && (
          <button
            id="header-btn-back"
            onClick={() => {
              audioManager.playQuack();
              onBack();
            }}
            className="flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-900/80 border border-white/20 hover:border-white/40 text-slate-200 hover:text-white hover:bg-slate-800/90 transition active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-md"
            aria-label="Back"
          >
            {lang === 'ar' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Language switch */}
        <button
          id="header-btn-lang"
          onClick={() => {
            audioManager.playQuack();
            onToggleLang();
          }}
          className="px-3.5 py-1.5 rounded-2xl text-xs font-bold bg-slate-900/80 border border-amber-400/40 text-amber-300 hover:border-amber-400/70 hover:bg-amber-500/10 transition active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-md flex items-center gap-1.5"
          title="Toggle Language"
        >
          <span>🌐</span>
          <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
        </button>

        {/* Music button */}
        <button
          id="header-btn-music"
          onClick={handleToggleMusic}
          className={`flex items-center justify-center w-10 h-10 rounded-2xl transition active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-md ${
            musicOn
              ? 'bg-purple-600/30 border border-purple-400/70 text-purple-200 hover:bg-purple-600/40'
              : 'bg-slate-900/80 border border-white/15 text-slate-500 hover:border-white/30'
          }`}
          title="Toggle Background Music"
        >
          <Music className={`w-4 h-4 ${musicOn ? 'text-purple-300' : ''}`} />
        </button>

        {/* SFX button */}
        <button
          id="header-btn-sfx"
          onClick={handleToggleSfx}
          className={`flex items-center justify-center w-10 h-10 rounded-2xl transition active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-md ${
            sfxOn
              ? 'bg-emerald-600/30 border border-emerald-400/70 text-emerald-200 hover:bg-emerald-600/40'
              : 'bg-slate-900/80 border border-white/15 text-slate-500 hover:border-white/30'
          }`}
          title="Toggle Sound Effects"
        >
          {sfxOn ? <Volume2 className="w-4 h-4 text-emerald-300" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Settings button */}
        <button
          id="header-btn-settings"
          onClick={() => {
            audioManager.playQuack();
            onOpenSettings();
          }}
          className="flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-900/80 border border-white/20 hover:border-white/40 text-slate-200 hover:text-amber-300 hover:bg-slate-800 transition active:scale-95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-md"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
