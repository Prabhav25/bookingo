import { Bath, BedDouble, MapPin, Ruler, Search } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import GoogleAddressSearch from "./GoogleAddressSearch";
import FilterSection from "./FilterSection";
import { Button } from "@/components/ui/button";

function Listing({
  //sending prop to ListingMapView.jsx parent component
  listing,
  handleSearchClick,
  searchedAddress,
  setBedCount,
  setBathCount,
  setParkingCount,
  setHomeType,
  setCoordinates,
}) {
  const [address, setAddress] = useState(); //how many addresses are available

  return (
    <div>
      <div className="p-3 flex gap-4">
        <GoogleAddressSearch
          selectedAddress={(v) => {
            searchedAddress(v);
            setAddress(v);
          }}
          setCoordinates={setCoordinates}
        />

        {/* when user selects the address and clicks on search it will API call to database and will fetch dpeends on the selection of the address  */}
        <Button className="flex gap-2" onClick={handleSearchClick}>
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>

      <FilterSection //accepting props from FilterSection.jsx
        setBedCount={setBedCount}
        setBathCount={setBathCount}
        setParkingCount={setParkingCount}
        setHomeType={setHomeType}
      />
      {/* if address found so it will tell us how many addresses */}
      {address && (
        <div className="px-3">
          <h2 className="text-lg">
            Found <span className="font-bold">{listing?.length}</span> Result in
            <span className="text-primary font-bold"> {address?.label}</span>
          </h2>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listing?.length > 0
          ? listing.map((item, index) => (
              <div className="p-3 hover:border hover:border-primary cursor-pointer rounded-lg">
                <Image
                  src={item.listingImages[0].url}
                  width={800}
                  height={150}
                  className="rounded-lg object-cover h-[170px]"
                />
                <div className="flex mt-2 flex-col gap-2">
                  <h2 className="font-bold text-xl">${item.price}</h2>
                  <h2 className="flex gap-2 tex-sm text-gray-400">
                    <MapPin className="h-4 w-4" />
                    {item.address}
                  </h2>
                  <div className="flex gap-2 mt-2 justify-between">
                    <h2 className="flex gap-2 text-sm bg-slate-200 rounded-md p-2 w-full text-gray-400 justify-center">
                      <BedDouble className="h-4 w-4" />
                      {item?.bedroom}
                    </h2>
                    <h2 className="flex gap-2 text-sm bg-slate-200 rounded-md p-2 w-full text-gray-400 justify-center">
                      <Bath className="h-4 w-4" />
                      {item?.bathroom}
                    </h2>
                    <h2 className="flex gap-2 text-sm bg-slate-200 rounded-md p-2 w-full text-gray-400 justify-center">
                      <Ruler className="h-4 w-4" />
                      {item?.area}
                    </h2>
                  </div>
                </div>
              </div>
            ))
          : [1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
              <div
                key={index}
                className="h-[230px] w-full bg-slate-200 animate-pulse rounded-lg"
              ></div>
            ))}
      </div>
    </div>
  );
}

export default Listing;
