import React, { useState, useEffect } from 'react';
import { X, Trash2, Download, Image as ImageIcon, Video as VideoIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SavedMediaItem, Language } from '../types';
import { getAllMediaItems, deleteMediaItem, downloadMediaFile } from '../utils/mediaStorage';
import { t } from '../data/translations';
import { audioManager } from '../utils/audioManager';
import { CornerBorders } from './CornerBorders';

interface SavedGalleryModalProps {
  lang: Language;
  onClose: () => void;
}

export const SavedGalleryModal: React.FC<SavedGalleryModalProps> = ({
  lang,
  onClose,
}) => {
  const [items, setItems] = useState<SavedMediaItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<SavedMediaItem | null>(null);

  useEffect(() => {
    getAllMediaItems().then(setItems);
  }, []);

  const handleDelete = async (id: string) => {
    audioManager.playQuack();
    await deleteMediaItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
  };

  return (
    <div
      id="modal-gallery-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md select-none"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[85vh] rounded-3xl bg-slate-900/95 border border-white/20 shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden"
      >
        <CornerBorders color="border-white/25" size="w-3.5 h-3.5" />
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-black text-lg text-slate-100 flex items-center gap-2">
            <span>📷</span>
            <span>{t('savedGallery', lang)}</span>
          </h3>
          <button
            onClick={() => {
              audioManager.playQuack();
              onClose();
            }}
            className="p-1.5 rounded-xl bg-slate-800 border border-white/15 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          {items.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              {t('noSavedMedia', lang)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="relative group rounded-2xl overflow-hidden bg-slate-950 border border-white/15 aspect-square cursor-pointer shadow-sm hover:border-white/35 transition"
                  onClick={() => setSelectedItem(item)}
                >
                  {item.type === 'photo' ? (
                    <img
                      src={item.url}
                      alt={item.playerName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                    />
                  ) : (
                    <div className="relative w-full h-full flex items-center justify-center bg-slate-950">
                      <VideoIcon className="w-8 h-8 text-rose-400" />
                      <video
                        src={item.url}
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                      />
                    </div>
                  )}

                  {/* Badge */}
                  <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded-lg bg-slate-950/80 backdrop-blur-sm border border-white/10 text-[10px] font-bold text-slate-200 truncate flex items-center justify-between">
                    <span>{item.playerName}</span>
                    {item.type === 'video' ? <VideoIcon className="w-3 h-3 text-rose-400" /> : <ImageIcon className="w-3 h-3 text-sky-400" />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Media Detail Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-sm w-full bg-slate-900/95 border border-white/20 rounded-3xl overflow-hidden p-4 space-y-3 shadow-2xl"
            >
              <CornerBorders color="border-white/25" size="w-3 h-3" />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-black text-white text-base">{selectedItem.playerName}</h4>
                  <p className="text-[11px] text-slate-300 truncate max-w-[200px]">
                    {selectedItem.challengeText}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="p-1.5 rounded-xl bg-slate-800 border border-white/15 text-slate-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-white/15">
                {selectedItem.type === 'photo' ? (
                  <img
                    src={selectedItem.url}
                    alt={selectedItem.playerName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <video
                    src={selectedItem.url}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => downloadMediaFile(selectedItem)}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 border border-white/30 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 hover:brightness-105 active:scale-95 transition shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]"
                >
                  <Download className="w-4 h-4" />
                  <span>{t('downloadMedia', lang)}</span>
                </button>
                <button
                  onClick={() => handleDelete(selectedItem.id)}
                  className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30 active:scale-95 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
