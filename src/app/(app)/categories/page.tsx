import Category from "./_components/category";

export const metadata = {
  title: "INEX | Categories",
};

export default async function CategoryPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  return <Category searchParams={params} />;
}
