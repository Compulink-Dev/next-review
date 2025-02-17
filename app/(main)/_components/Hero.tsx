import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import React from "react";

function Hero() {
  return (
    <div className="relative h-screen pt-[100px] bg-[url('/images/home_section_1.jpg')] bg-top bg-no-repeat bg-fixed flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10">
        <p className="text-5xl text-white font-extrabold">
          Every Review is an Experience!
        </p>
        <p className="text-center text-white">
          Check Ratings of Businesses and Employees, Read Reviews & Buy
        </p>
        <div className="flex p-2 bg-white rounded mt-4">
          <div className="flex-1">
            <Input
              placeholder="What are you looking for"
              className="bg-white border-none shadow-none"
            />
          </div>
          <div className="flex items-center">
            <Separator orientation="vertical" className="bg-black" />
            <Select>
              <SelectTrigger className="w-[180px] bg-white border-none shadow-none outline-none">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  <SelectItem value="apple">Design</SelectItem>
                  <SelectItem value="banana">Health</SelectItem>
                  <SelectItem value="blueberry">Construction</SelectItem>
                  <SelectItem value="grapes">Consultancy</SelectItem>
                  <SelectItem value="pineapple">ICT</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="">
            <Button variant={"outline"} className="bg-color text-white ml-2">
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
