import React, { useState, useEffect, useRef } from "react";
import { Button, Form, Modal } from "react-bootstrap";

interface Map {
  id: number;
  name: string;
  url: string;
  width: number;
  height: number;
}

interface Marker {
  id: number;
  mapId: number;
  x: number;
  y: number;
  type: string;
  customName?: string;
  labelText?: string; // Додано поле для тексту мітки
}

interface Drawing {
  id: number;
  mapId: number;
  points: { x: number; y: number }[];
  color: string;
  lineWidth: number;
  lineStyle: string;
}

const MapModule = () => {
  const [maps, setMaps] = useState<Map[]>(() => {
    const savedMaps = localStorage.getItem("maps");
    return savedMaps ? JSON.parse(savedMaps) : [];
  });
  const [selectedMapId, setSelectedMapId] = useState<number | null>(
    maps.length > 0 ? maps[0].id : null
  );
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newMapName, setNewMapName] = useState("");
  const [mapFile, setMapFile] = useState<File | null>(null);
  const [markers, setMarkers] = useState<Marker[]>(() => {
    const savedMarkers = localStorage.getItem("markers");
    return savedMarkers ? JSON.parse(savedMarkers) : [];
  });
  const [drawings, setDrawings] = useState<Drawing[]>(() => {
    const savedDrawings = localStorage.getItem("drawings");
    return savedDrawings ? JSON.parse(savedDrawings) : [];
  });
  const [selectedMarkerType, setSelectedMarkerType] = useState<string>("City");
  const [scale, setScale] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [newText, setNewText] = useState("");
  const [drawingColor, setDrawingColor] = useState("#ffffff");
  const [drawingLineWidth, setDrawingLineWidth] = useState(2);
  const [drawingLineStyle, setDrawingLineStyle] = useState("solid");
  const [customMarkerName, setCustomMarkerName] = useState("");
  const [undoDrawings, setUndoDrawings] = useState<Drawing[]>([]);
  const [currentDrawing, setCurrentDrawing] = useState<Drawing | null>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    localStorage.setItem("maps", JSON.stringify(maps));
    localStorage.setItem("markers", JSON.stringify(markers));
    localStorage.setItem("drawings", JSON.stringify(drawings));
  }, [maps, markers, drawings]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setMapFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (mapFile && newMapName.trim()) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const newMap: Map = {
            id: Date.now(),
            name: newMapName,
            url: e.target?.result as string,
            width: img.width,
            height: img.height,
          };
          setMaps((prevMaps) => [...prevMaps, newMap]);
          setSelectedMapId(newMap.id);
          setShowUploadModal(false);
          setNewMapName("");
          setMapFile(null);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(mapFile);
    }
  };

  const handleDeleteMap = (id: number) => {
    if (window.confirm("Ви впевнені, що хочете видалити цю карту?")) {
      setMaps(maps.filter((map) => map.id !== id));
      setMarkers(markers.filter((marker) => marker.mapId !== id));
      setDrawings(drawings.filter((drawing) => drawing.mapId !== id));
      if (selectedMapId === id) {
        setSelectedMapId(maps.length > 1 ? maps[0].id : null);
      }
    }
  };

  const getRelativeCoordinates = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return { x: 0, y: 0 };

    const imgRect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - imgRect.left) / imgRect.width) * 100;
    const y = ((e.clientY - imgRect.top) / imgRect.height) * 100;

    return { x, y };
  };

  const handleAddMarker = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDrawing) return;

    if (selectedMapId && imgRef.current) {
      const { x, y } = getRelativeCoordinates(e);

      const newMarker: Marker = {
        id: Date.now(),
        mapId: selectedMapId,
        x: x,
        y: y,
        type: selectedMarkerType,
        customName:
          selectedMarkerType === "Custom" ? customMarkerName : undefined,
        labelText: newText.trim() || undefined,
      };
      setMarkers([...markers, newMarker]);
      setNewText("");
      console.log(`Added marker at x: ${x}%, y: ${y}%`);
    }
  };

  const handleDeleteMarker = (id: number) => {
    if (window.confirm("Ви впевнені, що хочете видалити цей маркер?")) {
      setMarkers(markers.filter((marker) => marker.id !== id));
    }
  };

  const handleDeleteAllMarkers = () => {
    if (
      selectedMapId &&
      window.confirm(
        "Ви впевнені, що хочете видалити всі маркери та мітки на цій карті?"
      )
    ) {
      setMarkers(markers.filter((marker) => marker.mapId !== selectedMapId));
    }
  };

  const handleClearMap = () => {
    if (
      selectedMapId &&
      window.confirm("Ви впевнені, що хочете очистити цю карту від усіх змін?")
    ) {
      setMarkers(markers.filter((marker) => marker.mapId !== selectedMapId));
      setDrawings(
        drawings.filter((drawing) => drawing.mapId !== selectedMapId)
      );
    }
  };

  const handleClearDrawings = () => {
    if (
      selectedMapId &&
      window.confirm("Ви впевнені, що хочете очистити малювання на цій карті?")
    ) {
      setDrawings(
        drawings.filter((drawing) => drawing.mapId !== selectedMapId)
      );
    }
  };

  const handleUndoDrawing = () => {
    if (selectedMapId && drawings.length > 0) {
      const currentDrawings = drawings.filter((d) => d.mapId === selectedMapId);
      if (currentDrawings.length > 0) {
        const lastDrawing = currentDrawings[currentDrawings.length - 1];
        setUndoDrawings((prev) => [...prev, lastDrawing]);
        setDrawings(drawings.filter((d) => d.id !== lastDrawing.id));
      }
    }
  };

  const handleStartDrawing = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !selectedMapId || !imgRef.current) return;

    e.preventDefault();
    setIsMouseDown(true);

    const { x, y } = getRelativeCoordinates(e);
    const imgRect = imgRef.current.getBoundingClientRect();

    const newDrawing: Drawing = {
      id: Date.now(),
      mapId: selectedMapId,
      points: [{ x: (x / 100) * imgRect.width, y: (y / 100) * imgRect.height }],
      color: drawingColor,
      lineWidth: drawingLineWidth,
      lineStyle: drawingLineStyle,
    };

    setCurrentDrawing(newDrawing);
    console.log(`Start drawing at x: ${x}%, y: ${y}%`);
  };

  const handleDrawing = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !isMouseDown || !currentDrawing || !imgRef.current)
      return;

    const { x, y } = getRelativeCoordinates(e);
    const imgRect = imgRef.current.getBoundingClientRect();

    setCurrentDrawing((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        points: [
          ...prev.points,
          { x: (x / 100) * imgRect.width, y: (y / 100) * imgRect.height },
        ],
      };
    });
    console.log(`Drawing at x: ${x}%, y: ${y}%`);
  };

  const handleEndDrawing = () => {
    if (currentDrawing && isMouseDown) {
      setDrawings((prev) => [...prev, currentDrawing]);
      setCurrentDrawing(null);
    }
    setIsMouseDown(false);
  };

  const handleZoom = (zoomIn: boolean) => {
    setScale((prev) =>
      Math.max(0.5, Math.min(2, prev + (zoomIn ? 0.1 : -0.1)))
    );
  };

  const getMarkerIcon = (type: string): string => {
    const iconMap: { [key: string]: string } = {
      City: "/markers/city.png",
      Village: "/markers/village.png",
      MagicZone: "/markers/magic.png",
      Castle: "/markers/castle.png",
      Dungeon: "/markers/dungeon.png",
      Temple: "/markers/temple.png",
      Custom: "/markers/custom.png",
    };
    return iconMap[type] || "/markers/city.png";
  };

  const selectedMap = maps.find((map) => map.id === selectedMapId);

  return (
    <div className="p-3 container mx-auto">
      <h2
        className="display-6 fw-bold mb-3 text-white"
        style={{
          backgroundColor: "#2c1e3a",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        Карти
      </h2>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div>
          <Form.Control
            as="select"
            value={selectedMapId || ""}
            onChange={(e) => setSelectedMapId(Number(e.target.value) || null)}
            style={{
              width: "200px",
              backgroundColor: "#4a2c5a",
              color: "white",
              border: "1px solid #6b4e9a",
            }}
          >
            <option value="">Оберіть карту</option>
            {maps.map((map) => (
              <option
                key={map.id}
                value={map.id}
                style={{ backgroundColor: "#4a2c5a", color: "white" }}
              >
                {map.name}
              </option>
            ))}
          </Form.Control>
          <Button
            variant="primary"
            onClick={() => setShowUploadModal(true)}
            className="ms-2"
            style={{ backgroundColor: "#6b4e9a", border: "none" }}
          >
            Завантажити карту
          </Button>
          <Form.Control
            as="select"
            value={selectedMarkerType}
            onChange={(e) => setSelectedMarkerType(e.target.value)}
            className="ms-2"
            style={{
              width: "150px",
              backgroundColor: "#4a2c5a",
              color: "white",
              border: "1px solid #6b4e9a",
            }}
          >
            <option value="City">Місто</option>
            <option value="Village">Село</option>
            <option value="MagicZone">Магічна зона</option>
            <option value="Castle">Замок</option>
            <option value="Dungeon">Підземелля</option>
            <option value="Temple">Храм</option>
            <option value="Custom">Кастомний</option>
          </Form.Control>
          {selectedMarkerType === "Custom" && (
            <Form.Control
              type="text"
              value={customMarkerName}
              onChange={(e) => setCustomMarkerName(e.target.value)}
              placeholder="Назва кастомного маркера"
              className="ms-2"
              style={{
                width: "200px",
                backgroundColor: "#4a2c5a",
                color: "white",
                border: "1px solid #6b4e9a",
              }}
            />
          )}
          <Button
            variant="secondary"
            onClick={() => handleZoom(true)}
            className="ms-2"
            style={{ backgroundColor: "#6b4e9a", border: "none" }}
          >
            +
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleZoom(false)}
            className="ms-2"
            style={{ backgroundColor: "#6b4e9a", border: "none" }}
          >
            -
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteAllMarkers}
            className="ms-2"
            style={{ backgroundColor: "#dc3545", border: "none" }}
          >
            Видалити маркери та мітки
          </Button>
          <Button
            variant="warning"
            onClick={handleClearMap}
            className="ms-2"
            style={{ backgroundColor: "#ffc107", border: "none" }}
          >
            Очистити карту
          </Button>
          <Button
            variant="info"
            onClick={handleClearDrawings}
            className="ms-2"
            style={{ backgroundColor: "#17a2b8", border: "none" }}
          >
            Очистити малювання
          </Button>
          <Button
            variant="secondary"
            onClick={handleUndoDrawing}
            className="ms-2"
            style={{ backgroundColor: "#6c757d", border: "none" }}
            disabled={
              drawings.filter((d) => d.mapId === selectedMapId).length === 0
            }
          >
            Відкат малювання
          </Button>
          <Form.Control
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Текст для мітки"
            className="ms-2"
            style={{
              width: "200px",
              backgroundColor: "#4a2c5a",
              color: "white",
              border: "1px solid #6b4e9a",
            }}
          />
          <Button
            variant="success"
            onClick={() => setIsDrawing(!isDrawing)}
            className="ms-2"
            style={{
              backgroundColor: isDrawing ? "#dc3545" : "#28a745",
              border: "none",
            }}
          >
            {isDrawing ? "Зупинити малювання" : "Малювати"}
          </Button>
          <Form.Control
            type="color"
            value={drawingColor}
            onChange={(e) => setDrawingColor(e.target.value)}
            className="ms-2"
            style={{ width: "50px", height: "40px", padding: "0" }}
          />
          <Form.Control
            as="select"
            value={drawingLineStyle}
            onChange={(e) => setDrawingLineStyle(e.target.value)}
            className="ms-2"
            style={{
              width: "100px",
              backgroundColor: "#4a2c5a",
              color: "white",
              border: "1px solid #6b4e9a",
            }}
          >
            <option value="solid">Суцільна</option>
            <option value="dashed">Пунктирна</option>
            <option value="dotted">Точкова</option>
          </Form.Control>
          <Form.Control
            type="number"
            value={drawingLineWidth}
            onChange={(e) => setDrawingLineWidth(Number(e.target.value))}
            min="1"
            max="10"
            className="ms-2"
            style={{
              width: "70px",
              backgroundColor: "#4a2c5a",
              color: "white",
              border: "1px solid #6b4e9a",
            }}
          />
        </div>
        {selectedMap && (
          <div>
            <Button
              variant="danger"
              onClick={() => handleDeleteMap(selectedMap.id)}
              style={{ backgroundColor: "#dc3545", border: "none" }}
            >
              Видалити карту
            </Button>
          </div>
        )}
      </div>
      <div
        style={{
          maxWidth: "100%",
          overflowX: "auto",
          backgroundColor: "#2c1e3a",
          padding: "10px",
          borderRadius: "5px",
          position: "relative",
        }}
      >
        {selectedMap ? (
          <div
            ref={mapRef}
            onClick={handleAddMarker}
            onMouseDown={handleStartDrawing}
            onMouseMove={handleDrawing}
            onMouseUp={handleEndDrawing}
            onMouseLeave={handleEndDrawing}
            style={{
              position: "relative",
              display: "inline-block",
              transform: `scale(${scale})`,
              transformOrigin: "0 0",
              cursor: isDrawing ? "crosshair" : "pointer",
            }}
          >
            <img
              ref={imgRef}
              src={selectedMap.url}
              alt={selectedMap.name}
              style={{
                display: "block",
                maxWidth: "100%",
                height: "auto",
                maxHeight: "600px",
                objectFit: "contain",
              }}
            />
            {markers
              .filter((marker) => marker.mapId === selectedMapId)
              .map((marker) => (
                <div
                  key={marker.id}
                  style={{
                    position: "absolute",
                    left: `${marker.x}%`,
                    top: `${marker.y}%`,
                    transform: "translate(-50%, -50%)",
                    width: "32px",
                    height: "32px",
                    backgroundImage: `url(${getMarkerIcon(marker.type)})`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    cursor: "pointer",
                    zIndex: 10,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteMarker(marker.id);
                  }}
                  onMouseEnter={(e) => {
                    const tooltip = e.currentTarget.querySelector(
                      ".marker-tooltip"
                    ) as HTMLElement | null;
                    if (tooltip) tooltip.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    const tooltip = e.currentTarget.querySelector(
                      ".marker-tooltip"
                    ) as HTMLElement | null;
                    if (tooltip) tooltip.style.opacity = "0";
                  }}
                  title={
                    marker.labelText
                      ? `${marker.customName || marker.type}: ${
                          marker.labelText
                        }`
                      : marker.customName || marker.type
                  }
                >
                  {marker.labelText && (
                    <div
                      className="marker-tooltip"
                      style={{
                        position: "absolute",
                        bottom: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        whiteSpace: "nowrap",
                        opacity: "0",
                        pointerEvents: "none",
                        transition: "opacity 0.3s",
                        zIndex: 20,
                      }}
                    >
                      {marker.labelText}
                    </div>
                  )}
                </div>
              ))}
            <svg
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: `${selectedMap.width}px`,
                height: `${selectedMap.height}px`,
                pointerEvents: "none",
                zIndex: 5,
              }}
            >
              {drawings
                .filter((drawing) => drawing.mapId === selectedMapId)
                .map((drawing) => (
                  <polyline
                    key={drawing.id}
                    points={drawing.points
                      .map((p) => `${p.x},${p.y}`)
                      .join(" ")}
                    stroke={drawing.color}
                    strokeWidth={drawing.lineWidth}
                    strokeDasharray={
                      drawing.lineStyle === "dashed"
                        ? "5 5"
                        : drawing.lineStyle === "dotted"
                        ? "2 2"
                        : "0"
                    }
                    fill="none"
                  />
                ))}
              {currentDrawing && currentDrawing.points.length >= 2 && (
                <polyline
                  points={currentDrawing.points
                    .map((p) => `${p.x},${p.y}`)
                    .join(" ")}
                  stroke={currentDrawing.color}
                  strokeWidth={currentDrawing.lineWidth}
                  strokeDasharray={
                    currentDrawing.lineStyle === "dashed"
                      ? "5 5"
                      : currentDrawing.lineStyle === "dotted"
                      ? "2 2"
                      : "0"
                  }
                  fill="none"
                  opacity="0.7"
                />
              )}
            </svg>
          </div>
        ) : (
          <p className="text-white">Оберіть або завантажте карту.</p>
        )}
      </div>
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#4a2c5a", color: "white" }}
        >
          <Modal.Title>Завантажити нову карту</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#2c1e3a", color: "white" }}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Назва карти</Form.Label>
              <Form.Control
                type="text"
                value={newMapName}
                onChange={(e) => setNewMapName(e.target.value)}
                style={{
                  backgroundColor: "#4a2c5a",
                  color: "white",
                  border: "1px solid #6b4e9a",
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Завантажити зображення</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "#4a2c5a" }}>
          <Button
            variant="secondary"
            onClick={() => setShowUploadModal(false)}
            style={{ backgroundColor: "#8b0000", border: "none" }}
          >
            Закрити
          </Button>
          <Button
            variant="primary"
            onClick={handleUpload}
            style={{ backgroundColor: "#6b4e9a", border: "none" }}
            disabled={!newMapName || !mapFile}
          >
            Завантажити
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MapModule;
