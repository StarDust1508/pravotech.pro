import { useRef, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Lock } from 'lucide-react';

interface VideoPlayerProps {
  videoToken: string | null;
  accessible: boolean;
  lessonId: number;
  onProgress?: (seconds: number) => void;
}

export default function VideoPlayer({ videoToken, accessible, lessonId, onProgress }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const lastReportedRef = useRef(0);

  // Периодически отправляем прогресс просмотра (каждые 15 сек)
  useEffect(() => {
    if (!videoRef.current || !accessible) return;

    const interval = setInterval(() => {
      const video = videoRef.current;
      if (!video || video.paused) return;

      const currentTime = Math.floor(video.currentTime);
      if (currentTime - lastReportedRef.current >= 15) {
        lastReportedRef.current = currentTime;
        onProgress?.(currentTime);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [accessible, lessonId, onProgress]);

  if (!accessible) {
    return (
      <div className="relative w-full aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl flex items-center justify-center border border-gray-700/50">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-gray-800/80 border border-cyan-500/30 flex items-center justify-center">
            <Lock className="w-10 h-10 text-cyan-400/60" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-300">Видео заблокировано</p>
            <p className="text-sm text-gray-500 mt-1">
              Оплатите курс, чтобы получить доступ к видео-урокам
            </p>
          </div>
          <a
            href={`/courses/${(window.location.pathname.split('/courses/')[1] || '').split('/')[0]}`}
            className="inline-block px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium
                       hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25"
          >
            Получить доступ
          </a>
        </div>
      </div>
    );
  }

  if (!videoToken) {
    return (
      <div className="w-full aspect-video bg-gray-900 rounded-xl flex items-center justify-center border border-gray-700/50">
        <p className="text-gray-500">Видео для этого урока пока не загружено</p>
      </div>
    );
  }

  const videoUrl = api.video.getStreamUrl(videoToken);

  return (
    <div className="relative w-full">
      {error && (
        <div className="absolute top-4 left-4 right-4 z-10 bg-red-500/90 text-white px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}
      <video
        ref={videoRef}
        className="w-full aspect-video rounded-xl bg-black"
        controls
        preload="metadata"
        playsInline
        src={videoUrl}
        onError={() => {
          setError('Не удалось загрузить видео. Попробуйте обновить страницу.');
        }}
        onPlay={() => setError(null)}
        onEnded={() => {
          const video = videoRef.current;
          if (video) {
            onProgress?.(Math.floor(video.duration));
          }
        }}
      >
        Ваш браузер не поддерживает воспроизведение видео.
      </video>
    </div>
  );
}
