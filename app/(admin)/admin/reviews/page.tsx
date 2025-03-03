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
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/DataTable";

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

  // Show only the latest 3 reviews
  const latestReviews = reviews.slice(0, 3);
  // The rest will be displayed in the DataTable
  const remainingReviews = reviews.slice(3);

  // Table columns
  const columns: ColumnDef<Review>[] = [
    {
      accessorKey: "employeeId.name",
      header: "Employee",
      cell: ({ row }) => <p>{row.original.employeeId.name}</p>,
    },
    {
      accessorKey: "department",
      header: "Department",
    },
    {
      accessorKey: "clientId.name",
      header: "Client",
      cell: ({ row }) => <p>{row.original.clientId.name}</p>,
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <p>{new Date(row.original.date).toLocaleDateString()}</p>
      ),
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => (
        <div className="flex gap-1">
          {[...Array(row.original.rating)].map((_, i) => (
            <Star key={i} size={14} className="text-yellow-500" />
          ))}
          {[...Array(5 - row.original.rating)].map((_, i) => (
            <Star key={`empty-${i}`} size={14} className="text-gray-300" />
          ))}
        </div>
      ),
    },
    {
      accessorKey: "valid",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={row.original.valid ? "text-green-600" : "text-red-600"}
        >
          {row.original.valid ? "Validated" : "Pending"}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title
          title="Reviews"
          subtitle="Manage and view reviews on this platform"
        />
        {session?.user.role !== "employee" && (
          <Button
            onClick={() => router.push("/admin/company")}
            variant={"outline"}
            className="border-color hover:bg-hover text-color"
          >
            <Plus />
            <p className="">Add review</p>
          </Button>
        )}
      </div>

      {/* Show Latest 3 Reviews */}
      {latestReviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {latestReviews.map((review, index) => (
            <div
              key={index}
              onClick={() => router.push(`/admin/reviews/${review._id}`)}
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

      {/* DataTable for Remaining Reviews */}
      {remainingReviews.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">All Reviews</h3>
          <DataTable
            filter="department"
            data={remainingReviews}
            columns={columns}
          />
        </div>
      )}
    </div>
  );
}

export default Reviews;
