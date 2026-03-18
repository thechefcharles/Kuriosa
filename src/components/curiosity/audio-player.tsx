"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
} from "lucide-react";
import { formatAudioTime } from "@/lib/utils/format-audio-time";
import { cn } from "@/lib/utils";

const SEEK_SECONDS = 10;

export type AudioPlayerProps = {
  src: string;
  className?: string;
  /** Announced to screen readers */
  title?: string;
};

export function AudioPlayer({ src, className, title = "Curiosity narration" }: AudioPlayerProps) {
  const scrubId = useId();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrubRef = useRef(false);

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [metaReady, setMetaReady] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scrubValue, setScrubValue] = useState(0);

  const effectiveDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const displayTime = scrubRef.current ? scrubValue : currentTime;

  const syncFromAudio = useCallback(() => {
    const el = audioRef.current;
    if (!el || scrubRef.current) return;
    setCurrentTime(el.currentTime);
  }, []);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    setError(null);
    setMetaReady(false);
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setScrubValue(0);
    setBuffering(true);
    el.load();

    const onLoadedMetadata = () => {
      const d = el.duration;
      setDuration(Number.isFinite(d) && d > 0 && d !== Number.POSITIVE_INFINITY ? d : 0);
      setMetaReady(true);
      setBuffering(false);
    };

    const onTimeUpdate = () => syncFromAudio();
    const onPlay = () => {
      setPlaying(true);
      setBuffering(false);
    };
    const onPause = () => setPlaying(false);
    const onWaiting = () => setBuffering(true);
    const onCanPlay = () => setBuffering(false);
    const onEnded = () => {
      setPlaying(false);
      setCurrentTime(0);
      if (el) el.currentTime = 0;
    };

    const onError = () => {
      setError("We couldn’t play this audio. The file may be missing or blocked.");
      setMetaReady(true);
      setPlaying(false);
      setBuffering(false);
    };

    el.addEventListener("loadedmetadata", onLoadedMetadata);
    el.addEventListener("timeupdate", onTimeUpdate);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("waiting", onWaiting);
    el.addEventListener("canplay", onCanPlay);
    el.addEventListener("ended", onEnded);
    el.addEventListener("error", onError);

    return () => {
      el.pause();
      el.removeEventListener("loadedmetadata", onLoadedMetadata);
      el.removeEventListener("timeupdate", onTimeUpdate);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("waiting", onWaiting);
      el.removeEventListener("canplay", onCanPlay);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("error", onError);
    };
  }, [src, syncFromAudio]);

  const togglePlay = async () => {
    const el = audioRef.current;
    if (!el || error) return;
    try {
      if (playing) {
        el.pause();
      } else {
        await el.play();
      }
    } catch {
      setError("Playback was blocked or failed. Try tapping play again.");
    }
  };

  const seekBy = (delta: number) => {
    const el = audioRef.current;
    if (!el || error) return;
    const cap =
      Number.isFinite(el.duration) && el.duration > 0
        ? el.duration
        : effectiveDuration > 0
          ? effectiveDuration
          : Number.POSITIVE_INFINITY;
    const next = Math.max(0, Math.min(cap, el.currentTime + delta));
    el.currentTime = next;
    setCurrentTime(next);
    setScrubValue(next);
  };

  const onScrubStart = () => {
    scrubRef.current = true;
    setScrubValue(audioRef.current?.currentTime ?? 0);
  };

  const onScrubChange = (value: number) => {
    setScrubValue(value);
    const el = audioRef.current;
    if (el) el.currentTime = value;
    setCurrentTime(value);
  };

  const onScrubEnd = () => {
    scrubRef.current = false;
  };

  const progressMax = effectiveDuration > 0 ? effectiveDuration : 100;
  const progressValue =
    effectiveDuration > 0 ? Math.min(displayTime, effectiveDuration) : 0;

  return (
    <div className={cn("space-y-4", className)}>
      <audio ref={audioRef} src={src} preload="metadata" className="hidden" />

      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => seekBy(-SEEK_SECONDS)}
          disabled={!!error || !metaReady}
          aria-label={`Rewind ${SEEK_SECONDS} seconds`}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-kuriosa-midnight-blue shadow-sm disabled:opacity-40 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
        >
          <RotateCcw className="h-5 w-5" aria-hidden />
        </button>

        <button
          type="button"
          onClick={() => void togglePlay()}
          disabled={!!error}
          aria-label={playing ? "Pause" : "Play"}
          aria-pressed={playing}
          className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-kuriosa-deep-purple text-white shadow-md shadow-kuriosa-deep-purple/25 disabled:opacity-40 dark:bg-kuriosa-electric-cyan dark:text-kuriosa-midnight-blue"
        >
          {buffering && !playing ? (
            <span
              className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent dark:border-kuriosa-midnight-blue dark:border-t-transparent"
              aria-hidden
            />
          ) : playing ? (
            <Pause className="h-7 w-7" fill="currentColor" aria-hidden />
          ) : (
            <Play className="h-7 w-7 translate-x-0.5" fill="currentColor" aria-hidden />
          )}
        </button>

        <button
          type="button"
          onClick={() => seekBy(SEEK_SECONDS)}
          disabled={!!error || !metaReady}
          aria-label={`Forward ${SEEK_SECONDS} seconds`}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-kuriosa-midnight-blue shadow-sm disabled:opacity-40 dark:border-white/15 dark:bg-slate-900 dark:text-slate-100"
        >
          <RotateCw className="h-5 w-5" aria-hidden />
        </button>

        <div className="flex min-w-[120px] flex-1 flex-col gap-1 sm:min-w-[200px]">
          <label className="sr-only" htmlFor={scrubId}>
            Playback position for {title}
          </label>
          <input
            id={scrubId}
            type="range"
            min={0}
            max={progressMax}
            step={0.1}
            value={effectiveDuration > 0 ? progressValue : 0}
            disabled={!!error || !metaReady || effectiveDuration <= 0}
            onPointerDown={onScrubStart}
            onPointerUp={onScrubEnd}
            onPointerCancel={onScrubEnd}
            onChange={(e) => onScrubChange(Number(e.target.value))}
            className="h-2 w-full cursor-pointer accent-kuriosa-deep-purple dark:accent-kuriosa-electric-cyan disabled:cursor-not-allowed disabled:opacity-40"
          />
          <div className="flex items-center justify-between text-xs tabular-nums text-muted-foreground">
            <span>{formatAudioTime(displayTime)}</span>
            <span className="inline-flex items-center gap-1">
              <Volume2 className="h-3.5 w-3.5" aria-hidden />
              {formatAudioTime(effectiveDuration)}
            </span>
          </div>
        </div>
      </div>

      {!metaReady && !error ? (
        <p className="text-center text-xs text-muted-foreground">Loading audio…</p>
      ) : null}
    </div>
  );
}
