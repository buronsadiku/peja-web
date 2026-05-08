type UploadTargetLike = {
  url: string;
  key: string;
  headers?: Record<string, string>;
  fields?: Record<string, string>;
};

export const uploadToTarget = async (
  target: UploadTargetLike,
  blob: Blob,
): Promise<void> => {
  if (target.fields) {
    const form = new FormData();
    for (const [k, v] of Object.entries(target.fields)) {
      form.append(k, v);
    }
    form.append("file", blob);
    const res = await fetch(target.url, { method: "POST", body: form });
    if (!res.ok) {
      throw new Error(`Upload failed (${res.status} ${res.statusText})`);
    }
    return;
  }

  const headers = target.headers ?? { "Content-Type": blob.type };
  const res = await fetch(target.url, {
    method: "PUT",
    body: blob,
    headers,
  });
  if (!res.ok) {
    throw new Error(`Upload failed (${res.status} ${res.statusText})`);
  }
};
