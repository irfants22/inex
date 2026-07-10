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
import Link from "next/link";
import { toast } from "sonner";

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
      toast.success("Registration successful!", {
        description: "Please check your email to verify your account",
        descriptionClassName: "!text-black",
      });
    }
    if (registerState?.status === "error") {
      toast.error("Registration Failed", {
        description: registerState.errors?._form?.[0],
        descriptionClassName: "!text-black",
      });
    }
  }, [registerState, router]);

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="mb-2 text-start text-4xl font-semibold text-emerald-500">
          Register
        </CardTitle>
        <CardDescription className="text-start">
          Create a new account to start using our platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={onSubmit}
          className="flex flex-col items-center space-y-4"
        >
          <FormInput
            name="fullName"
            control={control}
            label="Full Name"
            type="text"
            placeholder="Enter Full Name"
          />
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
          <FormInput
            name="confirmPassword"
            control={control}
            label="Confirm Password"
            type="password"
            placeholder="Enter Confirm Password"
          />
          <Button
            type="submit"
            className="mt-3 w-full bg-emerald-500 hover:bg-emerald-600"
            disabled={isPendingRegister}
          >
            {isPendingRegister ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Sign Up"
            )}
          </Button>
          <div>
            <p className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-emerald-500 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
