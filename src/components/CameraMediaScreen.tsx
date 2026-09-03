import React, { useState, useRef, useEffect } from 'react';
import { Camera, Video, StopCircle, RefreshCw, Download, Check, SkipForward, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { Player, GameMode, Language, SavedMediaItem } from '../types';
import { t } from '../data/translations';
import { saveMediaItem, downloadMediaFile } from '../utils/mediaStorage';
import { audioManager } from '../utils/audioManager';
import { CornerBorders } from './CornerBorders';

interface CameraMediaScreenProps {
  winner: Player;
  mode: GameMode;
  challengeText: string;
  lang: Language;
  onFinish: () => void;
}

export const CameraMediaScreen: React.FC<CameraMediaScreenProps> = ({
  winner,
  mode,
  challengeText,
  lang,
  onFinish,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [capturedItem, setCapturedItem] = useState<SavedMediaItem | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize camera stream
  const startCamera = async (facing: 'user' | 'environment') => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err) {
      console.warn('Camera access not granted or unavailable:', err);
      setCameraError(
        lang === 'ar'
          ? 'الكاميرا غير متاحة أو تم رفض الإذن. يمكنك تخطي هذه الخطوة.'
          : 'Camera is unavailable or permission denied. You can skip.'
      );
      setCameraActive(false);
    }
  };

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [facingMode]);

  // Timer for video recording
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // Flip camera
  const handleFlipCamera = () => {
    audioManager.playQuack();
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  // Take photo
  const handleTakePhoto = () => {
    if (!videoRef.current) return;
    audioManager.playQuack();

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Flip horizontally if front camera
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    const item: SavedMediaItem = {
      id: 'photo_' + Date.now(),
      type: 'photo',
      url: dataUrl,
      date: new Date().toISOString(),
      playerName: winner.name,
      mode,
      challengeText,
    };

    setCapturedItem(item);
    saveMediaItem(item).then(() => setSaveSuccess(true));
  };

  // Start video recording
  const handleStartRecording = () => {
    if (!streamRef.current) return;
    audioManager.playQuack();
    recordedChunksRef.current = [];
    setRecordSeconds(0);

    try {
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';
      const recorder = new MediaRecorder(streamRef.current, { mimeType });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        const item: SavedMediaItem = {
          id: 'video_' + Date.now(),
          type: 'video',
          url: videoUrl,
          blob,
          date: new Date().toISOString(),
          playerName: winner.name,
          mode,
          challengeText,
        };
        setCapturedItem(item);
        saveMediaItem(item).then(() => setSaveSuccess(true));
      };

      recorder.start(250);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (e) {
      console.error('MediaRecorder error:', e);
    }
  };

  // Stop recording
  const handleStopRecording = () => {
    audioManager.playQuack();
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Skip or continue
  const handleFinish = () => {
    audioManager.playQuack();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    onFinish();
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-[calc(100vh-80px)] flex flex-col justify-between p-4 select-none">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2">
              <Camera className="w-5 h-5 text-amber-400" />
              <span>{t('mediaTitle', lang)}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'ar' ? `توثيق اللحظة لـ ${winner.name}` : `Capturing moment for ${winner.name}`}
            </p>
          </div>

          <button
            id="btn-skip-media"
            onClick={handleFinish}
            className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/20 text-slate-200 text-xs font-bold hover:bg-slate-800 flex items-center gap-1.5 transition shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
          >
            <span>{t('skipMedia', lang)}</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Camera / Preview Frame */}
        <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] rounded-3xl overflow-hidden bg-slate-950/90 border-2 border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_12px_32px_rgba(0,0,0,0.5)] flex items-center justify-center">
          <CornerBorders color="border-white/25" size="w-3.5 h-3.5" />
          {capturedItem ? (
            /* Review Captured Media */
            <div className="relative w-full h-full">
              {capturedItem.type === 'photo' ? (
                <img
                  src={capturedItem.url}
                  alt="Captured"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={capturedItem.url}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}

              {/* Watermark badge on captured photo */}
              <div className="absolute bottom-4 left-4 right-4 p-2.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-white/20 text-xs text-slate-200 flex items-center justify-between shadow-lg">
                <div>
                  <span className="font-bold text-amber-400 block">{winner.name}</span>
                  <span className="text-[10px] text-slate-300 truncate max-w-[200px] block">
                    {challengeText}
                  </span>
                </div>
                <button
                  onClick={() => downloadMediaFile(capturedItem)}
                  className="p-2 rounded-xl bg-amber-500 border border-white/25 text-slate-950 hover:bg-amber-400 transition shadow-md"
                  title={t('downloadMedia', lang)}
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : cameraError ? (
            /* Error Fallback */
            <div className="p-6 text-center space-y-3">
              <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
              <p className="text-xs text-slate-300">{cameraError}</p>
              <button
                onClick={handleFinish}
                className="px-4 py-2 rounded-xl bg-amber-500 border border-white/25 text-slate-950 text-xs font-bold"
              >
                {t('continue', lang)}
              </button>
            </div>
          ) : (
            /* Live Camera Stream */
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${facingMode === 'user' ? '-scale-x-100' : ''}`}
              />

              {/* Recording indicator */}
              {isRecording && (
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-600 text-white text-xs font-bold shadow-lg border border-white/30">
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  <span>
                    {Math.floor(recordSeconds / 60)}:{(recordSeconds % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              )}

              {/* Flip camera button */}
              <button
                onClick={handleFlipCamera}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-950/80 border border-white/25 text-white hover:bg-slate-900 transition active:scale-95 shadow-md"
                title="Flip Camera"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Capture Controls */}
        {!capturedItem && !cameraError && (
          <div className="flex items-center justify-center gap-4 pt-2">
            {/* Take Photo Button */}
            <button
              id="btn-take-photo"
              onClick={handleTakePhoto}
              disabled={isRecording}
              className="px-5 py-3 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/20 hover:border-sky-400/60 text-slate-100 font-bold text-xs sm:text-sm hover:bg-slate-800 disabled:opacity-40 transition active:scale-95 flex items-center gap-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
            >
              <Camera className="w-4 h-4 text-sky-400" />
              <span>{t('takePhoto', lang)}</span>
            </button>

            {/* Video Record Button */}
            {isRecording ? (
              <button
                id="btn-stop-recording"
                onClick={handleStopRecording}
                className="px-6 py-3 rounded-2xl bg-rose-600 text-white font-black text-xs sm:text-sm hover:bg-rose-500 transition active:scale-95 flex items-center gap-2 border border-white/30 shadow-lg"
              >
                <StopCircle className="w-4 h-4" />
                <span>{t('stopRecording', lang)}</span>
              </button>
            ) : (
              <button
                id="btn-start-recording"
                onClick={handleStartRecording}
                className="px-5 py-3 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-rose-500/40 hover:border-rose-400 text-rose-300 font-bold text-xs sm:text-sm hover:bg-slate-800 transition active:scale-95 flex items-center gap-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
              >
                <Video className="w-4 h-4 text-rose-400" />
                <span>{t('recordVideo', lang)}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Done / Continue Button */}
      <div className="pt-4">
        <button
          id="btn-media-finish"
          onClick={handleFinish}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 text-slate-950 font-black text-lg border border-white/35 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.5),0_8px_24px_rgba(245,158,11,0.35)] hover:brightness-105 active:scale-95 transition flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5" />
          <span>{t('continue', lang)}</span>
        </button>
      </div>
    </div>
  );
};
