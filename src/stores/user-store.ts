import { Profile } from "@/types/auth";
import { User } from "@supabase/supabase-js";
import { create } from "zustand";

type UserStoreState = {
  user: User | null;
  profile: Profile | null;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
};

export const userStore = create<UserStoreState>((set) => ({
  user: null,
  profile: null,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
}));
