import { Bath, BedDouble, MapPin, X } from "lucide-react";
import Image from "next/image";
import React from "react";

function MarkerListingItem({ item, closeHandler }) {
  //passing closeHandler to Markeritem
  return (
    <div>
      <div className="cursor-pointer rounded-lg w-[180px]">
        {/* icons appears with listing whensome clicks on marker to close it */}
        <X onClick={() => closeHandler()} />
        <Image
          src={item.listingImages[0].url}
          width={800}
          height={150}
          className="rounded-lg w-[180px] object-cover h-[120px]"
        />
        <div className="flex flex-col gap-2 p-2 bg-white">
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarkerListingItem;
