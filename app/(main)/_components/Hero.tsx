'use client'
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
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Category {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string;
}

function Hero() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = () => {
    if (selectedCategory) {
      // If a category is selected, navigate to the category page
      const category = categories.find(cat => cat._id === selectedCategory);
      if (category) {
        router.push(`/categories/${category._id}?name=${encodeURIComponent(category.name)}`);
      }
    } else if (searchInput.trim()) {
      // If there's search input but no category selected, navigate to companies search
      router.push(`/companies?search=${encodeURIComponent(searchInput.trim())}`);
    }
    // If neither is provided, you might want to show an error or do nothing
  };

  return (
    <div className="relative h-screen pt-[100px] bg-[url('/images/home_section_1.jpg')] bg-top bg-no-repeat bg-fixed flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 container">
        <p className="text-2xl md:text-5xl text-white font-extrabold">
          Every Review is an Experience!
        </p>
        <p className="text-md md:text-lg text-white">
          Check Ratings of Businesses and Employees, Read Reviews & Buy
        </p>
        <div className="flex p-2 bg-white rounded mt-4">
          <div className="flex-1">
            <Input
              placeholder="What are you looking for"
              className="bg-white border-none shadow-none"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="flex items-center">
            <Separator orientation="vertical" className="bg-black mx-4" />
            <Select 
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[180px] bg-white border-none shadow-none outline-none">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectGroup>
                  <SelectLabel>Categories</SelectLabel>
                  {loading ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : error ? (
                    <SelectItem value="error" disabled>
                      Error loading categories
                    </SelectItem>
                  ) : (
                    categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="">
            <Button 
              variant={"outline"} 
              className="bg-color text-white ml-2"
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;