import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { registrations } from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/auth/api-guard";

const patchSchema = z.object({
  fullName: z.string().min(1).optional(),
  phone: z.string().min(3).optional(),
  email: z.string().email().optional(),
  notifyIfAbsent: z.boolean().optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export const PATCH = async (request: Request, { params }: Ctx) => {
  const guard = await requireAdminApi(request);
  if (guard.response) return guard.response;

  const { id } = await params;
  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "validation error", errors: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const [updated] = await db
    .update(registrations)
    .set(parsed.data)
    .where(eq(registrations.id, id))
    .returning();

  if (!updated) {
    return NextResponse.json({ message: "not found" }, { status: 404 });
  }

  return NextResponse.json({ data: updated });
};

export const DELETE = async (request: Request, { params }: Ctx) => {
  const guard = await requireAdminApi(request);
  if (guard.response) return guard.response;

  const { id } = await params;
  const [deleted] = await db
    .delete(registrations)
    .where(eq(registrations.id, id))
    .returning({ id: registrations.id });

  if (!deleted) {
    return NextResponse.json({ message: "not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
};
