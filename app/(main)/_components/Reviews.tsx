import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import React from "react";

function Reviews() {
  return (
    <div className="bg-red-100 mt-8">
      <div className="container py-8">
        <div className="flex items-center justify-between">
          <Title title="Latest reviews" subtitle="View the lates reviews" />
          <Button
            variant={"outline"}
            className="border-red-900 text-color hover:bg-color hover:text-white"
          >
            View all
          </Button>
        </div>
        Reviews
      </div>
    </div>
  );
}

export default Reviews;
