"use server";

import { db } from "@/db";
import { profiles } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getProfile() {
  const user = await getUser();
  if (!user) return null;

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, user?.id));

  return profile ?? null;
}

export async function logout() {
  const supabase = await createClient();

  try {
    const { data: claimsData } = await supabase.auth.getClaims();

    if (claimsData?.claims) await supabase.auth.signOut();

    revalidatePath("/", "layout");
  } catch (error) {
    console.error("Error signing out:", error);
  }
  redirect("/login");
}
