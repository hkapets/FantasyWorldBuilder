import React from "react";
import NotesModule from "./components/NotesModule/NotesModule";
import LoreModule from "./components/LoreModule/LoreModule";
import MapModule from "./components/MapModule/MapModule";

const App: React.FC = () => {
  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center">
      <div className="card p-4 shadow-sm">
        <h1 className="card-title text-primary">FantasyWorldBuilder працює!</h1>
        <p className="card-text text-muted">Це тестове повідомлення.</p>
        <NotesModule />
        <LoreModule />
        <MapModule />
      </div>
    </div>
  );
};

export default App;
