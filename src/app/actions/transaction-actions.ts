"use server";

import { requireUser } from "./auth-actions";
import { db } from "@/db";
import { categories, transactions } from "@/db/schema";
import { and, desc, eq, gte, lt, sql } from "drizzle-orm";
import { TransactionFormState } from "@/types/transaction";
import { transactionFormSchema } from "@/validations/transaction-validation";
import z from "zod";
import { revalidatePath } from "next/cache";
import { format } from "date-fns";

const VALID_CATEGORY_TYPES = ["income", "expense"] as const;

function isValidCategoryType(type: string): type is "income" | "expense" {
  return VALID_CATEGORY_TYPES.includes(type as "income" | "expense");
}

export async function getTransactions(
  month: number,
  year: number,
  type: string,
) {
  const user = await requireUser();

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  const conditions = [
    eq(transactions.userId, user.id),
    gte(transactions.transactionDate, format(startDate, "yyyy-MM-dd")),
    lt(transactions.transactionDate, format(endDate, "yyyy-MM-dd")),
  ];

  if (type !== "all" && isValidCategoryType(type)) {
    conditions.push(eq(categories.type, type));
  }

  return db
    .select({
      id: transactions.id,
      amount: transactions.amount,
      note: transactions.note,
      transactionDate: transactions.transactionDate,
      categoryId: categories.id,
      categoryName: categories.name,
      categoryType: categories.type,
      categoryIcon: categories.icon,
      categoryColor: categories.color,
    })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(and(...conditions))
    .orderBy(desc(transactions.transactionDate), desc(transactions.id));
}

export async function getDashboardSummary() {
  const user = await requireUser();

  const now = new Date();
  const startOfMonth = format(
    new Date(now.getFullYear(), now.getMonth(), 1),
    "yyyy-MM-dd",
  );
  const startOfNextMonth = format(
    new Date(now.getFullYear(), now.getMonth() + 1, 1),
    "yyyy-MM-dd",
  );

  const [summary] = await db
    .select({
      totalIncome: sql<string>`
        coalesce(sum(case when ${categories.type} = 'income' then ${transactions.amount} else 0 end), 0)
      `,
      totalExpense: sql<string>`
        coalesce(sum(case when ${categories.type} = 'expense' then ${transactions.amount} else 0 end), 0)
      `,
      monthIncome: sql<string>`
        coalesce(sum(case when ${categories.type} = 'income' and ${transactions.transactionDate} >= ${startOfMonth} and ${transactions.transactionDate} < ${startOfNextMonth} then ${transactions.amount} else 0 end), 0)
      `,
      monthExpense: sql<string>`
        coalesce(sum(case when ${categories.type} = 'expense' and ${transactions.transactionDate} >= ${startOfMonth} and ${transactions.transactionDate} < ${startOfNextMonth} then ${transactions.amount} else 0 end), 0)
      `,
    })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(eq(transactions.userId, user.id));

  const totalBalance =
    Number(summary.totalIncome) - Number(summary.totalExpense);

  return {
    totalBalance,
    monthIncome: Number(summary.monthIncome),
    monthExpense: Number(summary.monthExpense),
  };
}

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

  revalidatePath("/home");
  revalidatePath("/transactions");

  return { status: "success" };
}

export async function updateTransaction(
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
    await db
      .update(transactions)
      .set({
        categoryId,
        amount: String(amount),
        note: note || null,
        transactionDate,
      })
      .where(
        and(
          eq(transactions.userId, user.id),
          eq(transactions.id, formData.get("id") as string),
        ),
      );
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

  revalidatePath("/home");
  revalidatePath("/transactions");

  return { status: "success" };
}

export async function deleteTransaction(
  prevState: TransactionFormState,
  formData: FormData,
): Promise<TransactionFormState> {
  const user = await requireUser();

  const transactionId = formData.get("id") as string;

  try {
    const result = await db
      .delete(transactions)
      .where(
        and(
          eq(transactions.id, transactionId),
          eq(transactions.userId, user.id),
        ),
      )
      .returning({ id: transactions.id });

    if (result.length === 0) {
      return {
        status: "error",
        errors: {
          ...prevState.errors,
          _form: ["Transaction not found"],
        },
      };
    }
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: ["Failed to delete transaction, please try again"],
      },
    };
  }

  revalidatePath("/home");
  revalidatePath("/transactions");

  return {
    status: "success",
  };
}
