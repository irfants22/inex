import BalanceCard from "./_components/balance-card";

export const metadata = {
  title: "INEX | Home",
};

export default function Home() {
  return (
    <div className="flex justify-center p-4">
      <BalanceCard />
    </div>
  );
}
