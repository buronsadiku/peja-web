export const getBlobDuration = (blob: Blob): Promise<number> =>
  new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.preload = "metadata";
    audio.src = url;

    let settled = false;
    const finish = (value: number) => {
      if (settled) return;
      settled = true;
      URL.revokeObjectURL(url);
      resolve(Number.isFinite(value) && value > 0 ? value : 0);
    };

    const tryResolve = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        finish(audio.duration);
      }
    };

    const timeout = setTimeout(() => finish(0), 8000);

    audio.addEventListener("loadedmetadata", () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        clearTimeout(timeout);
        finish(audio.duration);
        return;
      }
      audio.currentTime = Number.MAX_SAFE_INTEGER;
      audio.addEventListener("durationchange", tryResolve);
      audio.addEventListener("seeked", tryResolve);
      audio.addEventListener("timeupdate", tryResolve);
    });

    audio.addEventListener("error", () => {
      clearTimeout(timeout);
      finish(0);
    });
  });
