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
import { Plus, Star, User, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import Title from "@/components/Title";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// Review Type
type Review = {
  _id: string;
  employeeName: string;
  department: string;
  clientName: string;
  date: string;
  rating: number;
  description: string;
};

function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm();

  // Fetch Reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get("/api/reviews");
        setReviews(res.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  // Submit New Review
  const onSubmit = async (data: any) => {
    try {
      const res = await axios.post("/api/reviews", data);
      if (res.status === 201) {
        setOpen(false);
        reset();
        setReviews((prev) => [...prev, res.data]);
      }
    } catch (error) {
      console.error("Failed to add review:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title
          title="Reviews"
          subtitle="Manage and view reviews on this platform"
        />
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="text-color border border-color">
              <Plus />
              <p className="ml-2">Add Review</p>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Add Review</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex gap-2 items-center">
                <div className="w-full">
                  <Label htmlFor="employeeName">Employee Name</Label>
                  <Input
                    id="employeeName"
                    {...register("employeeName", { required: true })}
                  />
                </div>
                <div className="w-full">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    {...register("department", { required: true })}
                  />
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <div className="w-full">
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    {...register("clientName", { required: true })}
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
              </div>
              <div className="flex gap-2 items-center">
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
      </div>

      {/* Display Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {reviews.map((review, index) => (
          <div
            key={index}
            onClick={() => router.push(`/dashboard/reviews/${review._id}`)}
            className="p-6 border cursor-pointer rounded flex bg-slate-50 shadow-lg hover:bg-color hover:text-white items-center gap-4 text-color delay-100"
          >
            <div className="">
              <User size={40} />
            </div>
            <Separator orientation="vertical" className="bg-red-700" />
            <div className="">
              <p className="font-bold">{review.employeeName}</p>
              <p className="text-xs">Department: {review.department}</p>
              <p className="text-xs">Client: {review.clientName}</p>
              <div className="mt-2 space-y-2">
                <div className="flex gap-2 items-center">
                  <Calendar size={12} />
                  <p className="text-xs">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={12} className="text-yellow-500" />
                  ))}
                  {[...Array(5 - review.rating)].map((_, i) => (
                    <Star
                      key={`empty-${i}`}
                      size={12}
                      className="text-gray-300"
                    />
                  ))}
                  {/* <p className="text-xs">Rating: {review.rating}</p> */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reviews;
