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
import Link from "next/link";
import { toast } from "sonner";

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
      toast.success("Login successful", {
        description: "Welcome back! You have successfully logged in",
        descriptionClassName: "!text-black",
      });
    }
    if (loginState?.status === "error") {
      toast.error("Login Failed", {
        description: loginState.errors?._form?.[0],
        descriptionClassName: "!text-black",
      });
    }
  }, [loginState, router]);

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="mb-2 text-start text-4xl font-semibold text-emerald-500">
          Login
        </CardTitle>
        <CardDescription className="text-start">
          Please login to explore our features.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={onSubmit}
          className="flex flex-col items-center space-y-4"
        >
          <FormInput
            name="email"
            control={control}
            label="Email"
            type="email"
            placeholder="Enter Email"
          />
          <FormInput
            name="password"
            control={control}
            label="Password"
            type="password"
            placeholder="Enter Password"
          />
          <Button
            type="submit"
            className="mt-3 w-full bg-emerald-500 hover:bg-emerald-600"
          >
            {isPendingLogin ? <Loader2 className="animate-spin" /> : "Sign In"}
          </Button>
          <div>
            <p className="text-muted-foreground text-sm">
              {"Don't have an account?"}{" "}
              <Link
                href="/register"
                className="text-emerald-500 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
