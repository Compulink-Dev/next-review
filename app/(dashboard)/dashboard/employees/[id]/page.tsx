"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Title from "@/components/Title";
import BackButton from "@/components/BackButton";

interface Employee {
  _id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  status: string;
  imageUrl: string;
  role: "client" | "companyAdmin" | "employee";
}

interface Review {
  _id: string;
  clientName: string;
  department: string;
  date: string;
  rating: number;
  description: string;
}

const fetchEmployee = async (id: string): Promise<Employee | null> => {
  try {
    const res = await fetch(`/api/worker/${id}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
};

const fetchReviews = async (id: string): Promise<Review[]> => {
  try {
    const res = await fetch(`/api/reviews/employees/${id}`);

    console.log("Response from fetchReviews: ", res);

    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
};

const EmployeeDetails = () => {
  const params = useParams();
  const id = params?.id as string;

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (id) {
      fetchEmployee(id).then(setEmployee);
      fetchReviews(id).then(setReviews);
    }
  }, [id]);

  if (!employee) return <p>Loading...</p>;

  console.log("Review :", reviews);

  console.log("Employee :", employee);

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between">
        <Title title="Employee Details" />
        <BackButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Left Side - Employee Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <img
            src={employee.imageUrl || "/default-avatar.png"}
            alt={employee.name}
            className="w-40 h-40 object-cover rounded-full mx-auto"
          />
          <h1 className="text-xl font-semibold text-center mt-4">
            {employee.name}
          </h1>
          <p className="text-gray-600 text-center">{employee.role}</p>
          <div className="mt-4 space-y-2">
            <p>
              <strong>Address:</strong> {employee.address}
            </p>
            <p>
              <strong>Email:</strong> {employee.email}
            </p>
            <p>
              <strong>Phone:</strong> {employee.phone}
            </p>
            <p>
              <strong>Status:</strong> {employee.status}
            </p>
          </div>
        </div>

        {/* Right Side - Employee Reviews */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Reviews</h2>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="border-b pb-4 mb-4">
                <p className="font-semibold">{review.clientName}</p>
                <p className="text-yellow-500">⭐ {review.rating}/5</p>
                <p className="text-gray-600">{review.description}</p>
                <p className="text-sm text-gray-400">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
