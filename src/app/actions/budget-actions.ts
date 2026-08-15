"use server";

import { BudgetFormState } from "@/types/budget";
import { requireUser } from "./auth-actions";
import { budgetFormSchema } from "@/validations/budget-validation";
import { z } from "zod";
import { db } from "@/db";
import { budgets } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function setBudgetLimit(
  prevState: BudgetFormState,
  formData: FormData,
): Promise<BudgetFormState> {
  const user = await requireUser();

  const validatedField = budgetFormSchema.safeParse({
    monthlyLimit: formData.get("monthlyLimit"),
  });

  if (!validatedField.success) {
    const tree = z.treeifyError(validatedField.error);
    return {
      status: "error",
      errors: {
        monthlyLimit: tree.properties?.monthlyLimit?.errors,
        _form: tree.errors,
      },
    };
  }

  const { monthlyLimit } = validatedField.data;

  try {
    await db
      .insert(budgets)
      .values({
        userId: user.id,
        monthlyLimit: String(monthlyLimit),
      })
      .onConflictDoUpdate({
        target: budgets.userId,
        set: { monthlyLimit: String(monthlyLimit) },
      });
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: ["Failed to save budget, please try again"],
      },
    };
  }

  revalidatePath("/budget");

  return { status: "success" };
}
