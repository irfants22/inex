"use server";

import { db } from "@/db";
import { categories } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { requireUser } from "./auth-actions";
import { CategoryFormState } from "@/types/category";
import { categoryFormSchema } from "@/validations/category-validation";
import z from "zod";
import { revalidatePath } from "next/cache";

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

export async function createCategory(
  prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const user = await requireUser();

  const validatedField = categoryFormSchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    color: formData.get("color"),
    icon: formData.get("icon"),
  });

  if (!validatedField.success) {
    const tree = z.treeifyError(validatedField.error);
    return {
      status: "error",
      errors: {
        name: tree.properties?.name?.errors,
        type: tree.properties?.type?.errors,
        icon: tree.properties?.icon?.errors,
        color: tree.properties?.color?.errors,
        _form: tree.errors,
      },
    };
  }

  const { name, type, icon, color } = validatedField.data;

  try {
    await db.insert(categories).values({
      userId: user.id,
      name,
      type,
      icon,
      color,
    });
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: ["Failed to save categories, please try again"],
      },
    };
  }

  revalidatePath("/categories");

  return { status: "success" };
}

export async function updateCategory(
  prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const user = await requireUser();

  const validatedFields = categoryFormSchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    icon: formData.get("icon"),
    color: formData.get("color"),
  });

  if (!validatedFields.success) {
    const tree = z.treeifyError(validatedFields.error);
    return {
      status: "error",
      errors: {
        name: tree.properties?.name?.errors,
        type: tree.properties?.type?.errors,
        icon: tree.properties?.icon?.errors,
        color: tree.properties?.color?.errors,
        _form: tree.errors,
      },
    };
  }

  const { name, type, icon, color } = validatedFields.data;

  try {
    await db
      .update(categories)
      .set({
        name,
        type,
        icon,
        color,
      })
      .where(
        and(
          eq(categories.userId, user.id),
          eq(categories.id, formData.get("id") as string),
        ),
      );
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: ["Failed to save category, please try again"],
      },
    };
  }

  revalidatePath("/categories");

  return {
    status: "success",
  };
}

export async function deleteCategory(
  prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const user = await requireUser();

  const categoryId = formData.get("id") as string;

  try {
    const result = await db
      .delete(categories)
      .where(and(eq(categories.id, categoryId), eq(categories.userId, user.id)))
      .returning({ id: categories.id });

    if (result.length === 0) {
      return {
        status: "error",
        errors: {
          ...prevState.errors,
          _form: ["Category not found"],
        },
      };
    }
  } catch (error) {
    const cause = error instanceof Error ? error.cause : undefined;

    if (
      cause &&
      typeof cause === "object" &&
      "code" in cause &&
      cause.code === "23503"
    ) {
      return {
        status: "error",
        errors: {
          ...prevState.errors,
          _form: ["This category is still used by existing transactions"],
        },
      };
    }

    console.error(error);
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: ["Failed to delete category, please try again"],
      },
    };
  }

  revalidatePath("/categories");

  return { status: "success" };
}
