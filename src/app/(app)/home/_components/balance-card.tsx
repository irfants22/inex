import { MoveDown, MoveUp, Wallet } from "lucide-react";

export default function BalanceCard() {
  return (
    <div className="flex w-full flex-wrap items-center gap-2">
      <div className="gap-.5 flex flex-1 flex-col rounded-md bg-white p-2">
        <div className="flex flex-col justify-center gap-1 p-2">
          <div className="flex items-center gap-1">
            <div className="text-muted-foreground h-fit w-fit rounded-full bg-black/20 p-1">
              <Wallet size={12} />
            </div>
            <p className="text-muted-foreground text-xs font-normal">
              Total Balance
            </p>
          </div>
          <p className="text-3xl font-semibold text-emerald-500">
            Rp 5.000.000
          </p>
        </div>
      </div>

      <div className="gap-.5 flex flex-1 flex-col rounded-md bg-sky-500 p-2">
        <div className="flex flex-col justify-center gap-1 p-2">
          <div className="flex items-center gap-1">
            <div className="h-fit w-fit rounded-full bg-black/20 p-1 text-white">
              <MoveUp size={12} />
            </div>
            <p className="text-xs font-normal text-white">This Month Income</p>
          </div>
          <p className="text-3xl font-semibold text-white">Rp 1.500.000</p>
        </div>
      </div>

      <div className="gap-.5 flex flex-1 flex-col rounded-md bg-rose-500 p-2">
        <div className="flex flex-col justify-center gap-1 p-2">
          <div className="flex items-center gap-1">
            <div className="h-fit w-fit rounded-full bg-black/20 p-1 text-white">
              <MoveDown size={12} />
            </div>
            <p className="text-xs font-normal text-white">This Month Expense</p>
          </div>
          <p className="text-3xl font-semibold text-white">Rp 1.000.000</p>
        </div>
      </div>
    </div>
  );
}
