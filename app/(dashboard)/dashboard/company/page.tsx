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
import { LocateFixed, Mail, Phone, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Title from "@/components/Title";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";

// Company Type
type Company = {
  _id: string;
  name: string;
  email: string;
  service?: string | string[];
  phone?: string;
  address?: string;
  description?: string;
  website?: string;
  category?: string | string[];
  imageUrl?: string;
};

// DataTable Columns
const columns: ColumnDef<Company>[] = [
  { accessorKey: "name", header: "Company Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "address", header: "Address" },
];

function Company() {
  const { data: session } = useSession();
  const [companies, setCompanies] = useState<Company[]>([]);
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get("/api/company");
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
                <Plus className="mr-2" /> Add Company
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

      {/* Display First 3 Companies as Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {companies.slice(0, 3).map((company) => (
          <div
            key={company._id}
            onClick={() => router.push(`/dashboard/company/${company._id}`)}
            className="p-8 border cursor-pointer rounded flex bg-slate-50 shadow-lg hover:bg-color hover:text-white items-center gap-4 text-color delay-100"
          >
            {company.imageUrl && (
              <Image
                src={company.imageUrl}
                alt="Company Image"
                width={100}
                height={100}
                className="rounded-lg shadow-md"
              />
            )}
            <Separator orientation="vertical" className="bg-red-700" />
            <div>
              <p className="font-bold">{company.name}</p>
              <p className="text-xs">{company.service}</p>
              <div className="mt-4 space-y-2">
                <div className="flex gap-2 items-center">
                  <Phone size={12} />
                  <p className="text-xs">{company.phone}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <Mail size={12} />
                  <p className="text-xs">{company.email}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <LocateFixed size={12} />
                  <p className="text-xs">{company.address}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Display Remaining Companies in DataTable */}
      {companies.length > 1 && (
        <DataTable filter="name" columns={columns} data={companies.slice(3)} />
      )}
    </div>
  );
}

export default Company;
