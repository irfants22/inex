"use server";

import { categories, recurringTransactions } from "@/db/schema";
import { requireUser } from "./auth-actions";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { recurringTransactionFormSchema } from "@/validations/recurring-transaction-validation";
import { RecurringTransactionFormState } from "@/types/recurring-transaction";
import z from "zod";
import { revalidatePath } from "next/cache";

const VALID_RECURRING_STATUS = ["active", "inactive"] as const;

function isValidRecurringStatus(
  status: string,
): status is "active" | "inactive" {
  return VALID_RECURRING_STATUS.includes(status as "active" | "inactive");
}

function parseRecurringStatus(value: string): boolean | undefined {
  switch (value) {
    case "active":
      return true;

    case "inactive":
      return false;

    default:
      return undefined;
  }
}

export async function getRecurringTransactions(status: string) {
  const user = await requireUser();

  const conditions = [eq(recurringTransactions.userId, user.id)];

  const activeStatus = parseRecurringStatus(status);

  if (activeStatus !== undefined && isValidRecurringStatus(status)) {
    conditions.push(eq(recurringTransactions.isActive, activeStatus));
  }

  return db
    .select({
      id: recurringTransactions.id,
      amount: recurringTransactions.amount,
      note: recurringTransactions.note,
      frequency: recurringTransactions.frequency,
      nextRun: recurringTransactions.nextRun,
      endDate: recurringTransactions.endDate,
      isActive: recurringTransactions.isActive,
      categoryId: categories.id,
      categoryName: categories.name,
      categoryType: categories.type,
      categoryIcon: categories.icon,
      categoryColor: categories.color,
    })
    .from(recurringTransactions)
    .innerJoin(categories, eq(recurringTransactions.categoryId, categories.id))
    .where(and(...conditions))
    .orderBy(
      desc(recurringTransactions.nextRun),
      desc(recurringTransactions.id),
    );
}

export async function createRecurringTransaction(
  prevState: RecurringTransactionFormState,
  formData: FormData,
): Promise<RecurringTransactionFormState> {
  const user = await requireUser();

  const validatedFields = recurringTransactionFormSchema.safeParse({
    categoryId: formData.get("categoryId"),
    amount: formData.get("amount"),
    note: formData.get("note"),
    frequency: formData.get("frequency"),
    nextRun: formData.get("nextRun"),
    endDate: formData.get("endDate"),
    isActive: formData.get("isActive") === "true",
  });

  if (!validatedFields.success) {
    const tree = z.treeifyError(validatedFields.error);
    return {
      status: "error",
      errors: {
        categoryId: tree.properties?.categoryId?.errors,
        amount: tree.properties?.amount?.errors,
        note: tree.properties?.note?.errors,
        frequency: tree.properties?.frequency?.errors,
        nextRun: tree.properties?.nextRun?.errors,
        endDate: tree.properties?.endDate?.errors,
        isActive: tree.properties?.isActive?.errors,
        _form: tree.errors,
      },
    };
  }

  const { categoryId, amount, note, frequency, nextRun, endDate, isActive } =
    validatedFields.data;

  try {
    await db.insert(recurringTransactions).values({
      userId: user.id,
      categoryId,
      amount: String(amount),
      note: note || null,
      frequency,
      nextRun,
      endDate: endDate || null,
      isActive,
    });
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: ["Failed to save recurring transaction, please try again"],
      },
    };
  }

  revalidatePath("/recurring-transactions");
  revalidatePath("/transactions");

  return { status: "success" };
}

export async function updateRecurringTransaction(
  prevState: RecurringTransactionFormState,
  formData: FormData,
): Promise<RecurringTransactionFormState> {
  const user = await requireUser();

  const validatedFields = recurringTransactionFormSchema.safeParse({
    categoryId: formData.get("categoryId"),
    amount: formData.get("amount"),
    note: formData.get("note"),
    frequency: formData.get("frequency"),
    nextRun: formData.get("nextRun"),
    endDate: formData.get("endDate"),
    isActive: formData.get("isActive") === "true",
  });

  if (!validatedFields.success) {
    const tree = z.treeifyError(validatedFields.error);
    return {
      status: "error",
      errors: {
        categoryId: tree.properties?.categoryId?.errors,
        amount: tree.properties?.amount?.errors,
        note: tree.properties?.note?.errors,
        frequency: tree.properties?.frequency?.errors,
        nextRun: tree.properties?.nextRun?.errors,
        endDate: tree.properties?.endDate?.errors,
        isActive: tree.properties?.isActive?.errors,
        _form: tree.errors,
      },
    };
  }

  const { categoryId, amount, note, frequency, nextRun, endDate, isActive } =
    validatedFields.data;

  try {
    await db
      .update(recurringTransactions)
      .set({
        categoryId,
        amount: String(amount),
        note: note || null,
        frequency,
        nextRun,
        endDate: endDate || null,
        isActive,
      })
      .where(
        and(
          eq(recurringTransactions.userId, user.id),
          eq(recurringTransactions.id, formData.get("id") as string),
        ),
      );
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: ["Failed to save recurring transaction, please try again"],
      },
    };
  }

  revalidatePath("/recurring-transactions");
  revalidatePath("/transactions");

  return { status: "success" };
}

export async function updateRecurringStatus(
  id: string,
  value: boolean,
): Promise<{ status: "success" | "error"; message?: string }> {
  const user = await requireUser();

  try {
    const result = await db
      .update(recurringTransactions)
      .set({
        isActive: value,
      })
      .where(
        and(
          eq(recurringTransactions.id, id),
          eq(recurringTransactions.userId, user.id),
        ),
      )
      .returning({ id: recurringTransactions.id });

    if (result.length === 0) {
      return {
        status: "error",
        message: "Recurring transaction not found",
      };
    }
  } catch {
    return {
      status: "error",
      message: "Failed to save recurring transaction, please try again",
    };
  }

  revalidatePath("/recurring-transactions");
  revalidatePath("/transactions");

  return { status: "success" };
}
