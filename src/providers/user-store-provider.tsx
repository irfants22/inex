"use client";

import { userStore } from "@/stores/user-store";
import { Profile } from "@/types/auth";
import { User } from "@supabase/supabase-js";
import { ReactNode, useEffect } from "react";

export default function UserStoreProvider({
  children,
  user,
  profile,
}: {
  children: ReactNode;
  user: User | null;
  profile: Profile | null;
}) {
  useEffect(() => {
    userStore.getState().setUser(user);
    userStore.getState().setProfile(profile);
  }, [user, profile]);

  return <>{children}</>;
}
