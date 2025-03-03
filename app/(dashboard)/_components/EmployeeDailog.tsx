import React from "react";
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
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useSession } from "next-auth/react";
import ViewButton from "./ViewButton";

interface EmployeeFormDialogProps {
  onSubmitSuccess: () => void;
  isEdit?: boolean;
  defaultValues?: any;
  triggerButton?: React.ReactNode;
}

const EmployeeFormDialog: React.FC<EmployeeFormDialogProps> = ({
  onSubmitSuccess,
  isEdit = false,
  defaultValues,
  triggerButton,
}) => {
  const { data: session } = useSession();
  const { register, handleSubmit, reset } = useForm({ defaultValues });

  const onSubmit = async (data: any) => {
    try {
      const url = isEdit
        ? `/api/employees/${defaultValues._id}` // Use PUT when updating
        : "/api/employees";

      const method = isEdit ? "PUT" : "POST"; // Use PUT for updates

      await axios({
        method,
        url,
        data: {
          ...data,
          companyId: session?.user?.company,
          role: "employee",
        },
      });

      toast.success(`Employee ${isEdit ? "updated" : "added"} successfully`);
      onSubmitSuccess();
      reset();
    } catch (error) {
      console.log(error);
      toast.error(`Failed to ${isEdit ? "update" : "add"} employee`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Employee" : "Add Employee"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" {...register("name")} required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} required />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register("phone")} required />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register("address")} required />
          </div>
          {!isEdit && (
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                required
              />
            </div>
          )}
          {isEdit && (
            <div className="">
              <div>
                <Label htmlFor="address">Status</Label>
                <Input id="status" {...register("status")} required />
              </div>
            </div>
          )}
          <Button
            type="submit"
            className="w-full bg-color border text-white hover:hover-color"
          >
            {isEdit ? "Update Employee" : "Add Employee"}
          </Button>
        </form>
        {isEdit && <ViewButton id={defaultValues._id} />}
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeFormDialog;
