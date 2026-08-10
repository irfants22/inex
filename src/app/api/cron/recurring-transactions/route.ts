import { db } from "@/db";
import { recurringTransactions, transactions } from "@/db/schema";
import { calculateNextRun, parseToDateFormat } from "@/lib/utils";
import { parse } from "date-fns";
import { and, eq, lte } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const today = parseToDateFormat(new Date());

  const dueRecurring = await db
    .select()
    .from(recurringTransactions)
    .where(
      and(
        eq(recurringTransactions.isActive, true),
        lte(recurringTransactions.nextRun, today),
      ),
    );

  const results = { processed: 0, failed: 0, errors: [] as string[] };

  for (const recurring of dueRecurring) {
    try {
      await db.transaction(async (trx) => {
        await trx.insert(transactions).values({
          userId: recurring.userId,
          categoryId: recurring.categoryId,
          recurringTransactionId: recurring.id,
          amount: String(recurring.amount),
          note: recurring.note || null,
          transactionDate: recurring.nextRun,
        });

        const newNextRun = calculateNextRun(
          parse(recurring.nextRun, "yyyy-MM-dd", new Date()),
          recurring.frequency,
        );

        const isExpired =
          recurring.endDate &&
          newNextRun > parse(recurring.endDate, "yyyy-MM-dd", new Date());

        await trx
          .update(recurringTransactions)
          .set({
            nextRun: parseToDateFormat(newNextRun),
            isActive: isExpired ? false : recurring.isActive,
          })
          .where(eq(recurringTransactions.id, recurring.id));
      });

      results.processed++;
    } catch (error) {
      results.failed++;
      results.errors.push(
        `Failed to process recurring ${recurring.id}: ${error}`,
      );
      console.error(`Failed to process recurring ${recurring.id}:`, error);
    }
  }

  return NextResponse.json(results);
}
