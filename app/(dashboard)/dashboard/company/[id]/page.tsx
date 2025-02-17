"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Title from "@/components/Title";
import BackButton from "@/components/BackButton";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type Company = {
  _id: string;
  name: string;
  email: string;
  service?: string;
  phone?: string;
  address?: string;
  description?: string;
  imageUrl?: string;
};

type Employee = {
  _id: string;
  name: string;
  email: string;
  position?: string;
};

function CompanyDetails() {
  const { id } = useParams() as { id: string };
  const [company, setCompany] = useState<Company | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await axios.get(`/api/company/${id}`);
        setCompany(response.data.company);
        setEmployees(response.data.employees || []);
      } catch (error) {
        console.error("Failed to fetch company details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCompany();
  }, [id]);

  if (loading) return <p>Loading company details...</p>;
  if (!company) return <p>No company found.</p>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <Title title={company.name} />
        <BackButton />
      </div>
      <div className="flex gap-8 mt-6">
        {company.imageUrl && (
          <Image
            src={company.imageUrl}
            alt="Company Image"
            width={200}
            height={200}
            className="rounded-lg shadow-md"
          />
        )}
        <div className="space-y-2">
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
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Employees</h2>
        {employees.length > 0 ? (
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {employees.map((emp) => (
              <li
                key={emp._id}
                className="p-4 border rounded-lg bg-gray-50 flex justify-between items-center"
              >
                <div>
                  <p>
                    <strong>Name:</strong> {emp.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {emp.email}
                  </p>
                  {emp.position && (
                    <p>
                      <strong>Position:</strong> {emp.position}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">View</Button>
                  <Button className="border border-color text-color hover:hover-color">
                    Review
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No employees registered under this company.</p>
        )}
      </div>
    </div>
  );
}

export default CompanyDetails;
