import Transaction from "./_components/transaction";

export const metadata = {
  title: "INEX | Transactions",
};

export default async function TransactionPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string; type?: string }>;
}) {
  const params = await searchParams;
  return <Transaction searchParams={params} />;
}
