"use server";

import { db } from "@/db";
import { categories } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { requireUser } from "./auth-actions";

const VALID_CATEGORY_TYPES = ["income", "expense"] as const;

function isValidCategoryType(type: string): type is "income" | "expense" {
  return VALID_CATEGORY_TYPES.includes(type as "income" | "expense");
}

export async function getCategories(type?: string) {
  const user = await requireUser();

  const conditions = [eq(categories.userId, user.id)];

  if (type && isValidCategoryType(type)) {
    conditions.push(eq(categories.type, type));
  }

  return db
    .select()
    .from(categories)
    .where(and(...conditions))
    .orderBy(categories.type, categories.name);
}
