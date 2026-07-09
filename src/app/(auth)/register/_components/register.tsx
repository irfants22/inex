"use client";

import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { INITIAL_REGISTER_FORM } from "@/constants/auth";
import {
  RegisterForm,
  registerSchemaForm,
} from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { register } from "../actions";
import { RegisterFormState } from "@/types/auth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const initialStateRegister: RegisterFormState = {};

export default function Register() {
  const router = useRouter();
  const { handleSubmit, control } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchemaForm),
    defaultValues: INITIAL_REGISTER_FORM,
  });

  const [registerState, registerAction, isPendingRegister] = useActionState(
    register,
    initialStateRegister,
  );

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(() => registerAction(formData));
  });

  useEffect(() => {
    if (registerState.status === "success") {
      router.push("/login");
      console.log("Register Berhasil");
    }
  }, [registerState, router]);

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Daftar</CardTitle>
        <CardDescription>
          Buat akun baru untuk mulai menggunakan platform kami.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={onSubmit}
          className="space-y-4 flex flex-col items-center"
        >
          <FormInput
            name="fullName"
            control={control}
            label="Full Name"
            type="text"
            placeholder="Masukkan Full Name"
          />
          <FormInput
            name="email"
            control={control}
            label="Email"
            type="email"
            placeholder="Masukkan Email"
          />
          <FormInput
            name="password"
            control={control}
            label="Password"
            type="password"
            placeholder="Masukkan Password"
          />
          <FormInput
            name="confirmPassword"
            control={control}
            label="Confirm Password"
            type="password"
            placeholder="Masukkan Confirm Password"
          />
          <Button
            type="submit"
            className="w-full mt-3"
            disabled={isPendingRegister}
          >
            {isPendingRegister ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Daftar"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
