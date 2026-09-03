import React, { useState } from 'react';
import { X, Volume2, VolumeX, Music, Globe, Images, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { Language } from '../types';
import { t } from '../data/translations';
import { audioManager } from '../utils/audioManager';
import { SavedGalleryModal } from './SavedGalleryModal';
import { CornerBorders } from './CornerBorders';

interface SettingsModalProps {
  lang: Language;
  onToggleLang: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  lang,
  onToggleLang,
  onClose,
}) => {
  const [musicOn, setMusicOn] = useState(audioManager.isMusicOn());
  const [sfxOn, setSfxOn] = useState(audioManager.isSfxOn());
  const [musicVol, setMusicVol] = useState(audioManager.getMusicVolume());
  const [sfxVol, setSfxVol] = useState(audioManager.getSfxVolume());
  const [track, setTrack] = useState(audioManager.getCurrentTrack());
  const [showGallery, setShowGallery] = useState(false);

  const handleToggleMusic = () => {
    const next = audioManager.toggleMusic();
    setMusicOn(next);
  };

  const handleToggleSfx = () => {
    const next = audioManager.toggleSfx();
    setSfxOn(next);
    if (next) audioManager.playQuack();
  };

  const handleMusicVolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setMusicVol(val);
    audioManager.setMusicVolume(val);
  };

  const handleSfxVolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSfxVol(val);
    audioManager.setSfxVolume(val);
  };

  const handleTrackChange = (newTrack: 'sirocco_velocity' | 'ready_to_play') => {
    audioManager.playQuack();
    setTrack(newTrack);
    audioManager.setMusicTrack(newTrack);
  };

  return (
    <div
      id="modal-settings-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-3xl bg-slate-900/95 border border-white/20 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <CornerBorders color="border-white/25" size="w-3.5 h-3.5" />
        {/* Visual Banner using Stop.jpg */}
        <div className="relative w-full h-36 sm:h-40 bg-slate-950 overflow-hidden shrink-0">
          <img
            id="stop-visual-banner"
            src="/assets/Stop.jpg"
            alt="Stop Visual"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/40" />

          {/* Close button in top corner */}
          <button
            id="btn-close-settings"
            onClick={() => {
              audioManager.playQuack();
              onClose();
            }}
            className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/80 border border-white/20 text-slate-200 hover:text-white transition shadow-md"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Title tag on image */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <span className="font-black text-lg text-white drop-shadow">
              {t('settingsTitle', lang)}
            </span>
            <span className="text-[11px] font-bold text-amber-300 bg-slate-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/30">
              {t('stopVisualNotice', lang)}
            </span>
          </div>
        </div>

        {/* Scrollable Settings Options */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Language Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/80 border border-white/15">
            <div className="flex items-center gap-2.5">
              <Globe className="w-5 h-5 text-sky-400" />
              <span className="font-bold text-sm text-slate-100">
                {t('language', lang)}
              </span>
            </div>
            <button
              onClick={() => {
                audioManager.playQuack();
                onToggleLang();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 font-bold text-xs hover:bg-amber-500/30 transition shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
            >
              {lang === 'ar' ? 'English' : 'العربية'}
            </button>
          </div>

          {/* Background Music Settings */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-white/15 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Music className="w-5 h-5 text-purple-400" />
                <span className="font-bold text-sm text-slate-100">
                  {t('music', lang)}
                </span>
              </div>
              <button
                onClick={handleToggleMusic}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition ${
                  musicOn
                    ? 'bg-purple-600/30 border-purple-400 text-purple-200'
                    : 'bg-slate-700/80 border-white/10 text-slate-400'
                }`}
              >
                {musicOn ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Track Switcher */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-slate-300 font-semibold block">
                {t('musicTrack', lang)}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleTrackChange('sirocco_velocity')}
                  className={`p-2 rounded-xl text-xs font-bold border truncate transition ${
                    track === 'sirocco_velocity'
                      ? 'bg-purple-600/30 border-purple-400 text-purple-200'
                      : 'bg-slate-900/60 border-white/10 text-slate-300'
                  }`}
                >
                  Sirocco Velocity
                </button>
                <button
                  onClick={() => handleTrackChange('ready_to_play')}
                  className={`p-2 rounded-xl text-xs font-bold border truncate transition ${
                    track === 'ready_to_play'
                      ? 'bg-purple-600/30 border-purple-400 text-purple-200'
                      : 'bg-slate-900/60 border-white/10 text-slate-300'
                  }`}
                >
                  Ready To Play
                </button>
              </div>
            </div>

            {/* Volume slider */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[11px] text-slate-300 font-medium">
                <span>{t('musicVolume', lang)}</span>
                <span>{Math.round(musicVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={musicVol}
                onChange={handleMusicVolChange}
                className="w-full accent-purple-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Sound Effects Settings */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-white/15 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm text-slate-100">
                  {t('soundEffects', lang)}
                </span>
              </div>
              <button
                onClick={handleToggleSfx}
                className={`px-3 py-1 rounded-xl text-xs font-bold border transition ${
                  sfxOn
                    ? 'bg-emerald-600/30 border-emerald-400 text-emerald-200'
                    : 'bg-slate-700/80 border-white/10 text-slate-400'
                }`}
              >
                {sfxOn ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* SFX Volume slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-300 font-medium">
                <span>{t('sfxVolume', lang)}</span>
                <span>{Math.round(sfxVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={sfxVol}
                onChange={handleSfxVolChange}
                className="w-full accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Saved Media Gallery Link */}
          <button
            onClick={() => {
              audioManager.playQuack();
              setShowGallery(true);
            }}
            className="w-full p-3.5 rounded-2xl bg-slate-800/80 border border-white/15 text-slate-100 font-bold text-sm flex items-center justify-between hover:bg-slate-700/80 transition shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
          >
            <div className="flex items-center gap-2.5">
              <Images className="w-5 h-5 text-amber-400" />
              <span>{t('savedGallery', lang)}</span>
            </div>
            <span className="text-xs text-amber-400">➔</span>
          </button>
        </div>

        {/* Bottom Resume / Close Button */}
        <div className="p-4 border-t border-white/10 bg-slate-950/60">
          <button
            onClick={() => {
              audioManager.playQuack();
              onClose();
            }}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm border border-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] flex items-center justify-center gap-1.5 hover:brightness-105 active:scale-95 transition"
          >
            <Check className="w-4 h-4" />
            <span>{t('close', lang)}</span>
          </button>
        </div>
      </motion.div>

      {/* Gallery Modal */}
      {showGallery && (
        <SavedGalleryModal lang={lang} onClose={() => setShowGallery(false)} />
      )}
    </div>
  );
};
