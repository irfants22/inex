"use server";

import { TransactionFormState } from "@/types/transaction";
import { requireUser } from "./auth-actions";
import { transactionFormSchema } from "@/validations/transaction-validation";
import z from "zod";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function createTransaction(
  prevState: TransactionFormState,
  formData: FormData,
): Promise<TransactionFormState> {
  const user = await requireUser();

  const validatedFields = transactionFormSchema.safeParse({
    categoryId: formData.get("categoryId"),
    amount: formData.get("amount"),
    note: formData.get("note"),
    transactionDate: formData.get("transactionDate"),
  });

  if (!validatedFields.success) {
    const tree = z.treeifyError(validatedFields.error);
    return {
      status: "error",
      errors: {
        categoryId: tree.properties?.categoryId?.errors,
        amount: tree.properties?.amount?.errors,
        note: tree.properties?.note?.errors,
        transactionDate: tree.properties?.transactionDate?.errors,
        _form: tree.errors,
      },
    };
  }

  const { categoryId, amount, note, transactionDate } = validatedFields.data;

  try {
    await db.insert(transactions).values({
      userId: user.id,
      categoryId,
      amount: String(amount),
      note: note || null,
      transactionDate,
    });
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: ["Failed to save transaction, please try again"],
      },
    };
  }

  revalidatePath("/home", "layout");

  return { status: "success" };
}
