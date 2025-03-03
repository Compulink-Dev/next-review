"use client";

import Title from "@/components/Title";
import React, { useEffect, useState } from "react";
import SettingsTop from "../../_components/SettingsTop";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Review {
  _id: string;
  content: string;
  createdAt: string;
}

function Profile() {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/reviews")
        .then((res) => res.json())
        .then((data) => {
          setReviews(data.reviews);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [session]);

  return (
    <div className="flex flex-col gap-4">
      <SettingsTop />
      <Title title="Profile" subtitle="Manage your profile on this platform" />

      <div className="flex gap-6">
        {/* Left Side - User Reviews */}
        <div className="w-2/3 p-4 bg-white rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-4">Your Reviews</h3>
          {loading ? (
            <Skeleton className="h-32 w-full" />
          ) : reviews?.length > 0 ? (
            <ul className="space-y-3">
              {reviews.map((review) => (
                <li
                  key={review._id}
                  className="border p-4 rounded-lg shadow-sm"
                >
                  <p className="text-gray-800">{review.content}</p>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No reviews found.</p>
          )}
        </div>

        {/* Right Side - Action Cards */}
        <div className="w-1/3 space-y-4">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Delete Review</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" className="w-full">
                Delete a Review
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Post Review</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="default" className="w-full">
                Write a Review
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Approve Review</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full">
                Approve Review
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Profile;
