"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import DialogCreateCategory from "./dialog-create-category";

export default function CategoryHeader() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-y-6 rounded-lg px-4">
      <div>
        <h1 className="text-2xl leading-tight font-medium">Categories</h1>
        <p className="text-sm">Manage your income and expense categories.</p>
      </div>
      <div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button className="rounded-lg bg-emerald-500 px-3 py-5 text-white hover:bg-emerald-600/80">
                <Plus className="size-4" />
                New Category
              </Button>
            }
          />
          <DialogCreateCategory setOpen={setOpen} />
        </Dialog>
      </div>
    </div>
  );
}
