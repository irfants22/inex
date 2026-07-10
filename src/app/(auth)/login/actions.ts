"use server";

import { createClient } from "@/lib/supabase/server";
import { LoginFormState } from "@/types/auth";
import { loginSchemaForm } from "@/validations/auth-validation";
import z from "zod";

export async function login(
  prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const validatedFields = loginSchemaForm.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    const tree = z.treeifyError(validatedFields.error);
    return {
      status: "error",
      errors: {
        email: tree.properties?.email?.errors,
        password: tree.properties?.password?.errors,
        _form: tree.errors,
      },
    };
  }

  const { email, password } = validatedFields.data;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    let message = "Terjadi kesalahan, silakan coba lagi";

    if (error.message.includes("Invalid login credentials")) {
      message = "Email atau password salah";
    } else if (error.message.includes("Email not confirmed")) {
      message = "Email belum diverifikasi, silakan cek inbox Anda";
    }

    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [message],
      },
    };
  }

  return {
    status: "success",
  };
}
