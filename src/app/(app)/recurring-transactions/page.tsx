import RecurringTransaction from "./_components/recurring-transaction";

export const metadata = {
  title: "INEX | Recurring Transactions",
};

export default async function RecurringTransactionPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  return <RecurringTransaction searchParams={params} />;
}
