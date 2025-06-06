import React, { useState } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

const MapModule: React.FC = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
  const center = { lat: 0, lng: 0 };
  const mapStyles = { width: "100%", height: "400px" };
  const [markers, setMarkers] = useState<{ lat: number; lng: number }[]>([
    center,
  ]);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setMarkers([...markers, { lat, lng }]);
    }
  };

  return (
    <div className="p-4">
      <h2 className="h4">Map Module</h2>
      <APIProvider apiKey={apiKey}>
        <Map
          id="my-map"
          defaultZoom={3}
          defaultCenter={center}
          style={mapStyles}
          onClick={handleMapClick}
        >
          {markers.map((marker, index) => (
            <Marker key={index} position={marker} />
          ))}
        </Map>
      </APIProvider>
    </div>
  );
};

export default MapModule;
