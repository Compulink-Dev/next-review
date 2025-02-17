"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { Pen, Plus, Trash } from "lucide-react";
import Title from "@/components/Title";
import Image from "next/image";

type Employee = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  imageUrl: string;
};

const Employees = () => {
  const { data: session } = useSession();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`/api/employees`);
      setEmployees(res.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
  console.log("Session", session?.user?.role);

  useEffect(() => {
    if (session?.user?.company) fetchEmployees();
  }, [session]);

  const onSubmit = async (data: any) => {
    try {
      await axios.post("/api/auth/register/employee", {
        ...data,
        companyId: session?.user?.company,
        role: "employee",
      });
      toast.success("Employee added successfully");
      fetchEmployees(); // Refresh employee list
      reset();
      setOpen(false);
    } catch (error) {
      toast.error("Failed to add employee");
    }
  };

  return (
    <div className="">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Title title="Employees" subtitle="Manage your employees" />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="text-color border border-color">
              <Plus />
              <p className="">Add Employee</p>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Add employees</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...register("name")} required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-color text-white">
                Add Employee
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Employees Table */}
      <Table>
        <TableHeader className="rounded-lg">
          <TableRow className=" bg-color text-white font-bold">
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.length > 0 ? (
            employees.map((employee) => (
              <TableRow key={employee._id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee?.phone}</TableCell>
                <TableCell>{employee?.address}</TableCell>
                <TableCell>
                  <Image
                    src={`${employee?.imageUrl}`}
                    alt={employee?.name}
                    width={50}
                    height={50}
                  />
                </TableCell>
                <TableCell className="space-x-4">
                  <Button
                    variant={"outline"}
                    className="border-color text-color"
                  >
                    <Pen />
                    <p className="">Edit</p>
                  </Button>
                  <Button
                    variant={"destructive"}
                    className="bg-color text-white"
                  >
                    <Trash />
                    <p className="">Delete</p>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} className="text-color">
                No employees found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Employees;
