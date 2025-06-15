import React, { useState } from "react";
import { World } from "../store/worldSlice";

interface WorldEditorProps {
  world: World;
}

const WorldEditor: React.FC<WorldEditorProps> = ({ world }) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "characters" | "locations" | "history"
  >("overview");

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="tab-content overview">
            <div className="card">
              <div className="card-header">
                <h2 className="mb-0">{world.name}</h2>
              </div>
              <div className="card-body">
                <p className="lead">{world.description}</p>
                <hr />
                <div className="row">
                  <div className="col-md-6">
                    <strong>Створено:</strong>
                    <p>{new Date(world.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="col-md-6">
                    <strong>ID світу:</strong>
                    <p>{world.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "characters":
        return (
          <div className="tab-content characters">
            <div className="card">
              <div className="card-header">
                <h2 className="mb-0">Персонажі</h2>
              </div>
              <div className="card-body">
                <p>Тут будуть персонажі вашого світу</p>
                <div className="alert alert-info">
                  <strong>Планується:</strong> Додавання, редагування та
                  управління персонажами
                </div>
              </div>
            </div>
          </div>
        );

      case "locations":
        return (
          <div className="tab-content locations">
            <div className="card">
              <div className="card-header">
                <h2 className="mb-0">Локації</h2>
              </div>
              <div className="card-body">
                <p>Тут будуть локації вашого світу</p>
                <div className="alert alert-info">
                  <strong>Планується:</strong> Карти, міста, регіони та інші
                  місця
                </div>
              </div>
            </div>
          </div>
        );

      case "history":
        return (
          <div className="tab-content history">
            <div className="card">
              <div className="card-header">
                <h2 className="mb-0">Історія</h2>
              </div>
              <div className="card-body">
                <p>Тут буде історія вашого світу</p>
                <div className="alert alert-info">
                  <strong>Планується:</strong> Хронологія подій, епохи, важливі
                  моменти
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="world-editor">
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Огляд
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "characters" ? "active" : ""}`}
            onClick={() => setActiveTab("characters")}
          >
            Персонажі
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "locations" ? "active" : ""}`}
            onClick={() => setActiveTab("locations")}
          >
            Локації
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            Історія
          </button>
        </li>
      </ul>

      <div className="editor-content">{renderTabContent()}</div>
    </div>
  );
};

export default WorldEditor;
