import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/api-guard";
import { uploadImageViaApi } from "@/lib/storage/upload-proxy";

const MAX_BYTES = 20 * 1024 * 1024;

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

  try {
    const { publicUrl } = await uploadImageViaApi("activities", file);
    return NextResponse.json({ data: { publicUrl } });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ message }, { status: 502 });
  }
};
