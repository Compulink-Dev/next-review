"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { Building, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Title from "@/components/Title";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// Company and Employee Types
type Company = {
  _id: string;
  name: string;
  email: string;
  service?: string | string[]; // Accept both string and array
  phone?: string;
  address?: string;
  description?: string;
  website?: string;
  category?: string | string[]; // Accept both string and array
  imageUrl?: string;
};

function Company() {
  const { data: session } = useSession();
  const [companies, setCompanies] = useState<Company[]>([]);
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get("/api/company");
        // Adjusting for API response structure
        setCompanies(res.data.companies || res.data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchCompanies();
  }, []);

  const onSubmit = async (data: any) => {
    try {
      const res = await axios.post("/api/auth/register/company", data);
      if (res.status === 201) {
        setCompanies((prev) => [...prev, res.data.company]);
        reset();
      }
    } catch (error) {
      console.error("Failed to add company:", error);
    }
  };

  console.log("companies", companies);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title
          title="Companies"
          subtitle="View all companies on this platform"
        />
        {session?.user.role === "admin" && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2" />
                Add Company
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Company</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  {...register("name", { required: true })}
                  placeholder="Company Name"
                />
                <Input
                  {...register("email", { required: true })}
                  placeholder="Email"
                  type="email"
                />
                <Input
                  {...register("password", { required: true })}
                  placeholder="Password"
                  type="password"
                />
                <Input {...register("website")} placeholder="Website" />
                <Input {...register("phone")} placeholder="Phone" />
                <Input {...register("imageUrl")} placeholder="Image URL" />
                <Input {...register("service")} placeholder="Service" />
                <Input {...register("address")} placeholder="Address" />
                <Input {...register("category")} placeholder="Category" />
                <Input {...register("description")} placeholder="Description" />
                <Button type="submit">Add Company</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {companies.map((company) => (
          <div
            key={company._id}
            onClick={() => router.push(`/dashboard/company/${company._id}`)}
            className="p-4 border rounded cursor-pointer bg-slate-50 hover:bg-color hover:text-white transition"
          >
            <div className="flex gap-4 items-center">
              <Building size={40} />
              <Separator orientation="vertical" />
              <div>
                <p className="font-bold">{company.name}</p>
                <p className="text-xs mt-2">{company.phone}</p>
                <p className="text-xs">{company.email}</p>
                <p className="text-xs">{company.website}</p>
                <p className="text-xs">{company.address}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Company;
