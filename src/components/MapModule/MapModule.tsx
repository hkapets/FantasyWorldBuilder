import React, { useEffect, useRef, useState, useCallback } from "react";
import L, { Map, LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";

// Іконки для маркерів (локальні файли)
const markerIcons = {
  city: L.icon({
    iconUrl: "/markers/marker-icon-2x-gold.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  forest: L.icon({
    iconUrl: "/markers/marker-icon-2x-green.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  cave: L.icon({
    iconUrl: "/markers/marker-icon-2x-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  mountain: L.icon({
    iconUrl: "/markers/marker-icon-2x-grey.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  river: L.icon({
    iconUrl: "/markers/marker-icon-2x-blue.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  temple: L.icon({
    iconUrl: "/markers/marker-icon-2x-violet.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  ruins: L.icon({
    iconUrl: "/markers/marker-icon-2x-brown.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  magicZone: L.icon({
    iconUrl: "/markers/marker-icon-2x-black.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
};

const MapModule: React.FC = () => {
  const mapRef = useRef<Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [markers, setMarkers] = useState<
    { position: LatLngTuple; type: keyof typeof markerIcons }[]
  >(() => {
    const savedMarkers = localStorage.getItem("fantasyMapMarkers");
    if (savedMarkers) {
      try {
        const parsedMarkers = JSON.parse(savedMarkers);
        return parsedMarkers.map((m: any) => {
          const position =
            Array.isArray(m.position) &&
            m.position.length >= 2 &&
            !isNaN(m.position[0]) &&
            !isNaN(m.position[1])
              ? ([Number(m.position[0]), Number(m.position[1])] as LatLngTuple)
              : ([0, 0] as LatLngTuple);
          const type = (
            Object.keys(markerIcons) as (keyof typeof markerIcons)[]
          ).includes(m.type)
            ? m.type
            : "city";
          return { position, type };
        });
      } catch (e) {
        console.error("Error parsing saved markers:", e);
        return [{ position: [0, 0] as LatLngTuple, type: "city" }];
      }
    }
    return [{ position: [0, 0] as LatLngTuple, type: "city" }];
  });
  const [mapImage, setMapImage] = useState<string | null>(null);
  const [selectedMarkerType, setSelectedMarkerType] =
    useState<keyof typeof markerIcons>("city");
  const [isMapReady, setIsMapReady] = useState(false);

  // Обробник кліку з використанням useCallback
  const handleMapClick = useCallback(
    (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      console.log("Adding marker with type:", selectedMarkerType); // Відладка
      setMarkers((prevMarkers) => [
        ...prevMarkers,
        { position: [lat, lng] as LatLngTuple, type: selectedMarkerType },
      ]);
    },
    [selectedMarkerType]
  );

  // Функція очищення всіх маркерів
  const clearMarkers = () => {
    setMarkers([]);
    if (mapRef.current) {
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapRef.current!.removeLayer(layer);
        }
      });
    }
    localStorage.removeItem("fantasyMapMarkers");
  };

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: [0, 0],
        zoom: 3,
        layers: [],
      });

      mapRef.current.on("click", handleMapClick);

      L.gridLayer({ tileSize: 256 }).addTo(mapRef.current);

      if (mapImage) {
        L.imageOverlay(mapImage, [
          [-100, -100],
          [100, 100],
        ]).addTo(mapRef.current);
      }

      setIsMapReady(true);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mapImage, handleMapClick]);

  useEffect(() => {
    if (mapRef.current && isMapReady) {
      // Очищаємо старі маркери
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapRef.current!.removeLayer(layer);
        }
      });

      // Ініціалізуємо маркери з перевіркою типу
      markers.forEach(({ position, type }) => {
        if (markerIcons[type]) {
          const marker = L.marker(position, {
            icon: markerIcons[type],
            draggable: true,
          }).addTo(mapRef.current!);
          marker.on("dragend", (e: L.DragEndEvent) => {
            const newLatLng = e.target.getLatLng();
            const updatedMarkers = markers.map((m, i) =>
              i ===
              markers.findIndex(
                (m) =>
                  m.position[0] === position[0] && m.position[1] === position[1]
              )
                ? {
                    ...m,
                    position: [newLatLng.lat, newLatLng.lng] as LatLngTuple,
                  }
                : m
            );
            setMarkers(updatedMarkers);
          });
          marker.on("contextmenu", () => {
            if (mapRef.current) {
              mapRef.current.removeLayer(marker);
              const updatedMarkers = markers.filter(
                (m) =>
                  m.position[0] !== position[0] || m.position[1] !== position[1]
              );
              setMarkers(updatedMarkers);
            }
          });
        }
      });

      localStorage.setItem("fantasyMapMarkers", JSON.stringify(markers));
    }
  }, [markers, isMapReady]);

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
      <div className="mb-3">
        <label htmlFor="markerType" className="form-label me-2">
          Select Marker Type:
        </label>
        <select
          className="form-select w-auto d-inline-block"
          id="markerType"
          value={selectedMarkerType}
          onChange={(e) => {
            const newType = e.target.value as keyof typeof markerIcons;
            console.log("Selected type:", newType); // Додаткова відладка
            setSelectedMarkerType(newType);
          }}
        >
          <option value="city">Місто</option>
          <option value="forest">Ліс</option>
          <option value="cave">Печера</option>
          <option value="mountain">Гора</option>
          <option value="river">Річка</option>
          <option value="temple">Храм</option>
          <option value="ruins">Руїни</option>
          <option value="magicZone">Магічна зона</option>
        </select>
      </div>
      <div className="mb-3">
        <button className="btn btn-danger" onClick={clearMarkers}>
          Очистити всі маркери
        </button>
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
