import React, { useState } from "react";
import NotesModule from "./components/NotesModule/NotesModule";
import LoreModule from "./components/LoreModule/LoreModule";
import MapModule from "./components/MapModule/MapModule";
import CharactersModule from "./components/CharactersModule/CharactersModule";
import TimelineModule from "./components/TimelineModule/TimelineModule";
import ImportExportModule from "./components/ImportExportModule/ImportExportModule";
import TestModule from "./components/TestModule/TestModule";
import SearchModule from "./components/SearchModule/SearchModule";
import TemplatesModule from "./components/TemplatesModule/TemplatesModule";
import RelationshipsModule from "./components/RelationshipsModule/RelationshipsModule";

// Додамо інтерфейс для типізації вкладок
interface Tab {
  name: string;
  component: React.FC;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Notes");

  // Масив вкладок
  const tabs: Tab[] = [
    { name: "Notes", component: NotesModule },
    { name: "Lore", component: LoreModule },
    { name: "Map", component: MapModule },
    { name: "Characters", component: CharactersModule },
    { name: "Timeline", component: TimelineModule },
    { name: "Import/Export", component: ImportExportModule },
    { name: "Test", component: TestModule },
    { name: "Search", component: SearchModule },
    { name: "Templates", component: TemplatesModule },
    { name: "Relationships", component: RelationshipsModule },
  ];

  const ActiveComponent = tabs.find((tab) => tab.name === activeTab)?.component;

  return (
    <div className="min-vh-100 bg-dark text-light">
      {/* Навігаційна панель */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            FantasyWorldBuilder
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              {tabs.map((tab) => (
                <li className="nav-item" key={tab.name}>
                  <button
                    className={`nav-link ${
                      activeTab === tab.name ? "active" : ""
                    }`}
                    onClick={() => setActiveTab(tab.name)}
                  >
                    {tab.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* Контейнер для вмісту вкладок */}
      <div className="container mt-4">
        <h2 className="text-center mb-4">
          Ласкаво просимо до {activeTab} модуля!
        </h2>
        <div className="card p-4 shadow-sm bg-secondary">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
};

export default App;
