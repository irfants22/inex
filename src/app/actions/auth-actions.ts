"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
