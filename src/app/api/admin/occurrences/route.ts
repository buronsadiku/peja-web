import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { activityOccurrences } from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/auth/api-guard";

const createSchema = z.object({
  templateId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
  endTime: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
  capacity: z.number().int().min(0),
  location: z.string().nullable().optional(),
  meetingPoint: z.string().nullable().optional(),
});

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
    .insert(activityOccurrences)
    .values(parsed.data)
    .returning();

  return NextResponse.json({ data: created }, { status: 201 });
};
