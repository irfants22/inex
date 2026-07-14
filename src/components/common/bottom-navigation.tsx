"use client";

import { NAVIGATION_LIST } from "@/constants/navigation";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import DialogCreateTransaction from "./dialog-create-transaction";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { useState } from "react";

export default function BottomNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <div className="sticky bottom-5 h-12 w-full">
      <nav className="flex h-full w-full items-center justify-center">
        <div className="flex h-full items-center justify-center gap-x-4 rounded-lg bg-white/30 px-4 py-8">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
              render={
                <Button className="scale-110 rounded-lg bg-emerald-500 hover:bg-emerald-600">
                  <Plus />
                </Button>
              }
            />
            <DialogCreateTransaction setOpen={setOpen} />
          </Dialog>
          {NAVIGATION_LIST.map((item, index) => (
            <Link
              href={item.href}
              key={index + 1}
              className={cn(
                "text-muted-foreground flex h-fit w-fit flex-col items-center justify-center gap-1 rounded-md p-1 hover:text-emerald-500",
                {
                  "text-emerald-500": pathname === item.href,
                },
              )}
            >
              <item.icon size={20} />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
