"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { getBlobDuration } from "@/lib/media/getBlobDuration";

const DEFAULT_MAX_DURATION_SEC = 60;

export type VideoRecording = {
  blob: Blob;
  url: string;
  durationSec: number;
  mimeType: string;
};

type RecorderState = "idle" | "requesting" | "recording" | "denied";

const pickMimeType = (): string => {
  if (typeof MediaRecorder === "undefined") return "video/webm";
  const candidates = [
    "video/mp4;codecs=h264,aac",
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
    "video/mp4",
  ];
  for (const c of candidates) {
    if (MediaRecorder.isTypeSupported(c)) return c;
  }
  return "video/webm";
};

export const useVideoRecorder = (maxDurationSec = DEFAULT_MAX_DURATION_SEC) => {
  const t = useTranslations();
  const [state, setState] = useState<RecorderState>("idle");
  const [recording, setRecording] = useState<VideoRecording | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const previewRef = useRef<HTMLVideoElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef<number>(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const maxDurationRef = useRef(maxDurationSec);
  maxDurationRef.current = maxDurationSec;

  const stopTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (previewRef.current) previewRef.current.srcObject = null;
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopTracks();
    };
  }, [stopTracks]);

  const attachPreview = useCallback((el: HTMLVideoElement | null) => {
    previewRef.current = el;
    if (el && streamRef.current) {
      el.srcObject = streamRef.current;
      el.muted = true;
      el.play().catch(() => undefined);
    }
  }, []);

  const start = useCallback(async () => {
    setError(null);
    if (typeof window !== "undefined" && window.isSecureContext === false) {
      setError(t("guest__record__video__error_insecure"));
      setState("denied");
      return;
    }
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      setError(t("guest__record__video__error_no_support"));
      return;
    }
    setState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: true,
      });
      streamRef.current = stream;
      if (previewRef.current) {
        previewRef.current.srcObject = stream;
        previewRef.current.muted = true;
        previewRef.current.play().catch(() => undefined);
      }

      const mimeType = pickMimeType();
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const wallClock = Math.round(
          (Date.now() - startedAtRef.current) / 1000,
        );
        const measured = await getBlobDuration(blob);
        const durationSec = Math.min(
          Math.round(measured > 0 ? measured : wallClock),
          maxDurationRef.current,
        );
        setRecording({ blob, url, durationSec, mimeType });
        setState("idle");
        stopTracks();
      };

      recorder.start(250);
      startedAtRef.current = Date.now();
      setElapsed(0);
      setState("recording");

      tickRef.current = setInterval(() => {
        const seconds = Math.floor((Date.now() - startedAtRef.current) / 1000);
        setElapsed(seconds);
        if (seconds >= maxDurationRef.current) recorder.stop();
      }, 200);
    } catch (e) {
      console.error("[useVideoRecorder] getUserMedia failed", e);
      setState("denied");
      const name = e instanceof Error ? e.name : "";
      const key =
        name === "NotAllowedError" || name === "SecurityError"
          ? "guest__record__video__error_denied"
          : name === "NotFoundError" || name === "OverconstrainedError"
            ? "guest__record__video__error_not_found"
            : name === "NotReadableError" || name === "TrackStartError"
              ? "guest__record__video__error_in_use"
              : "guest__record__video__error_other";
      setError(t(key));
    }
  }, [stopTracks, t]);

  const stop = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const reset = useCallback(() => {
    if (recording?.url) URL.revokeObjectURL(recording.url);
    setRecording(null);
    setElapsed(0);
    setError(null);
  }, [recording]);

  return {
    state,
    recording,
    elapsed,
    error,
    maxDurationSec: maxDurationRef.current,
    start,
    stop,
    reset,
    attachPreview,
  };
};
