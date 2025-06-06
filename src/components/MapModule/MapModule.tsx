import React, { useEffect, useRef, useState } from "react";
import L, { Map, LatLngTuple } from "leaflet";

const MapModule: React.FC = () => {
  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [markers, setMarkers] = useState<LatLngTuple[]>(() => {
    // Завантажуємо маркери з localStorage при ініціалізації
    const savedMarkers = localStorage.getItem("fantasyMapMarkers");
    return savedMarkers ? JSON.parse(savedMarkers) : [[0, 0]];
  });
  const [mapImage, setMapImage] = useState<string | null>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      // Ініціалізуємо карту
      mapRef.current = L.map(mapContainerRef.current, {
        center: [0, 0],
        zoom: 3,
        layers: [],
      });

      // Додаємо обробник кліку
      mapRef.current.on("click", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        setMarkers([...markers, [lat, lng]]);
      });

      // Додаємо сітку
      L.gridLayer({ tileSize: 256 }).addTo(mapRef.current);

      // Додаємо завантажене зображення
      if (mapImage) {
        L.imageOverlay(mapImage, [
          [-100, -100],
          [100, 100],
        ]).addTo(mapRef.current);
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapImage]);

  useEffect(() => {
    if (mapRef.current) {
      // Очищаємо старі маркери
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapRef.current!.removeLayer(layer);
        }
      });
      // Додаємо нові маркери
      markers.forEach(([lat, lng]) => {
        L.marker([lat, lng]).addTo(mapRef.current!);
      });
      // Зберігаємо маркери в localStorage
      localStorage.setItem("fantasyMapMarkers", JSON.stringify(markers));
    }
  }, [markers]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMapImage(url);
    }
  };

  return (
    <div className="p-4">
      <h2 className="h4">Map Module</h2>
      <div className="mb-3">
        <label htmlFor="mapImage" className="form-label">
          Upload Fantasy Map Image (PNG/JPG)
        </label>
        <input
          type="file"
          className="form-control"
          id="mapImage"
          accept="image/png, image/jpeg"
          onChange={handleImageUpload}
        />
      </div>
      <div
        ref={mapContainerRef}
        style={{ width: "100%", height: "400px" }}
        className="border"
      />
    </div>
  );
};

export default MapModule;
