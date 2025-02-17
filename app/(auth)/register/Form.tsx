"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import toast from "react-hot-toast";
import Title from "@/components/Title";

type RegisterInputs = {
  name: string;
  email: string;
  password: string;
  role: "admin" | "client" | "employee";
  company: string;
  phone?: string;
  address?: string;
  imageUrl?: string;
};

const options = [
  { label: "Client", value: "client" },
  { label: "Employee", value: "employee" },
];

const Register = () => {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/dashboard";
  const router = useRouter();
  const [error, setError] = useState("");
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>(
    []
  );

  const form = useForm<RegisterInputs>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "client",
      company: "",
      phone: "",
      address: "",
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (params.get("success") === "true") {
      router.push("/signin");
    }
  }, [params, router]);

  // Fetch available companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("/api/company");
        setCompanies(response.data);
      } catch (error) {
        toast.error("Failed to fetch companies");
      }
    };
    fetchCompanies();
  }, []);

  const formSubmit: SubmitHandler<RegisterInputs> = async (formData) => {
    try {
      const payload: any = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        company: formData.company,
      };

      if (formData.role === "admin" && !formData.company) {
        toast.error("Company name is required for admin registration");
        return;
      } else if (formData.role === "employee" && !formData.company) {
        toast.error("Company ID is required for employee registration");
        setError("Company ID is required for employee registration");
        return;
      }

      if (formData.role !== "admin") {
        payload.phone = formData.phone;
        payload.address = formData.address;
        payload.imageUrl = formData.imageUrl;
      }

      await axios.post("/api/auth/register", payload);
      toast.success("User registered successfully");
      router.push("/signin?registered=true");
    } catch (error) {
      toast.error(`Error registering user: ${error}`);
    }
  };

  return (
    <div className="flex h-full mb-8">
      {/* Left Side - Image (Fixed Position) */}
      <div className="hidden md:flex fixed left-0 top-0 w-1/3 h-full bg-red-100 items-center justify-center">
        <Image
          src="/icons/register.svg"
          width={400}
          height={400}
          objectFit="contain"
          alt="Register illustration"
          className="rounded-lg"
        />
      </div>

      {/* Right Side - Form (Scrollable) */}
      <div className="w-full md:w-2/3 ml-auto h-screen flex p-8">
        <div className="w-full">
          <Title
            title="Register"
            subtitle="Create an account and get started"
          />

          {error && <div className="alert text-red-500 mb-4">{error}</div>}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(formSubmit)}
              className="space-y-4 mt-4"
            >
              <CustomFormField
                control={form.control}
                name="role"
                label="Select Role"
                fieldType={FormFieldType.SELECT}
                iconSrc="/icons/role.svg"
              >
                {options.map((data, i) => (
                  <SelectItem key={data.label + i} value={data.value}>
                    <div className="flex cursor-pointer items-center gap-2">
                      <p>{data.label}</p>
                    </div>
                  </SelectItem>
                ))}
              </CustomFormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomFormField
                  control={form.control}
                  name="name"
                  label="Full Name"
                  placeholder="Enter your full name"
                  fieldType={FormFieldType.INPUT}
                  iconSrc="/icons/users.svg"
                />

                <CustomFormField
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="Enter your email"
                  fieldType={FormFieldType.INPUT}
                  iconSrc="/icons/mail.svg"
                />
              </div>

              {form.watch("role") !== "client" && (
                <CustomFormField
                  control={form.control}
                  name="company"
                  label={
                    form.watch("role") === "admin"
                      ? "Company Name"
                      : "Select Company"
                  }
                  fieldType={FormFieldType.SELECT}
                  iconSrc="/icons/company.svg"
                >
                  {companies.map((company) => (
                    //@ts-ignore
                    <SelectItem key={company?._id} value={company?._id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </CustomFormField>
              )}

              {(form.watch("role") === "client" ||
                form.watch("role") === "employee") && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomFormField
                      control={form.control}
                      name="phone"
                      label="Phone Number"
                      placeholder="Enter your phone number"
                      fieldType={FormFieldType.INPUT}
                      iconSrc="/icons/phone.svg"
                    />

                    <CustomFormField
                      control={form.control}
                      name="address"
                      label="Address"
                      placeholder="Enter your address"
                      fieldType={FormFieldType.INPUT}
                      iconSrc="/icons/address.svg"
                    />
                  </div>

                  <CustomFormField
                    control={form.control}
                    name="imageUrl"
                    label="Profile Image URL"
                    placeholder="Enter profile image URL"
                    fieldType={FormFieldType.INPUT}
                    iconSrc="/icons/photo.svg"
                  />
                </>
              )}

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
                className="w-full bg-color hover:bg-red-700 text-white"
              >
                {form.formState.isSubmitting && (
                  <span className="loading loading-spinner"></span>
                )}
                Register
              </Button>
            </form>
          </Form>

          <div className="mt-4">
            <span>Already have an account? </span>
            <Link
              className="text-red-700 hover:underline text-sm font-bold mb-8"
              href={`/signin?callbackUrl=${callbackUrl}`}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
