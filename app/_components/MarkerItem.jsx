import { MarkerF, OverlayView } from "@react-google-maps/api";
import React, { useState } from "react";
import MarkerListingItem from "./MarkerListingItem";

function MarkerItem({ item }) {
  const [selectedListng, setSelectedListing] = useState();
  return (
    <div>
      <MarkerF
        position={item.coordinates} //getting poition of coordinates to set marker
        onClick={() => setSelectedListing(item)} //when user clicks on the marker we set the selected listing item
      />

      {/* when someooe clicks on the marker it should show some pop woth the place  */}
      {selectedListng && (
        <OverlayView
          position={selectedListng.coordinates}
          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        >
          <div>
            <MarkerListingItem
              closeHandler={() => setSelectedListing(null)}
              item={selectedListng}
            />
          </div>
        </OverlayView>
      )}
    </div>
  );
}

export default MarkerItem;
