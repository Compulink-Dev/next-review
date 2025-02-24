"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { Button } from "@/components/ui/button";
import CustomFormField, { FormFieldType } from "@/components/CustomFormField";
import { Form } from "@/components/ui/form";
import { SelectItem } from "@/components/ui/select";
import toast from "react-hot-toast";
import Title from "@/components/Title";
import BackButton from "@/components/BackButton";

type UserInputs = {
  name: string;
  email: string;
  role: "admin" | "client" | "employee";
  company: string;
  phone?: string;
  address?: string;
  imageUrl?: string;
  status?: string;
};

const options = [
  { label: "Client", value: "client" },
  { label: "Employee", value: "employee" },
];

const NewUser = () => {
  const router = useRouter();
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>(
    []
  );
  const [error, setError] = useState("");

  const form = useForm<UserInputs>({
    defaultValues: {
      name: "",
      email: "",
      role: "client",
      company: "",
      phone: "",
      address: "",
      imageUrl: "",
      status: "inactive",
    },
  });

  useEffect(() => {
    // Fetch available companies
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("/api/company");
        setCompanies(response.data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch companies");
      }
    };
    fetchCompanies();
  }, []);

  const formSubmit: SubmitHandler<UserInputs> = async (formData) => {
    try {
      const payload: any = {
        name: formData.name,
        email: formData.email,
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
      toast.success("User created successfully");
      router.push("/users"); // Redirect to users list
    } catch (error) {
      toast.error(`Error creating user: ${error}`);
    }
  };

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <Title
          title="Create New User"
          subtitle="Add a new user to the system"
        />
        <BackButton />
      </div>
      <div className="flex h-full gap-4 mt-4">
        {/* Left Side - Form (Scrollable) */}
        <div className="w-full md:w-2/3 flex">
          <div className="w-full">
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
                  {options.map((data) => (
                    <React.Fragment key={data.value}>
                      {" "}
                      {/* Key is applied here */}
                      <SelectItem value={data.value}>
                        <div className="flex cursor-pointer items-center gap-2">
                          <p>{data.label}</p>
                        </div>
                      </SelectItem>
                    </React.Fragment>
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
                    {companies.map((company, index) => (
                      <SelectItem key={index} value={company.id}>
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

                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full bg-color hover:bg-red-700 text-white"
                >
                  {form.formState.isSubmitting && (
                    <span className="loading loading-spinner"></span>
                  )}
                  Create User
                </Button>
              </form>
            </Form>
          </div>
        </div>
        {/* Left Side - Image (Fixed Position) */}
        <div className="w-1/2 ml-auto h-screen hidden md:flex">
          <p className="text-color ">Recent Users</p>
          <div className="mt-4 border w-full h-[100px] rounded border-color"></div>
        </div>
      </div>
    </div>
  );
};

export default NewUser;
