import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, GameMode, Screen, Player, TruthCategoryKey } from './types';
import { getStoredPlayers } from './data/players';
import { getRandomDare, DareQuestion } from './data/dareData';
import { getRandomTruthQuestion, TruthQuestion } from './data/truthData';
import { HeaderBar } from './components/HeaderBar';
import { MainMenu } from './components/MainMenu';
import { PlayerManagement } from './components/PlayerManagement';
import { ModeSelection } from './components/ModeSelection';
import { DareView } from './components/DareView';
import { FingerScreen } from './components/FingerScreen';
import { DareExecute } from './components/DareExecute';
import { TruthPrepare } from './components/TruthPrepare';
import { TruthCategorySelect } from './components/TruthCategorySelect';
import { TruthQuestionCard } from './components/TruthQuestionCard';
import { CameraMediaScreen } from './components/CameraMediaScreen';
import { RoundEnd } from './components/RoundEnd';
import { SettingsModal } from './components/SettingsModal';
import { audioManager } from './utils/audioManager';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('shooser_language');
      if (saved === 'en' || saved === 'ar') return saved;
    } catch {}
    return 'ar'; // Default language: Algerian Arabic (Darija)
  });

  const [screen, setScreen] = useState<Screen>('main_menu');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Players state
  const [players, setPlayers] = useState<Player[]>(() => getStoredPlayers());

  // Current Round State
  const [mode, setMode] = useState<GameMode>('dare');
  const [currentDare, setCurrentDare] = useState<DareQuestion>(() => getRandomDare());
  const [selectedCategory, setSelectedCategory] = useState<TruthCategoryKey>('embarrassing');
  const [currentTruth, setCurrentTruth] = useState<TruthQuestion>(() => getRandomTruthQuestion('embarrassing'));
  const [selectedWinner, setSelectedWinner] = useState<Player>(players[0]);

  // Save language changes
  const toggleLanguage = () => {
    setLang((prev) => {
      const next = prev === 'ar' ? 'en' : 'ar';
      try {
        localStorage.setItem('shooser_language', next);
      } catch {}
      return next;
    });
  };

  // Sync document title and direction
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Navigation handlers
  const handleStartGame = () => {
    setScreen('player_management');
  };

  const handlePlayersContinue = () => {
    setScreen('mode_selection');
  };

  const handleSelectMode = (selectedMode: GameMode) => {
    setMode(selectedMode);
    if (selectedMode === 'dare') {
      // Pick initial random dare and show Dare View screen first
      setCurrentDare(getRandomDare());
      setScreen('dare_view');
    } else {
      // In Truth mode, question is 100% secret before fingers!
      setScreen('finger_screen');
    }
  };

  const handleAcceptDare = () => {
    audioManager.playFaaah();
    setScreen('finger_screen');
  };

  const handleWinnerSelected = (winner: Player) => {
    setSelectedWinner(winner);
    if (mode === 'dare') {
      setScreen('dare_execute');
    } else {
      setScreen('truth_prepare');
    }
  };

  const handleProceedToCategory = () => {
    setScreen('truth_category');
  };

  const handleSelectCategory = (category: TruthCategoryKey) => {
    setSelectedCategory(category);
    const q = getRandomTruthQuestion(category);
    setCurrentTruth(q);
    setScreen('truth_question');
  };

  const handleProceedToMedia = () => {
    setScreen('camera_media');
  };

  const handleMediaFinish = () => {
    setScreen('round_end');
  };

  const handleReplay = () => {
    // Replay with same players -> go straight to mode selection
    setScreen('mode_selection');
  };

  const handleMainMenu = () => {
    setScreen('main_menu');
  };

  // Back button handler
  const handleBack = () => {
    switch (screen) {
      case 'player_management':
        setScreen('main_menu');
        break;
      case 'mode_selection':
        setScreen('player_management');
        break;
      case 'dare_view':
        setScreen('mode_selection');
        break;
      case 'truth_category':
        setScreen('truth_prepare');
        break;
      case 'round_end':
        setScreen('main_menu');
        break;
      default:
        setScreen('main_menu');
        break;
    }
  };

  const canShowBack =
    screen === 'player_management' ||
    screen === 'mode_selection' ||
    screen === 'dare_view' ||
    screen === 'truth_category' ||
    screen === 'round_end';

  return (
    <div
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="relative min-h-screen w-full modern-grid-bg text-slate-100 flex flex-col justify-between overflow-x-hidden"
    >
      {/* Modern Sleek Ambient Lighting (No harsh or fuzzy neon) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle top centered atmospheric light */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[550px] h-[350px] rounded-full bg-slate-800/25 blur-3xl" />
        {/* Subtle bottom ambient warmth */}
        <div className="absolute -bottom-24 right-1/4 w-[400px] h-[250px] rounded-full bg-amber-500/5 blur-3xl" />
        {/* Minimalist modern edge line framing */}
        <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Screen Frame Modern Geometric Corner Engravings */}
      <div className="fixed top-2 left-2 w-3 h-3 border-t border-l border-white/20 pointer-events-none z-40 hidden sm:block" />
      <div className="fixed top-2 right-2 w-3 h-3 border-t border-r border-white/20 pointer-events-none z-40 hidden sm:block" />
      <div className="fixed bottom-2 left-2 w-3 h-3 border-b border-l border-white/20 pointer-events-none z-40 hidden sm:block" />
      <div className="fixed bottom-2 right-2 w-3 h-3 border-b border-r border-white/20 pointer-events-none z-40 hidden sm:block" />

      {/* Top Navigation / Status Header Bar */}
      <HeaderBar
        lang={lang}
        onToggleLang={toggleLanguage}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onBack={handleBack}
        showBack={canShowBack}
      />

      {/* Main Screen Body with Smooth Animated Transitions */}
      <main className="flex-1 flex flex-col justify-center w-full">
        <AnimatePresence mode="wait">
          {screen === 'main_menu' && (
            <motion.div
              key="main_menu"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <MainMenu
                lang={lang}
                onStartGame={handleStartGame}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onToggleLang={toggleLanguage}
              />
            </motion.div>
          )}

          {screen === 'player_management' && (
            <motion.div
              key="player_management"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <PlayerManagement
                players={players}
                setPlayers={setPlayers}
                lang={lang}
                onContinue={handlePlayersContinue}
              />
            </motion.div>
          )}

          {screen === 'mode_selection' && (
            <motion.div
              key="mode_selection"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <ModeSelection lang={lang} onSelectMode={handleSelectMode} />
            </motion.div>
          )}

          {screen === 'dare_view' && (
            <motion.div
              key="dare_view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <DareView
                dare={currentDare}
                setDare={setCurrentDare}
                lang={lang}
                onAcceptDare={handleAcceptDare}
              />
            </motion.div>
          )}

          {screen === 'finger_screen' && (
            <motion.div
              key="finger_screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <FingerScreen
                mode={mode}
                dare={mode === 'dare' ? currentDare : undefined}
                players={players}
                setPlayers={setPlayers}
                lang={lang}
                onWinnerSelected={handleWinnerSelected}
              />
            </motion.div>
          )}

          {screen === 'dare_execute' && (
            <motion.div
              key="dare_execute"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <DareExecute
                winner={selectedWinner}
                dare={currentDare}
                lang={lang}
                onProceedToMedia={handleProceedToMedia}
              />
            </motion.div>
          )}

          {screen === 'truth_prepare' && (
            <motion.div
              key="truth_prepare"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <TruthPrepare
                winner={selectedWinner}
                lang={lang}
                onProceedToCategory={handleProceedToCategory}
              />
            </motion.div>
          )}

          {screen === 'truth_category' && (
            <motion.div
              key="truth_category"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <TruthCategorySelect
                lang={lang}
                onSelectCategory={handleSelectCategory}
              />
            </motion.div>
          )}

          {screen === 'truth_question' && (
            <motion.div
              key="truth_question"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <TruthQuestionCard
                winner={selectedWinner}
                category={selectedCategory}
                question={currentTruth}
                setQuestion={setCurrentTruth}
                lang={lang}
                onProceedToMedia={handleProceedToMedia}
              />
            </motion.div>
          )}

          {screen === 'camera_media' && (
            <motion.div
              key="camera_media"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <CameraMediaScreen
                winner={selectedWinner}
                mode={mode}
                challengeText={
                  mode === 'dare'
                    ? (lang === 'ar' ? currentDare.textAr : currentDare.textEn)
                    : (lang === 'ar' ? currentTruth.textAr : currentTruth.textEn)
                }
                lang={lang}
                onFinish={handleMediaFinish}
              />
            </motion.div>
          )}

          {screen === 'round_end' && (
            <motion.div
              key="round_end"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              <RoundEnd
                winner={selectedWinner}
                lang={lang}
                onReplay={handleReplay}
                onMainMenu={handleMainMenu}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Settings Modal with Stop.jpg Illustration */}
      {isSettingsOpen && (
        <SettingsModal
          lang={lang}
          onToggleLang={toggleLanguage}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}
