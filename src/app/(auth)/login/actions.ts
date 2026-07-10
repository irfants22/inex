"use server";

import { createClient } from "@/lib/supabase/server";
import { LoginFormState } from "@/types/auth";
import { loginSchemaForm } from "@/validations/auth-validation";
import { revalidatePath } from "next/cache";
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
    let message = "An error occurred, please try again";

    if (error.message.includes("Invalid login credentials")) {
      message = "Incorrect email or password";
    } else if (error.message.includes("Email not confirmed")) {
      message = "Email not verified, please check your inbox";
    }

    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [message],
      },
    };
  }

  revalidatePath("/", "layout");

  return {
    status: "success",
  };
}
