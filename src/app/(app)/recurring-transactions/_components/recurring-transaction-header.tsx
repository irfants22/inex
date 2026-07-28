"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import DialogCreateRecurringTransaction from "./dialog-create-recurring-transaction";

export default function RecurringTransactionHeader() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-y-6 rounded-lg px-4">
      <div className="space-y-1.5">
        <h1 className="text-2xl leading-tight font-medium">
          Recurring Transactions
        </h1>
        <p className="text-sm">
          Manage schedules that create transactions automatically.
        </p>
      </div>
      <div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button className="rounded-lg bg-emerald-500 px-3 py-5 text-white hover:bg-emerald-600/80">
                <Plus className="size-4" />
                New Recurring
              </Button>
            }
          />
          <DialogCreateRecurringTransaction open={open} setOpen={setOpen} />
        </Dialog>
      </div>
    </div>
  );
}
