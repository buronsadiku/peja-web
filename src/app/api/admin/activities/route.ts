import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { activityTemplates } from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/auth/api-guard";

const createSchema = z.object({
  nameEn: z.string().min(1),
  nameSq: z.string().nullable().optional(),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "slug must be lowercase letters/numbers/dashes"),
  descriptionEn: z.string().nullable().optional(),
  descriptionSq: z.string().nullable().optional(),
  contactPhone1: z.string().max(40).nullable().optional(),
  contactPhone2: z.string().max(40).nullable().optional(),
  category: z.string().min(1).regex(/^[a-z][a-z0-9_-]*$/),
});

export const GET = async (request: Request) => {
  const guard = await requireAdminApi(request);
  if (guard.response) return guard.response;

  const rows = await db.select().from(activityTemplates);
  return NextResponse.json({ data: rows });
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

  const [created] = await db
    .insert(activityTemplates)
    .values(parsed.data)
    .returning();

  return NextResponse.json({ data: created }, { status: 201 });
};
