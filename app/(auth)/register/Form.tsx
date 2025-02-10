"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Form } from "@/components/ui/form"; // ✅ Import Form Provider
import { SelectItem } from "@/components/ui/select";
import toast from "react-hot-toast";

type RegisterInputs = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "client" | "employee";
  company: string;
};
const options = [
  { label: "Admin", value: "admin" },
  { label: "Client", value: "client" },
  { label: "Employee", value: "employee" },
];

const Register = () => {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/dashboard";
  const router = useRouter();
  const [error, setError] = useState("");

  const form = useForm<RegisterInputs>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "client",
      company: "",
    },
  });

  // Redirect after successful registration
  useEffect(() => {
    if (params.get("success") === "true") {
      router.push("/signin");
    }
  }, [params, router]);

  // Handle form submission
  const formSubmit: SubmitHandler<RegisterInputs> = async (formData) => {
    try {
      await axios.post("/api/auth/register", formData);
      toast.success("User registered successfully");
      router.push("/signin?registered=true"); // Redirect after registration
    } catch (error) {
      toast.error(`Error registering user ${error}`);
      setError("Error registering user");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="flex flex-row w-full max-w-3xl shadow-lg bg-white my-8">
        {/* Left Side - Image */}
        <div className="w-1/2 relative hidden md:block">
          <Image
            src="/icons/register.svg" // Change this to your actual image path
            layout="fill"
            objectFit="contain"
            alt="Register illustration"
            className="rounded-l-lg"
          />
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>

          {error && <div className="alert text-red-500 mb-4">{error}</div>}

          {/* ✅ Wrap with Form provider */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(formSubmit)}
              className="space-y-4"
            >
              <CustomFormField
                control={form.control}
                name="name"
                label="Full Name"
                placeholder="Enter your full name"
                fieldType={FormFieldType.INPUT}
                iconSrc="/icons/user.svg"
              />

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

              <CustomFormField
                control={form.control}
                name="company"
                label="Company Name"
                placeholder="Enter your company name"
                fieldType={FormFieldType.INPUT}
                iconSrc="/icons/company.svg"
              />

              <CustomFormField
                control={form.control}
                name="role"
                label="Select Role"
                fieldType={FormFieldType.SELECT}
                iconSrc="/icons/role.svg"
              >
                {options.map((data: any, i: any) => (
                  <SelectItem key={data.label + i} value={data.value}>
                    <div className="flex cursor-pointer items-center gap-2">
                      <p>{data.label}</p>
                    </div>
                  </SelectItem>
                ))}
              </CustomFormField>

              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full bg-color hover:bg-primary-dark text-white"
              >
                {form.formState.isSubmitting && (
                  <span className="loading loading-spinner"></span>
                )}
                Register
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center">
            <span>Already have an account? </span>
            <Link
              className="text-blue-600 hover:underline text-sm font-bold"
              href={`/signin?callbackUrl=${callbackUrl}`}
            >
              Sign In
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Register;
