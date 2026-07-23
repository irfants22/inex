"use client";

import { userStore } from "@/stores/user-store";
import { Button } from "../ui/button";
import { LogIn, LogOut, Wallet } from "lucide-react";
import { logout } from "@/app/actions/auth-actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SidebarTrigger } from "../ui/sidebar";

type NavbarProps = {
  showSidebarTrigger?: boolean;
};

export default function Navbar({ showSidebarTrigger = false }: NavbarProps) {
  const profile = userStore((state) => state.profile);
  const profileName = profile?.fullName.split(" ")[0] || "User";

  return (
    <header className="sticky top-0 z-50 flex w-full items-center border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
      <div className="w-fit">
        {showSidebarTrigger && <SidebarTrigger className="cursor-pointer" />}
      </div>
      <nav className="mx-auto flex h-16 w-full max-w-6xl flex-1 items-center justify-between px-2">
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-all"
        >
          <div className="flex items-center justify-center rounded-lg bg-emerald-500 p-2 text-white shadow-sm shadow-emerald-500/20 transition-transform group-hover:scale-105">
            <Wallet className="size-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            IN<span className="text-emerald-500">EX</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {profile && (
            <div className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-slate-50 py-1 pr-1.5 pl-1.5 shadow-2xs sm:pl-3">
              <span className="text-muted-foreground hidden text-xs font-medium sm:block">
                Hi,{" "}
                <span className="font-semibold text-black">{profileName}</span>
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold text-white">
                {profileName.charAt(0).toUpperCase()}
              </div>
            </div>
          )}

          {profile ? (
            <Button
              size="sm"
              variant="outline"
              className="cursor-pointer gap-1.5 border-slate-200 transition-colors hover:border-red-200 hover:bg-rose-50 hover:text-rose-500"
              onClick={() => logout()}
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline-block">Logout</span>
            </Button>
          ) : (
            <Button
              size="sm"
              className="cursor-pointer gap-1.5 bg-emerald-500 text-white shadow-sm shadow-emerald-500/10 transition-all hover:bg-emerald-600/80 hover:shadow-emerald-500/20"
              onClick={() => redirect("/login")}
            >
              <LogIn className="size-4" />
              <span>Login</span>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
