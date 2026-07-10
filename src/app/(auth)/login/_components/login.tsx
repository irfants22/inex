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
import { INITIAL_LOGIN_FORM } from "@/constants/auth";
import { LoginFormState } from "@/types/auth";
import { LoginForm, loginSchemaForm } from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { login } from "../actions";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const initialStateLogin: LoginFormState = {};

export default function Login() {
  const router = useRouter();
  const { handleSubmit, control } = useForm<LoginForm>({
    resolver: zodResolver(loginSchemaForm),
    defaultValues: INITIAL_LOGIN_FORM,
  });

  const [loginState, loginAction, isPendingLogin] = useActionState(
    login,
    initialStateLogin,
  );

  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    startTransition(() => loginAction(formData));
  });

  useEffect(() => {
    if (loginState.status === "success") {
      router.push("/home");
      console.log("Login Berhasil");
    }
  }, [loginState, router]);

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Masuk</CardTitle>
        <CardDescription>
          Selamat datang kembali! Silakan masuk ke akun Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={onSubmit}
          className="space-y-4 flex flex-col items-center"
        >
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
          <Button type="submit" className="w-full mt-3">
            {isPendingLogin ? <Loader2 className="animate-spin" /> : "Masuk"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
