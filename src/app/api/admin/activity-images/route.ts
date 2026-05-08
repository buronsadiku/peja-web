import { NextResponse } from "next/server";
import { and, asc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { activityImages } from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/auth/api-guard";

const createSchema = z.object({
  templateId: z.string().uuid(),
  url: z.string().url(),
  alt: z.string().default(""),
  sortOrder: z.number().int().default(0),
  isCover: z.boolean().default(false),
});

export const GET = async (request: Request) => {
  const guard = await requireAdminApi(request);
  if (guard.response) return guard.response;

  const url = new URL(request.url);
  const templateId = url.searchParams.get("templateId");

  const data = await db
    .select()
    .from(activityImages)
    .where(templateId ? eq(activityImages.templateId, templateId) : undefined)
    .orderBy(asc(activityImages.sortOrder));
  return NextResponse.json({ data });
};

export const POST = async (request: Request) => {
  const guard = await requireAdminApi(request);
  if (guard.response) return guard.response;

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "validation error", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const result = await db.transaction(async (tx) => {
    if (parsed.data.isCover) {
      await tx
        .update(activityImages)
        .set({ isCover: false })
        .where(eq(activityImages.templateId, parsed.data.templateId));
    }
    const [created] = await tx
      .insert(activityImages)
      .values(parsed.data)
      .returning();
    return created;
  });

  return NextResponse.json({ data: result }, { status: 201 });
};
