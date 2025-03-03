"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Pen, Plus, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import Title from "@/components/Title";
import EmployeeFormDialog from "../../_components/EmployeeDailog";
import { DataTable } from "@/components/DataTable"; // Import the reusable DataTable component
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

type Employee = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
};

const Employees = () => {
  const { data: session } = useSession();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null); // State for confirming deletion

  // Fetching employees
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        `/api/employees?companyId=${session?.user?.company}`
      );
      setEmployees(res.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to fetch employees");
    }
  };

  // Delete employee handler
  const deleteEmployee = async (id: string) => {
    try {
      await axios.delete(`/api/employees/${id}`);
      toast.success("Employee deleted successfully");
      fetchEmployees(); // Refresh employee list
    } catch (error) {
      toast.error("Failed to delete employee");
      console.error("Error deleting employee:", error);
    }
  };

  // Load employees on session change
  useEffect(() => {
    if (session?.user?.company) fetchEmployees();
  }, [session]);

  // Columns for the employee table
  const employeeColumns: ColumnDef<Employee>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
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
        <div className="space-x-2 flex  items-center">
          <EmployeeFormDialog
            onSubmitSuccess={fetchEmployees}
            isEdit={true}
            defaultValues={row.original}
            triggerButton={
              <Button
                variant="outline"
                className="border-color text-color hover:bg-hover"
              >
                <Pen />
                <p className="hidden lg:flex">Edit</p>
              </Button>
            }
          />
          <Button
            variant="outline"
            className="bg-color text-white hover:hover-color"
            onClick={() => setDeletingId(row.original._id)} // Trigger confirmation for deletion
          >
            <Trash />
            <p className="hidden lg:flex">Delete</p>
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ];

  return (
    <div className="-z-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Title title="Employees" subtitle="Manage your employees" />
        <EmployeeFormDialog
          onSubmitSuccess={fetchEmployees}
          triggerButton={
            <Button variant="outline" className="border-color text-color">
              <Plus /> Add Employee
            </Button>
          }
        />
      </div>

      {/* Employees Table */}
      <DataTable<Employee>
        filter={"name"}
        data={employees}
        columns={employeeColumns}
        onRowSelectionChange={(selectedRows) => {
          console.log("Selected Rows:", selectedRows); // Handle row selection if necessary
        }}
      />

      {/* Confirmation Dialog for Deleting */}
      {deletingId && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg">
              Are you sure you want to delete this employee?
            </h3>
            <div className="flex space-x-4 mt-4">
              <Button
                variant="outline"
                onClick={() => setDeletingId(null)} // Cancel deletion
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                className="border-color text-color"
                onClick={() => {
                  if (deletingId) {
                    deleteEmployee(deletingId); // Proceed to delete
                    setDeletingId(null);
                  }
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
