"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-red-900 bg-opacity-10 shadow-md backdrop-blur-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-2">
        {/* Logo */}
        <Link href="/">
          <Image src="/icons/logo.png" alt="Logo" width={30} height={30} />
        </Link>

        {/* Navigation Links */}
        <nav>
          <ul className="flex items-center space-x-6 text-xs">
          <li>
              <Link href="/companies" className="text-white hover:text-red-600">
                Companies
              </Link>
            </li>
            <li>
              <Link href="/categories" className="text-white hover:text-red-600">
                Categories
              </Link>
            </li>
            <li>
              <Link href="/employees" className="text-white hover:text-red-600">
                Employees
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-white hover:text-red-600">
                Contact
              </Link>
            </li>
            <div className="flex items-center gap-2">
          
              <li>
                <Button
                  className="bg-color hover:bg-red-600 text-white"
                  onClick={() => {
                    router.push("/signin");
                  }}
                >
                  Get Started
                </Button>
              </li>
            </div>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
