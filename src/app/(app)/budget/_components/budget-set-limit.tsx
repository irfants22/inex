"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Coins, Plus } from "lucide-react";
import { useState } from "react";
import DialogSetLimit from "./dialog-set-limit";

export default function BudgetSetLimit() {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full px-4 py-2">
      <div className="flex w-full flex-col items-center justify-center gap-5 rounded-md bg-slate-100/60 px-3 py-32">
        <div className="flex aspect-square w-12 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Coins />
        </div>
        <p className="max-w-80 text-center text-sm text-wrap">
          Set a monthly spending limit to track how much you've spent and get
          warned when you're close to going over.
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button className="rounded-lg bg-emerald-500 px-3 py-5 text-white hover:bg-emerald-600/80">
                <Plus className="size-4" />
                Set Monthly Limit
              </Button>
            }
          />
          <DialogSetLimit open={open} setOpen={setOpen} />
        </Dialog>
      </div>
    </div>
  );
}
