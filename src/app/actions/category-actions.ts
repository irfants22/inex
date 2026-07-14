"use server";

import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireUser } from "./auth-actions";

export async function getCategories() {
  const user = await requireUser();

  return db
    .select()
    .from(categories)
    .where(eq(categories.userId, user.id))
    .orderBy(categories.type);
}
