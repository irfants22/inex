"use client";

import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import DialogCreateTransaction from "./dialog-create-transaction";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { useState } from "react";

export default function FloatingActionButton() {
  const [open, setOpen] = useState(false);
  return (
    <div className="sticky bottom-8 flex h-12 w-full items-center justify-end px-8">
      <div className="h-auto w-fit rounded-full">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button
                className="h-14 w-14 cursor-pointer rounded-full border-2 border-white bg-emerald-500 shadow-md hover:bg-emerald-600/80"
                size="icon-lg"
              >
                <Plus className="size-8" />
              </Button>
            }
          />
          <DialogCreateTransaction open={open} setOpen={setOpen} />
        </Dialog>
      </div>
    </div>
  );
}
