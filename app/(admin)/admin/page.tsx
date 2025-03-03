"use client";

import { FC, useEffect, useState } from "react";
import DetailsCard from "../_components/DetailsCard";
import ReviewChart from "../_components/ReviewChart";
import UserChart from "../_components/UserChart"; // Ensure this component exists
import { FileStack, Hospital, User } from "lucide-react";
import Title from "@/components/Title";

const Dashboard: FC = () => {
  const [data, setData] = useState<{
    reviews: number;
    companies: number;
    users: number;
    reviewChartData: { date: string; count: number }[];
    userChartData: { date: string; count: number }[];
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dashboard");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    };

    fetchData();
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className=" py-6 sm:px-6 lg:px-8">
      <Title title="Dashboard" />
      <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-3">
        <DetailsCard
          title="Reviews"
          value={data.reviews}
          icon={<FileStack size={60} />}
        />
        <DetailsCard
          title="Companies"
          value={data.companies}
          icon={<Hospital size={60} />}
        />
        <DetailsCard
          title="Users"
          value={data.users}
          icon={<User size={60} />}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2">
        <ReviewChart data={data.reviewChartData} />
        <UserChart data={data.userChartData} />
      </div>
    </div>
  );
};

export default Dashboard;
