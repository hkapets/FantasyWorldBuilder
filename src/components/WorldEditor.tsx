import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { createWorld, updateWorld, World } from "../store/worldSlice";

type ActiveTab = "general" | "locations" | "characters" | "notes";

function WorldEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const worlds = useSelector((state: RootState) => state.worldSlice.worlds);

  const [worldData, setWorldData] = useState<Partial<World>>({
    name: "",
    description: "",
    locations: [],
    characters: [],
    notes: "",
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>("general");

  useEffect(() => {
    if (id) {
      const existingWorld = worlds.find((w) => w.id === id);
      if (existingWorld) {
        setWorldData(existingWorld);
      }
    }
  }, [id, worlds]);

  const handleSave = () => {
    if (!worldData.name?.trim()) {
      alert("Будь ласка, введіть назву світу");
      return;
    }

    if (id) {
      // Оновлення існуючого світу
      dispatch(updateWorld({ id, updates: worldData }));
    } else {
      // Створення нового світу
      const newWorld: World = {
        id: Date.now().toString(),
        name: worldData.name,
        description: worldData.description || "",
        locations: worldData.locations || [],
        characters: worldData.characters || [],
        notes: worldData.notes || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch(createWorld(newWorld));
    }

    navigate("/worlds");
  };

  const addLocation = () => {
    const locationName = prompt("Введіть назву локації:");
    if (locationName) {
      const newLocation = {
        id: Date.now().toString(),
        name: locationName,
        description: "",
        type: "misc" as const,
      };
      setWorldData((prev) => ({
        ...prev,
        locations: [...(prev.locations || []), newLocation],
      }));
    }
  };

  const addCharacter = () => {
    const characterName = prompt("Введіть ім'я персонажа:");
    if (characterName) {
      const newCharacter = {
        id: Date.now().toString(),
        name: characterName,
        description: "",
        role: "",
      };
      setWorldData((prev) => ({
        ...prev,
        characters: [...(prev.characters || []), newCharacter],
      }));
    }
  };

  const removeLocation = (locationId: string) => {
    setWorldData((prev) => ({
      ...prev,
      locations: prev.locations?.filter((loc) => loc.id !== locationId) || [],
    }));
  };

  const removeCharacter = (characterId: string) => {
    setWorldData((prev) => ({
      ...prev,
      characters:
        prev.characters?.filter((char) => char.id !== characterId) || [],
    }));
  };

  return (
    <div className="world-editor">
      <div className="world-editor-header">
        <h2>{id ? "Редагувати світ" : "Створити новий світ"}</h2>
        <div className="header-actions">
          <button onClick={handleSave} className="save-button">
            Зберегти
          </button>
          <button onClick={() => navigate("/worlds")} className="cancel-button">
            Скасувати
          </button>
        </div>
      </div>

      <div className="world-editor-tabs">
        <button
          className={`tab ${activeTab === "general" ? "active" : ""}`}
          onClick={() => setActiveTab("general")}
        >
          Загальне
        </button>
        <button
          className={`tab ${activeTab === "locations" ? "active" : ""}`}
          onClick={() => setActiveTab("locations")}
        >
          Локації ({worldData.locations?.length || 0})
        </button>
        <button
          className={`tab ${activeTab === "characters" ? "active" : ""}`}
          onClick={() => setActiveTab("characters")}
        >
          Персонажі ({worldData.characters?.length || 0})
        </button>
        <button
          className={`tab ${activeTab === "notes" ? "active" : ""}`}
          onClick={() => setActiveTab("notes")}
        >
          Нотатки
        </button>
      </div>

      <div className="world-editor-content">
        {activeTab === "general" && (
          <div className="general-tab">
            <div className="form-group">
              <label htmlFor="worldName">Назва світу *</label>
              <input
                id="worldName"
                type="text"
                value={worldData.name || ""}
                onChange={(e) =>
                  setWorldData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Введіть назву вашого світу"
              />
            </div>

            <div className="form-group">
              <label htmlFor="worldDescription">Опис світу</label>
              <textarea
                id="worldDescription"
                value={worldData.description || ""}
                onChange={(e) =>
                  setWorldData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Опишіть ваш світ, його особливості, історію..."
                rows={6}
              />
            </div>
          </div>
        )}

        {activeTab === "locations" && (
          <div className="locations-tab">
            <div className="tab-header">
              <h3>Локації</h3>
              <button onClick={addLocation} className="add-button">
                Додати локацію
              </button>
            </div>

            <div className="items-list">
              {worldData.locations?.map((location) => (
                <div key={location.id} className="item-card">
                  <div className="item-header">
                    <h4>{location.name}</h4>
                    <button
                      onClick={() => removeLocation(location.id)}
                      className="remove-button"
                    >
                      Видалити
                    </button>
                  </div>
                  <p>{location.description || "Без опису"}</p>
                  <span className="item-type">Тип: {location.type}</span>
                </div>
              )) || <p>Локацій поки не додано</p>}
            </div>
          </div>
        )}

        {activeTab === "characters" && (
          <div className="characters-tab">
            <div className="tab-header">
              <h3>Персонажі</h3>
              <button onClick={addCharacter} className="add-button">
                Додати персонажа
              </button>
            </div>

            <div className="items-list">
              {worldData.characters?.map((character) => (
                <div key={character.id} className="item-card">
                  <div className="item-header">
                    <h4>{character.name}</h4>
                    <button
                      onClick={() => removeCharacter(character.id)}
                      className="remove-button"
                    >
                      Видалити
                    </button>
                  </div>
                  <p>{character.description || "Без опису"}</p>
                  <span className="item-type">
                    Роль: {character.role || "Не вказано"}
                  </span>
                </div>
              )) || <p>Персонажів поки не додано</p>}
            </div>
          </div>
        )}

        {activeTab === "notes" && (
          <div className="notes-tab">
            <div className="form-group">
              <label htmlFor="worldNotes">Нотатки</label>
              <textarea
                id="worldNotes"
                value={worldData.notes || ""}
                onChange={(e) =>
                  setWorldData((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Записуйте тут свої ідеї, плани, додаткові деталі про світ..."
                rows={15}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WorldEditor;
