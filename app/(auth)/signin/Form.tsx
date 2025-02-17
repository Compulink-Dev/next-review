"use client";

import { signIn, useSession } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Form } from "@/components/ui/form"; // ✅ Import Form Provider

type Inputs = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const { data: session } = useSession();
  const params = useSearchParams();
  const router = useRouter();

  const form = useForm<Inputs>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect based on user role if already logged in
  useEffect(() => {
    if (session?.user) {
      const redirectPath =
        session.user.role === "admin" ? "/admin" : "/dashboard";
      router.push(redirectPath);
    }
  }, [session, router]);

  // Handle form submission
  const formSubmit: SubmitHandler<Inputs> = async (formData) => {
    const { email, password } = formData;
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Prevent auto redirection by NextAuth
    });

    if (result?.error) {
      console.error("Login failed:", result.error);
    } else {
      // Fetch session after login to check user role
      const updatedSession = await fetch("/api/auth/session").then((res) =>
        res.json()
      );
      const redirectPath =
        updatedSession?.user?.role === "admin" ? "/admin" : "/dashboard";
      router.push(redirectPath);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-red-100">
      <Card className="flex flex-row w-full max-w-3xl shadow-lg bg-white">
        {/* Left Side - Image */}
        <div className="w-1/2 relative hidden md:block">
          <Image
            src="/icons/login.png"
            layout="fill"
            objectFit="contain"
            alt="Login illustration"
            className="rounded-l-lg"
          />
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-2xl font-bold mb-4 text-center">Sign In</h1>

          {params.get("error") && (
            <div className="alert text-red-500 mb-4">
              {params.get("error") === "CredentialsSignin"
                ? "Invalid email or password"
                : params.get("error")}
            </div>
          )}

          {/* ✅ Wrap with Form to provide context */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(formSubmit)}
              className="space-y-4"
            >
              <CustomFormField
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter your email"
                fieldType={FormFieldType.INPUT}
                iconSrc="/icons/email.svg"
              />

              <CustomFormField
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter your password"
                fieldType={FormFieldType.PASSWORD}
                iconSrc="/icons/locks.svg"
              />

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full bg-color hover:bg-primary-dark text-white"
              >
                {form.formState.isSubmitting && (
                  <span className="loading loading-spinner"></span>
                )}
                Sign In
              </Button>
            </form>
          </Form>

          <div className="mt-4">
            <span>Need an account? </span>
            <Link
              className="text-color hover:underline text-sm font-bold"
              href={`/register`}
            >
              Register
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginForm;
