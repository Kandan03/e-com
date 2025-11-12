import { ShoppingBag } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

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
  return (
    <div className="flex p-4 px-10 md:px-32 lg:px-48 bg-background shadow-md items-center justify-between font-orbitron">
      <h2 className="font-medium text-lg px-2 p-1 text-primary">Jupiterax</h2>
      <ul className="flex space-x-4">
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
      <div className="flex items-center">
        <ShoppingBag />
        <Button className="ml-4">Get Started</Button>
      </div>
    </div>
  );
};

export default Header;
