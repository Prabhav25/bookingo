"use client"; //hooks only work with client side rendering
import React, { useActionState, useEffect, useState } from "react";
import Listing from "./Listing";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";
import GoogleMapSection from "./GoogleMapSection";

function ListingMapView({ type }) {
  //saving all the listing in one state
  const [listing, setListing] = useState([]);
  const [searchedAddress, setSearchedAddress] = useState();
  const [bedCount, setBedCount] = useState(0);
  const [bathCount, setBathCount] = useState(0);
  const [parkingCount, setParkingCount] = useState(0);
  const [homeType, setHomeType] = useState();
  const [coordinates, setCoordinates] = useState();
  useEffect(() => {
    getLatestListing(); //calling this method whenever component loads
  }, []);

  //accepting type as prop sent by ListingMapView.jsx
  const getLatestListing = async () => {
    // to fetch data
    const { data, error } = await supabase
      .from("listing")
      .select(
        `*,listingImages(
        url,
        listing_id
      )`
      )

      //to fetch only data with status active so using equal condition
      .eq("active", true)
      .eq("type", type)
      .order("id", { ascending: false });

    if (data) {
      setListing(data);
    }
    if (error) {
      toast("Server Side Error");
    }
  };

  const handleSearchClick = async () => {
    console.log(searchedAddress); //by consoling we will come to know in console what is the actual position of address and then we will add it in searchTerm

    const searchTerm = searchedAddress?.value?.structured_formatting?.main_text;

    //to fetch data
    let query = supabase
      .from("listing")
      .select(
        `*,listingImages(
        url,
        listing_id
      )`
      )

      //to fetch only data with status active so using equal condition
      .eq("active", true)
      .eq("type", type)
      .gte("bedroom", bedCount)
      .gte("bathroom", bathCount)
      .gte("parking", parkingCount)
      .like("address", "%" + searchTerm + "%") //if the searchTerm is present in any of the addresses it will fetch it
      .order("id", { ascending: false });

    if (homeType) {
      query = query.eq("propertyType", homeType);
    }

    const { data, error } = await query;

    if (data) {
      setListing(data);
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <Listing
          listing={listing}
          handleSearchClick={handleSearchClick}
          searchedAddress={(v) => setSearchedAddress(v)}
          setBedCount={setBedCount}
          setBathCount={setBathCount}
          setParkingCount={setParkingCount}
          setHomeType={setHomeType}
          setCoordinates={setCoordinates}
        />
        {/* accepting listing, handleSearchClick, searchedAddress, setCoordinates from Listing.jsx  */}
        {/*accepting listing, handleSearchClick, searchedAddress, setBedCount, setBathCount, setParkingCount, setHomeType from FilterSection.jsx-> Listing.jsx -> ListingMapView.jsx  */}
      </div>
      <div className="fixed right-10 h-full md:w-[350px] lg:w-[450px] xl:w-[650px]">
        {/* passing coordinates prop to GoogleMapSection  */}
        <GoogleMapSection listing={listing} coordinates={coordinates} />
      </div>
    </div>
  );
}

export default ListingMapView;
