"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Pen, Plus, Trash } from "lucide-react";
import Title from "@/components/Title";
import EmployeeFormDialog from "../../_components/EmployeeDailog";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/DataTable"; // Import the reusable DataTable component
import { ColumnDef } from "@tanstack/react-table"; // Import for defining columns

type User = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  status: string;
  company?: { _id: string; name: string }; // Add company details
};

const Users = () => {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`/api/admin/users`);
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if (session?.user?.role === "admin") fetchUsers();
  }, [session]);

  // Define columns for the DataTable
  const userColumns: ColumnDef<User>[] = [
    {
      accessorKey: "company",
      header: "Company",
      cell: ({ row }) => {
        //@ts-ignore
        const companyName = row.getValue("company")?.name || "N/A";
        return companyName;
      },
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => row.getValue("name"),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => row.getValue("email"),
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => row.getValue("phone"),
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => row.getValue("address"),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => row.getValue("role"),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("status")}</div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="space-x-1">
          <EmployeeFormDialog
            onSubmitSuccess={fetchUsers}
            isEdit={true}
            defaultValues={row.original}
            triggerButton={
              <Button variant="outline" className="border-color text-color hover:bg-white">
                <Pen /> 
              </Button>
            }
          />
          <Button variant={"destructive"} className="bg-color text-white">
            <Trash />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Title title="Users" subtitle="Manage your users" />
        <Button
          onClick={() => router.push("/admin/users/new")}
          variant={"outline"}
          className="border-color text-color"
        >
          <Plus /> Add User
        </Button>
      </div>

      {/* Users Table */}
      <DataTable<User>
        data={users}
        filter="email"
        columns={userColumns}
        onRowSelectionChange={(selectedRows) => {
          console.log("Selected Rows:", selectedRows); // Handle row selection if necessary
        }}
      />
    </div>
  );
};

export default Users;
