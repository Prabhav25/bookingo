"use client";
import GoogleAddressSearch from "@/app/_components/GoogleAddressSearch";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/client";
import { useUser } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

function AddNewListing() {
  const [selectedAddress, setSelectedAddress] = useState();
  const [coordinates, setCoordinates] = useState();
  const { user } = useUser(); //getting user information from clerk
  const [loader, setLoader] = useState(false); //adding data in server takes some time
  const router = useRouter(); //for navigation

  const nextHandler = async () => {
    setLoader(true); //when user clicks on button next
    const { data, error } = await supabase //code template taken from API docs of supabase inserting a row
      .from("listing") //lisiting is table name created in supabase
      .insert([
        //inserting data in table created in supabase
        {
          address: selectedAddress.label,
          coordinates: coordinates,
          createdBy: user?.primaryEmailAddress.emailAddress, //when you are logged in the data is stored
        },
      ])
      .select();
    if (data) {
      //if data is inserted and clicked on next
      setLoader(false); //when data is inserted
      console.log("New data added", data);
      toast("New Address added for listing");
      router.replace("/edit-listing/" + data[0].id); //here id is the new id of the inserted record
    }
    if (error) {
      setLoader(false);
      //   console.log("Error");
      console.error("Error:", error.message);
      toast("Server side error");
    }
  };
  return (
    <div className="mt-10 md:mx-56 lg:mx-80">
      <div className="p-10 flex flex-col gap-5 items-center justify-center">
        <h2 className="font-bold text-2xl">Add New Listing</h2>
        <div className="p-10 rounded-lg w-full border shadow-md flex flex-col gap-5">
          <h2 className="text-gray-500">
            Enter address which you want to list
          </h2>
          <GoogleAddressSearch
            selectedAddress={(value) => setSelectedAddress(value)}
            setCoordinates={(value) => setCoordinates(value)}
          />
          {/* Below button is diabled in below conditions */}
          <Button
            disabled={!selectedAddress || !coordinates || loader}
            onClick={nextHandler}
          >
            {loader ? <Loader className="animate-spin" /> : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddNewListing;
