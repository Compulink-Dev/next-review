"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

function ViewButton({ id }: { id: string }) {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.push(`/dashboard/employees/${id}`)}
      variant={"outline"}
      className="border-color text-color hover:bg-hover w-full"
    >
      View employee
    </Button>
  );
}

export default ViewButton;
