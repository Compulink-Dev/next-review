"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Title from "@/components/Title";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Loading from "@/components/Loading";

type ReviewType = {
  _id: string;
  clientName: string;
  employeeId: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  employeeName: string;
  date: string;
  department?: string;
  rating?: number;
  description?: string;
  valid?: boolean;
};

function Review() {
  const { id } = useParams() as { id: string };
  const { data: session } = useSession();
  const [review, setReview] = useState<ReviewType | null>(null);
  const [previousReviews, setPreviousReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await axios.get(`/api/reviews/${id}`);
        setReview(response.data);
        console.log("Fetched Review: ", response.data);

        const prevRes = await axios.get(`/api/reviews`);
        setPreviousReviews(prevRes.data);
        console.log("Fetched Previous Reviews: ", prevRes.data);
      } catch (error) {
        console.error("Failed to fetch review details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchReview();
  }, [id]);

  const validateReview = async () => {
    try {
      await axios.put(`/api/reviews/${id}`, { valid: true });
      setReview((prev) => prev && { ...prev, valid: true });
    } catch (error) {
      console.error("Failed to validate review:", error);
    }
  };

  if (loading) return <Loading />;
  if (!review) return <p>No review found.</p>;

  // Filter previous reviews for this employee
  const employeeReviews = previousReviews.filter(
    (prev) => prev.employeeId?._id === review?.employeeId?._id
  );

  // Calculate average rating
  const averageRating =
    employeeReviews.length > 0
      ? (
          employeeReviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
          employeeReviews.length
        ).toFixed(1)
      : "N/A";

  console.log("Employee Review : ", employeeReviews);

  return (
    <div>
      <div className="flex items-center justify-between">
        <Title title={`Review for ${review.employeeName}`} />
        <BackButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Left Side: Review Details */}
        <div>
          <div className="p-6 shadow rounded-lg bg-white">
            <div className="">
              <p className="font-semibold">Client: {review.clientName}</p>
              <p className="text-gray-500">
                Date : {new Date(review.date).toLocaleDateString()}
              </p>
              <p className="mt-2">Department: {review.department}</p>
              <p className="mt-2">Description : {review.description}</p>
              <p className="font-bold mt-2">Rating: {review.rating}/5</p>
              <p
                className={`mt-2 ${
                  review.valid ? "text-green-600" : "text-red-600"
                }`}
              >
                {review.valid ? "Validated" : "Pending Validation"}
              </p>
            </div>

            {/* Buttons for companyAdmin */}
            {session?.user.role === "companyAdmin" && (
              <div className="mt-4 flex gap-4">
                <Button
                  variant={"outline"}
                  className="border-color hover:hover-color"
                  onClick={() =>
                    router.push(`/dashboard/employees/${review.employeeId}`)
                  }
                >
                  View Employee
                </Button>
                {!review.valid && (
                  <Button
                    className="bg-color text-white hover:bg-red-700"
                    onClick={validateReview}
                    variant="outline"
                  >
                    Validate Review
                  </Button>
                )}
              </div>
            )}
          </div>
          <div className="p-6 shadow rounded-lg bg-white mt-6">
            <Title subtitle="Average ratings" />
            <div className="mt-4 text-xl font-semibold">
              {averageRating} / 5
            </div>
          </div>
        </div>

        {/* Right Side: Previous Reviews */}
        <div className="bg-white p-6 shadow rounded-lg h-full">
          <Title subtitle={` Previous Reviews for ${review.employeeName}`} />
          {previousReviews.length > 0 ? (
            <div className="space-y-4 mt-4">
              {previousReviews.map((prevReview) => (
                <div
                  key={prevReview._id}
                  className="p-4 border rounded-lg shadow-sm"
                >
                  <p className="font-semibold">{prevReview.clientName}</p>
                  <p className="text-sm">{prevReview.description}</p>
                  <p className="font-bold text-yellow-500">
                    Rating: {prevReview.rating}/5
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(prevReview.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No previous reviews found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Review;
