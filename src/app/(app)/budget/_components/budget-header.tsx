"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { BudgetData } from "@/types/budget";
import { Pencil } from "lucide-react";
import { useState } from "react";
import DialogEditLimit from "./dialog-edit-limit";

export default function BudgetHeader({
  budget,
}: {
  budget: BudgetData | null;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-y-6 rounded-lg px-4">
      <div className="space-y-1.5">
        <h1 className="text-2xl leading-tight font-medium">Budget</h1>
        <p className="text-sm">Set and track your monthly spending limit.</p>
      </div>
      {budget && (
        <div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
              render={
                <Button className="rounded-lg bg-emerald-500 px-3 py-5 text-white hover:bg-emerald-600/80">
                  <Pencil className="size-4" />
                  Edit Limit
                </Button>
              }
            />
            <DialogEditLimit open={open} setOpen={setOpen} budget={budget} />
          </Dialog>
        </div>
      )}
    </div>
  );
}
