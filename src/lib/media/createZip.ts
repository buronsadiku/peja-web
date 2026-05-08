import { zipSync } from "fflate";

export const createZipBlob = async (
  files: { name: string; blob: Blob }[],
): Promise<Blob> => {
  const entries: Record<string, Uint8Array> = {};
  for (const f of files) {
    entries[f.name] = new Uint8Array(await f.blob.arrayBuffer());
  }
  const zipped = zipSync(entries);
  return new Blob([zipped as unknown as BlobPart], {
    type: "application/zip",
  });
};
