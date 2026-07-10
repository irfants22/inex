"use client";

import { logout } from "@/app/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Home() {
  return (
    <div className="flex flex-col gap-2">
      <Button onClick={() => logout()}>Logout</Button>
      <Button
        onClick={() =>
          toast.success("Berhasil", {
            description: "Berhasil melakukan aksi",
            descriptionClassName: "!text-black",
          })
        }
      >
        Show Toast
      </Button>
    </div>
  );
}
