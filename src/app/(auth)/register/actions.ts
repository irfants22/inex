"use server";

import { createClient } from "@/lib/supabase/server";
import { RegisterFormState } from "@/types/auth";
import { registerSchemaForm } from "@/validations/auth-validation";
import z from "zod";

export async function register(
  prevState: RegisterFormState,
  formData: FormData,
): Promise<RegisterFormState> {
  const validatedFields = registerSchemaForm.safeParse({
    email: formData.get("email"),
    fullName: formData.get("fullName"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    const tree = z.treeifyError(validatedFields.error);
    return {
      status: "error",
      errors: {
        email: tree.properties?.email?.errors,
        fullName: tree.properties?.fullName?.errors,
        password: tree.properties?.password?.errors,
        confirmPassword: tree.properties?.confirmPassword?.errors,
        _form: tree.errors,
      },
    } satisfies RegisterFormState;
  }

  const { fullName, email, password } = validatedFields.data;

  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: [error.message],
      },
    };
  }

  return {
    status: "success",
  };
}
