"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Plus, Star, User, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import Title from "@/components/Title";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import Loading from "@/components/Loading";

type Review = {
  _id: string;
  employeeId: {
    name: string;
  };
  department: string;
  clientId: {
    name: string;
  };
  date: string;
  rating: number;
  description: string;
  valid?: boolean;
};

function Reviews() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get("/api/reviews");
        console.log("Reviews :", res.data);
        setReviews(res.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title
          title="Reviews"
          subtitle="Manage and view reviews on this platform"
        />

        {session?.user.role !== "employee" && (
          <Button
            onClick={() => router.push("/dashboard/company")}
            variant={"outline"}
            className="border-color hover:bg-hover text-color"
          >
            <Plus />
            <p className="">Add review</p>
          </Button>
        )}
      </div>

      {/* Show message if there are no reviews */}
      {reviews.length === 0 ? (
        <p className="text-center text-gray-500 mt-6">No reviews available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              onClick={() => router.push(`/dashboard/reviews/${review._id}`)}
              className="p-6 border cursor-pointer rounded flex bg-slate-50 shadow-lg hover:bg-color hover:text-white items-center gap-4 text-color delay-100"
            >
              <User size={40} />
              <Separator orientation="vertical" className="bg-red-700" />
              <div>
                <p className="font-bold">{review.employeeId.name}</p>
                <p className="text-xs">Department: {review.department}</p>
                <p className="text-xs">Client: {review.clientId.name}</p>
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
                  </div>
                  <div className="text-sm">
                    {review.valid ? (
                      <div className="text-green-700">Validated</div>
                    ) : (
                      <div>Pending Validation</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Reviews;
