import React, { useState } from "react";
import LoreModule from "./components/LoreModule/LoreModule";
import CharactersModule from "./components/CharactersModule/CharactersModule";
import RelationshipsModule from "./components/RelationshipsModule/RelationshipsModule";
import TimelineModule from "./components/TimelineModule/TimelineModule";
import MapsModule from "./components/MapModule/MapModule"; // Змінено на MapsModule для "Карти"
import MapModule from "./components/MapModule/MapModule"; // Залишаємо як є для "Карта"
import NotesModule from "./components/NotesModule/NotesModule";
import TemplatesModule from "./components/TemplatesModule/TemplatesModule";
import SearchModule from "./components/SearchModule/SearchModule";
import ImportExportModule from "./components/ImportExportModule/ImportExportModule";
import TestModule from "./components/TestModule/TestModule";

// Інтерфейс для типізації вкладок
interface Tab {
  name: string;
  component: React.FC;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Лор");

  // Масив вкладок у заданому порядку з українськими назвами
  const tabs: Tab[] = [
    { name: "Лор", component: LoreModule },
    { name: "Персонажі", component: CharactersModule },
    { name: "Зв’язки", component: RelationshipsModule },
    { name: "Хронологія", component: TimelineModule },
    { name: "Карти", component: MapsModule }, // Для "Карти" як категорії
    { name: "Карта", component: MapModule }, // Для окремої карти
    { name: "Нотатки", component: NotesModule },
    { name: "Шаблони", component: TemplatesModule },
    { name: "Пошук", component: SearchModule },
    { name: "Імпорт/Експорт", component: ImportExportModule },
    { name: "Тести", component: TestModule },
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
          Ласкаво просимо до модуля {activeTab}!
        </h2>
        <div className="card p-4 shadow-sm bg-secondary">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
};

export default App;
