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
import { Building, LocateFixed, Mail, Phone, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Title from "@/components/Title";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

type Company = {
  _id: string;
  name: string;
  email: string;
  website?: string;
  phone?: string;
  imageUrl?: string;
  service?: string[];
  address?: string;
  category?: string[];
  description?: string;
};

function Company() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get("/api/company");
        setCompanies(res.data);
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
        setOpen(false);
        reset();
        setCompanies((prev: Company[]) => [...prev, res.data.company]);
      }
    } catch (error) {
      console.error("Failed to add company:", error);
    }
  };

  console.log("Companies : ", companies);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title
          title="Companies"
          subtitle="View all the companies on this platform"
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="text-color border border-color">
              <Plus />
              <p className="ml-2">Add Company</p>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Add Company</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex gap-2 items-center">
                <div className="w-full">
                  <Label htmlFor="name">Company Name</Label>
                  <Input id="name" {...register("name", { required: true })} />
                </div>
                <div className="w-full">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email", { required: true })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password", { required: true })}
                />
              </div>
              <div className="flex gap-2 items-center">
                <div className="w-full">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" {...register("website")} />
                </div>
                <div className="w-full">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" {...register("phone")} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-full">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input id="imageUrl" {...register("imageUrl")} />
                </div>
                <div className="w-full">
                  <Label htmlFor="service">Service</Label>
                  <Input id="service" {...register("service")} />
                </div>
              </div>
              <div className="flex gap-2 items-center w-full">
                <div className="w-full">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" {...register("address")} />
                </div>
                <div className="w-full">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" {...register("category")} />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input id="description" {...register("description")} />
              </div>

              <Button type="submit" className="w-full bg-color text-white">
                Add Company
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Title title="All Companies" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {companies.map((company) => (
          <div
            key={company._id}
            onClick={() => router.push(`/admin/company/${company._id}`)}
            className="p-8 border cursor-pointer rounded flex bg-slate-50 shadow-lg hover:bg-color hover:text-white items-center gap-4 text-color delay-100"
          >
            <div className="">
              <Building size={40} />
            </div>
            <Separator orientation="vertical" className="bg-red-700" />
            <div className="">
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
    </div>
  );
}

export default Company;
