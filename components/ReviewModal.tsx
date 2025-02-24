import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

type ReviewModalProps = {
  employeeId: string;
};

function ReviewModal({ employeeId }: ReviewModalProps) {
  const { data: session } = useSession();
  const { register, handleSubmit, reset } = useForm();
  const [open, setOpen] = useState(false);

  const onSubmit = async (data: any) => {
    if (!session?.user || session.user.role !== "client") {
      console.error("Only clients can submit reviews.");
      return;
    }

    try {
      const res = await axios.post("/api/reviews", {
        ...data,
        clientId: session.user.id, // Get client ID from session
        employeeId, // Get employee ID from props
      });

      if (res.status === 201) {
        setOpen(false);
        reset();
      }
    } catch (error) {
      console.error("Failed to add review:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-color border border-color hover:bg-hover">
          <p className="ml-2">Review</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Add Review</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="w-full">
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              {...register("department", { required: true })}
            />
          </div>
          <div className="w-full">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              {...register("date", { required: true })}
            />
          </div>
          <div className="w-full">
            <Label htmlFor="rating">Rating (1-5)</Label>
            <Input
              id="rating"
              type="number"
              min="1"
              max="5"
              {...register("rating", { required: true })}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              {...register("description", { required: true })}
            />
          </div>
          <Button type="submit" className="w-full bg-color text-white">
            Add Review
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ReviewModal;
