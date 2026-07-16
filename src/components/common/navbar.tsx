"use client";

import { userStore } from "@/stores/user-store";
import { Button } from "../ui/button";
import { LogIn, LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth-actions";
import { redirect } from "next/navigation";

export default function Navbar() {
  const profile = userStore((state) => state.profile);
  const profileName = profile?.fullName.split(" ")[0] || "User";
  return (
    <header className="sticky top-0 h-12 w-full bg-emerald-500 px-4 py-7">
      <nav className="flex h-full w-full items-center justify-between">
        <div>
          <p className="text-lg font-medium text-white">
            <span className="text-lg font-semibold text-black">INEX</span>
            {profile && (
              <span className="text-lg font-semibold text-black"> | </span>
            )}
            {profile && `Hi ${profileName}!`}
          </p>
        </div>
        {profile ? (
          <Button
            size="sm"
            className="rounded-md bg-white text-emerald-500 hover:bg-emerald-600 hover:text-white"
            onClick={() => logout()}
          >
            <LogOut />
            <p className="ml-1 text-sm font-normal">Logout</p>
          </Button>
        ) : (
          <Button
            size="sm"
            className="rounded-md bg-white text-emerald-500 hover:bg-emerald-600 hover:text-white"
            onClick={() => redirect("/login")}
          >
            <LogIn />
            <p className="ml-1 text-sm font-normal">Login</p>
          </Button>
        )}
      </nav>
    </header>
  );
}
