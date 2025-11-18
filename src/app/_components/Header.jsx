"use client";
import { ShoppingBag, Menu, X } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

const menuList = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Store",
    path: "/store",
  },
  {
    name: "Contact",
    path: "/contact",
  },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn, isLoaded } = useUser();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <div className="flex p-4 px-10 md:px-32 lg:px-48 bg-background shadow-md items-center justify-between font-orbitron relative">
        <Link href="/">
          <h2 className="font-medium text-lg px-2 p-1 text-primary">
            Jupiterax
          </h2>
        </Link>
        <ul className="hidden md:flex space-x-4">
          {menuList.map((item) => (
            <li key={item.name}>
              <a
                href={item.path}
                className="text-primary hover:text-gray-300 transition-colors"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <div className="relative cursor-pointer hover:opacity-70 transition-opacity">
            <ShoppingBag className="w-6 h-6" />
          </div>
          {!isLoaded ? (
            <Skeleton className="h-8 w-8 rounded-full" />
          ) : (
            <>
              {!isSignedIn && (
                <Link href="/sign-in">
                  <Button className="hidden md:block">Get Started</Button>
                </Link>
              )}
              <UserButton />
            </>
          )}
          <button
            className="md:hidden text-primary"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background shadow-lg border-t">
          <ul className="flex flex-col p-4 space-y-3">
            {menuList.map((item) => (
              <li key={item.name}>
                <a
                  href={item.path}
                  className="block text-primary hover:text-gray-300 transition-colors py-2 text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              </li>
            ))}
            {!isLoaded ? (
              <li className="pt-2">
                <Skeleton className="h-10 w-full" />
              </li>
            ) : (
              !isSignedIn && (
                <li className="pt-2">
                  <Link href="/sign-in">
                    <Button
                      className="w-full"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get Started
                    </Button>
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </>
  );
};

export default Header;
