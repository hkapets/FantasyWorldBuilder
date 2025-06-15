import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import WorldCard from "../WorldCard/WorldCard";
import { World } from "../../types/world";

interface HomeProps {
  onWorldSelect: (worldId: number | null) => void;
  selectedWorldId: number | null;
}

const Home: React.FC<HomeProps> = ({ onWorldSelect, selectedWorldId }) => {
  const [worlds, setWorlds] = useState<World[]>(
    JSON.parse(localStorage.getItem("worlds") || "[]")
  );
  const [showModal, setShowModal] = useState(false);
  const [newWorldName, setNewWorldName] = useState("");
  const [editingWorldId, setEditingWorldId] = useState<number | null>(null);

  const saveWorlds = (updatedWorlds: World[]) => {
    setWorlds(updatedWorlds);
    localStorage.setItem("worlds", JSON.stringify(updatedWorlds));
  };

  const handleCreateWorld = () => {
    if (newWorldName.trim()) {
      const newWorld: World = {
        id: Date.now(),
        name: newWorldName.trim(),
        createdAt: new Date().toISOString(),
      };
      saveWorlds([...worlds, newWorld]);
      setNewWorldName("");
      setShowModal(false);
      onWorldSelect(newWorld.id);
    }
  };

  const handleEditWorld = (world: World) => {
    setShowModal(true);
    setNewWorldName(world.name);
    setEditingWorldId(world.id);
  };

  const handleSaveEditedWorld = () => {
    if (newWorldName.trim() && editingWorldId !== null) {
      const updatedWorlds = worlds.map((w) =>
        w.id === editingWorldId ? { ...w, name: newWorldName.trim() } : w
      );
      saveWorlds(updatedWorlds);
      setNewWorldName("");
      setShowModal(false);
      setEditingWorldId(null);
    }
  };

  const handleDeleteWorld = (world: World) => {
    if (
      window.confirm(`Ви впевнені, що хочете видалити світ "${world.name}"?`)
    ) {
      const updatedWorlds = worlds.filter((w) => w.id !== world.id);
      saveWorlds(updatedWorlds);
      if (selectedWorldId === world.id) {
        onWorldSelect(updatedWorlds.length > 0 ? updatedWorlds[0].id : null);
      }
    }
  };

  const handleSelectWorld = (world: World) => {
    onWorldSelect(world.id);
  };

  return (
    <div
      style={{
        backgroundImage: "url('/images/fantasy-background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(44, 30, 58, 0.9)",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <h1 className="mb-3" style={{ borderBottom: "2px solid #6b4e9a" }}>
          Ласкаво просимо до Фентезійного Всесвіту!
        </h1>
        <p className="lead">
          Пориньте в епічну пригоду: створюйте світи, персонажів і досліджуйте
          лор вашої історії.
        </p>

        <div className="mb-4">
          <Button
            variant="primary"
            onClick={() => {
              setShowModal(true);
              setNewWorldName("");
              setEditingWorldId(null);
            }}
            style={{
              backgroundColor: "#6b4e9a",
              border: "none",
              marginBottom: "20px",
            }}
          >
            Створити новий світ
          </Button>
          <div className="row">
            {worlds.map((world) => (
              <div key={world.id} className="col-md-4 col-sm-6 mb-3">
                <WorldCard
                  world={world}
                  onEdit={handleEditWorld}
                  onDelete={handleDeleteWorld}
                  onSelect={handleSelectWorld}
                  isSelected={selectedWorldId === world.id}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="text-muted small mt-4">
          <p>Останнє оновлення: 15.06.2025</p>
          <p>© 2025 Фентезійний Всесвіт</p>
        </div>
      </div>

      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setNewWorldName("");
          setEditingWorldId(null);
        }}
        centered
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "#4a2c5a",
            color: "white",
            borderBottom: "1px solid #6b4e9a",
          }}
        >
          <Modal.Title>
            {editingWorldId ? "Редагувати світ" : "Створити новий світ"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#2c1e3a", color: "white" }}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Назва світу</Form.Label>
              <Form.Control
                type="text"
                value={newWorldName}
                onChange={(e) => setNewWorldName(e.target.value)}
                style={{
                  backgroundColor: "#4a2c5a",
                  color: "white",
                  border: "1px solid #6b4e9a",
                }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer
          style={{ backgroundColor: "#4a2c5a", borderTop: "1px solid #6b4e9a" }}
        >
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
              setNewWorldName("");
              setEditingWorldId(null);
            }}
            style={{ backgroundColor: "#8b0000", border: "none" }}
          >
            Скасувати
          </Button>
          <Button
            variant="primary"
            onClick={editingWorldId ? handleSaveEditedWorld : handleCreateWorld}
            style={{ backgroundColor: "#6b4e9a", border: "none" }}
          >
            {editingWorldId ? "Зберегти" : "Створити"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;
