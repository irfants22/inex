"use client";

import { userStore } from "@/stores/user-store";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth-actions";

export default function Navbar() {
  const profile = userStore((state) => state.profile);
  return (
    <header className="sticky top-0 h-12 w-full bg-emerald-500 px-4 py-6">
      <nav className="flex h-full w-full items-center justify-between">
        <div>
          <p className="text-lg font-medium text-white">
            <span className="text-lg font-semibold text-black">INEX | </span>
            {`Hi ${profile?.fullName.split(" ")[0]}!`}
          </p>
        </div>
        <Button
          size="sm"
          className="rounded-md bg-white text-emerald-500 hover:bg-emerald-400 hover:text-white"
          onClick={() => logout()}
        >
          <LogOut />
          <p className="ml-1 text-sm font-normal">Logout</p>
        </Button>
      </nav>
    </header>
  );
}
