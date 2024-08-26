"use client";
//clerk can be used in client side
import { UserProfile } from "@clerk/nextjs";

import React from "react";

function User() {
  return (
    <div className="my-6 md:mx-10 lg:px-32">
      <UserProfile></UserProfile>
    </div>
  );
}

export default User;
