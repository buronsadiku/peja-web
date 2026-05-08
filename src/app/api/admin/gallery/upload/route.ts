import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import { requireAdminApi } from "@/lib/auth/api-guard";
import {
  s3,
  STORAGE_BUCKET,
  STORAGE_PUBLIC_DOMAIN,
} from "@/lib/storage/s3";

const MAX_BYTES = 10 * 1024 * 1024;

const sanitizeFilename = (name: string) =>
  name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-80);

export const POST = async (request: Request) => {
  const guard = await requireAdminApi(request);
  if (guard.response) return guard.response;

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "file required" }, { status: 422 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { message: "only image files allowed" },
      { status: 422 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { message: `file too large (max ${MAX_BYTES / 1024 / 1024}MB)` },
      { status: 422 },
    );
  }

  const key = `public/gallery/${randomUUID()}-${sanitizeFilename(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await s3.send(
    new PutObjectCommand({
      Bucket: STORAGE_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }),
  );

  return NextResponse.json({
    data: { publicUrl: `${STORAGE_PUBLIC_DOMAIN}/${key}` },
  });
};
