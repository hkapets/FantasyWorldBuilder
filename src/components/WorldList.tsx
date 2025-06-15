import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { World, addWorld, removeWorld } from "../store/worldSlice";

interface WorldListProps {
  worlds: World[];
  selectedWorldId: number | null;
  onWorldSelect: (worldId: number | null) => void;
}

const WorldList: React.FC<WorldListProps> = ({
  worlds,
  selectedWorldId,
  onWorldSelect,
}) => {
  const dispatch = useDispatch();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newWorldName, setNewWorldName] = useState("");
  const [newWorldDescription, setNewWorldDescription] = useState("");

  const handleCreateWorld = () => {
    if (newWorldName.trim()) {
      const newWorld: World = {
        id: Date.now(), // Простий спосіб генерації ID
        name: newWorldName.trim(),
        description: newWorldDescription.trim(),
        createdAt: new Date().toISOString(),
      };

      dispatch(addWorld(newWorld));
      setNewWorldName("");
      setNewWorldDescription("");
      setShowCreateForm(false);
      onWorldSelect(newWorld.id);
    }
  };

  const handleDeleteWorld = (worldId: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Запобігаємо вибору світу при видаленні
    if (window.confirm("Ви впевнені, що хочете видалити цей світ?")) {
      dispatch(removeWorld(worldId));
    }
  };

  return (
    <div className="world-list">
      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowCreateForm(!showCreateForm)}
      >
        {showCreateForm ? "Скасувати" : "Створити новий світ"}
      </button>

      {showCreateForm && (
        <div className="create-world-form mb-3 p-3 border rounded">
          <div className="mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Назва світу"
              value={newWorldName}
              onChange={(e) => setNewWorldName(e.target.value)}
            />
          </div>
          <div className="mb-2">
            <textarea
              className="form-control"
              placeholder="Опис світу"
              value={newWorldDescription}
              onChange={(e) => setNewWorldDescription(e.target.value)}
              rows={3}
            />
          </div>
          <button
            className="btn btn-success"
            onClick={handleCreateWorld}
            disabled={!newWorldName.trim()}
          >
            Створити
          </button>
        </div>
      )}

      <div className="worlds">
        {worlds.length === 0 ? (
          <p className="text-muted">Ще немає створених світів</p>
        ) : (
          worlds.map((world) => (
            <div
              key={world.id}
              className={`card mb-2 ${
                selectedWorldId === world.id ? "border-primary" : ""
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => onWorldSelect(world.id)}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="card-title">{world.name}</h5>
                    <p className="card-text">{world.description}</p>
                    <small className="text-muted">
                      Створено: {new Date(world.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={(e) => handleDeleteWorld(world.id, e)}
                    title="Видалити світ"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WorldList;
