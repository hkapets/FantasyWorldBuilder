import React from "react";
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

const App: React.FC = () => {
  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center">
      <div className="card p-4 shadow-sm">
        <h1 className="card-title text-primary">FantasyWorldBuilder працює!</h1>
        <p className="card-text text-muted">Це тестове повідомлення.</p>
        <NotesModule />
        <LoreModule />
        <MapModule />
        <CharactersModule />
        <TimelineModule />
        <ImportExportModule />
        <TestModule />
        <SearchModule />
        <TemplatesModule />
        <RelationshipsModule />
      </div>
    </div>
  );
};

export default App;
