import "server-only";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
const TOKEN = process.env.INTERNAL_UPLOAD_TOKEN ?? "";

export type UploadFolder =
  | "gallery"
  | "activities"
  | "communities"
  | "musicians";

export const uploadImageViaApi = async (
  folder: UploadFolder,
  file: File,
): Promise<{ publicUrl: string }> => {
  if (!TOKEN) {
    throw new Error("INTERNAL_UPLOAD_TOKEN not configured on peja-web");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = encodeURIComponent(file.name || "image");

  const res = await fetch(
    `${API_URL}/v1/internal/uploads/image?folder=${folder}&filename=${filename}`,
    {
      method: "POST",
      headers: {
        "x-internal-token": TOKEN,
        "content-type": file.type || "image/jpeg",
      },
      body: buffer,
    },
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `upload failed (${res.status})`);
  }
  const json = (await res.json()) as { data: { publicUrl: string } };
  return json.data;
};
