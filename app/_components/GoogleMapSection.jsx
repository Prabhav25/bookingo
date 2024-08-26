import React, { useEffect, useState } from "react";
import { GoogleMap } from "@react-google-maps/api";
import MarkerItem from "./MarkerItem";
const containerStyle = {
  width: "100%",
  height: "80vh",
  borderRadius: 10,
};

const center = {
  lat: -3.745,
  lng: -38.523,
};
function GoogleMapSection({ coordinates, listing }) {
  //accepting prop coordinats from ListingMapView
  //when someone searched a location it should come on google mao so setting coordinates

  const [center, setCenter] = useState({
    lat: -3.745,
    lng: -38.523,
  });
  const [map, setMap] = React.useState(null);

  useEffect(() => {
    //when someone search coordinates are available set the center to coordinates
    coordinates && setCenter(coordinates);
  }, [coordinates]);

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);
  return (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {/* Child components, such as markers, info windows, etc. */}
        {listing.map((item, index) => (
          <MarkerItem key={index} item={item} /> //passing props to MarkerItem.jsx
        ))}
      </GoogleMap>
    </div>
  );
}

export default GoogleMapSection;
