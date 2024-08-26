"use client"; //changing compoent to client side as here we are using hooks
import React, { useEffect } from "react";
import Image from "next/image";
import { Plus } from "lucide-react"; //to add plus icon
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; //installed from shadcn

function Header() {
  const path = usePathname(); //to add pathname url
  const { user, isSignedIn } = useUser(); //to add user details. useUser hook provided by clerk to check if user isSigned or not

  useEffect(() => {}, []); // to add pathname url

  return (
    <div className="p-6 px-10 flex justify-between shadow-sm fixed top-0 w-full z-10 bg-white">
      <div className="flex gap-12 items-center">
        <div className="flex gap-2 items-center">
          <Image src={"/logo.png"} width={40} height={40} alt="logo" />
          <p className="text-lg font-bold">Bookingo</p>
        </div>
        <ul className=" hidden md:flex gap-10">
          {/* for small screen it is not flex and hidden and it is flex only for medium and large screens */}
          <Link href={"/"}>
            <li
              className={`hover:text-primary font-medium text-sm cursor-pointer ${
                path == "/" && "text-primary" //so that on whatever screen we are that nav link should be of colour primary
              }`}
            >
              <Button>Property Sales</Button>
            </li>
          </Link>
        </ul>
      </div>
      <div className="flex gap-2 items-center">
        <Link href={"/add-new-listing"}>
          <Button className="flex gap-2">
            <Plus className="h-5 w-5" />
            Post Your Ad
          </Button>
        </Link>
        {isSignedIn ? (
          //added from shadcn
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Image
                src={user?.imageUrl}
                width={35}
                height={35}
                alt="user profile"
                className="rounded-full"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={"/user-profile"}>Profile</Link>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <SignOutButton>Logout</SignOutButton>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href={"/sign-in"}>
            <Button variant="outline">Login</Button>
          </Link>
        )}
        {/* if user logged in show UserButton provided by clerk otherwise Button to Login */}
      </div>
    </div>
  );
}

export default Header;
