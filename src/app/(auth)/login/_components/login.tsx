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
import { LoginForm, loginSchemaForm } from "@/validations/auth-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export default function Login() {
  const { handleSubmit, control } = useForm<LoginForm>({
    resolver: zodResolver(loginSchemaForm),
    defaultValues: INITIAL_LOGIN_FORM,
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

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
            {/* {isPending ? <Loader2 className="animate-spin" /> : "Sign Up"} */}
            Sign Up
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
