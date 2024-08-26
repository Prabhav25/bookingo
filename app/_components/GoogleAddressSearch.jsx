"use client";
import { MapPin } from "lucide-react";
import React, { useState } from "react";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";

// passing props selectedAddress, setCoordinates to the parent add-new-listing page.jsx
function GoogleAddressSearch({ selectedAddress, setCoordinates }) {
  // State for managing the error message
  const [errorMessage, setErrorMessage] = useState("");

  // Function to handle place change
  const handlePlaceChange = (place) => {
    // Check if place is not null and has a label property
    if (place && place.label) {
      // when someone search and clicks on the address it gets consoles
      console.log(place);
      selectedAddress(place);

      // when someone clicks on a place so to store its coordinates in latitude and longitude
      geocodeByAddress(place.label)
        .then((result) => getLatLng(result[0]))
        .then(({ lat, lng }) => {
          console.log(lat, lng);
          setCoordinates({ lat, lng });
          setErrorMessage(""); // Clear any previous error message
        })
        .catch((error) => {
          console.error("Geocode error:", error);
          setErrorMessage("Failed to retrieve coordinates. Please try again.");
        });
    } else {
      setErrorMessage("Please search and choose a valid address.");
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex items-center w-full">
        <MapPin className="h-10 w-10 p-2 rounded-l-lg text-primary bg-purple-200" />
        <GooglePlacesAutocomplete
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY}
          selectProps={{
            placeholder: "Search Property Address",
            isClearable: true,
            className: "w-full",
            onChange: handlePlaceChange,
          }}
        />
      </div>
      {/* Display error message if there is one */}
      {errorMessage && <p className="mt-2 text-red-500">{errorMessage}</p>}
    </div>
  );
}

export default GoogleAddressSearch;
