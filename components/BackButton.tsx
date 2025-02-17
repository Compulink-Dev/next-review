"use client";
import React from "react";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

function BackButton() {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      variant={"outline"}
      className="border-color text-color hover:bg-color hover:text-white"
    >
      <ChevronLeft />
      <p className="">Back</p>
    </Button>
  );
}

export default BackButton;
