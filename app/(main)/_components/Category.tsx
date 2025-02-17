import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { ChartArea } from "lucide-react";
import React from "react";

const Card = () => {
  return (
    <div className="relative h-[200px] w-full rounded bg-red-700">
      <div className="absolute bottom-0 left-0 p-4 text-white flex items-center justify-between w-full">
        <div className="">
          <p className="text-xs">10 Results</p>
          <p className="font-bold text-2xl">Bars</p>
        </div>
        <div className="flex items-center gap-2">
          <ChartArea size={16} />
          <p className="text-xs">15 Reviews</p>
        </div>
      </div>
    </div>
  );
};

function Category() {
  return (
    <div className="container pt-8">
      <div className="flex items-center justify-between">
        <Title
          title="Top Categories"
          subtitle="View the most reviewed categories"
        />
        <Button
          variant={"outline"}
          className="border-red-900 text-color hover:bg-color hover:text-white"
        >
          View all
        </Button>
      </div>
      <div className="mt-8">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
      </div>
    </div>
  );
}

export default Category;
