"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Title from "@/components/Title";
import BackButton from "@/components/BackButton";

type Company = {
  _id: string;
  name: string;
  email: string;
  service?: string;
  phone?: string;
  address?: string;
  description?: string;
};

function CompanyDetails() {
  const { id } = useParams() as { id: string }; // Get the ID from the URL
  const [company, setCompany] = useState<Company | null>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await axios.get(`/api/company/${id}`);
        console.log("Data : ", response);

        // Access the correct structure
        setCompany(response.data.company);
        setEmployees(response.data.employees);
      } catch (error) {
        console.error("Failed to fetch company details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCompany();
    }
  }, [id]);

  if (loading) {
    return <p>Loading company details...</p>;
  }

  if (!company) {
    return <p>No company found.</p>;
  }

  console.log("Company Id :", company);

  return (
    <div>
      <div className="flex items-center justify-between">
        <Title title={company.name} />
        <BackButton />
      </div>
      <div className="mt-6 space-y-4">
        <p>
          <strong>Email:</strong> {company.email}
        </p>
        <p>
          <strong>Service:</strong> {company.service}
        </p>
        <p>
          <strong>Phone:</strong> {company.phone}
        </p>
        <p>
          <strong>Address:</strong> {company.address}
        </p>
        <p>
          <strong>Description:</strong> {company.description}
        </p>
      </div>
    </div>
  );
}

export default CompanyDetails;
