import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import Chronology from "./components/Chronology";
import Notes from "./components/Notes";
import Lore from "./components/Lore";
import Characters from "./components/Characters";
import { WorldData, TimelineEvent, Note } from "./types";
import { loadFromStorage, saveToStorage } from "./store/store";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App: React.FC = () => {
  const [currentModule, setCurrentModule] = useState<string>("home");
  const [worldData, setWorldData] = useState<WorldData>({
    events: [],
    notes: [],
    lore: [],
    characters: [],
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  useEffect(() => {
    const savedData = loadFromStorage();
    if (savedData) {
      setWorldData(savedData);
    }
  }, []);

  useEffect(() => {
    saveToStorage(worldData);
  }, [worldData]);

  const addEvent = (event: TimelineEvent): void => {
    setWorldData((prev) => ({
      ...prev,
      events: [...prev.events, { ...event, id: Date.now().toString() }],
    }));
  };

  const updateEvent = (
    eventId: string,
    updatedEvent: Partial<TimelineEvent>
  ): void => {
    setWorldData((prev) => ({
      ...prev,
      events: prev.events.map((event) =>
        event.id === eventId ? { ...event, ...updatedEvent } : event
      ),
    }));
  };

  const deleteEvent = (eventId: string): void => {
    setWorldData((prev) => ({
      ...prev,
      events: prev.events.filter((event) => event.id !== eventId),
    }));
  };

  const addNote = (note: Note): void => {
    setWorldData((prev) => ({
      ...prev,
      notes: [...prev.notes, { ...note, id: Date.now().toString() }],
    }));
  };

  const updateNote = (noteId: string, updatedNote: Partial<Note>): void => {
    setWorldData((prev) => ({
      ...prev,
      notes: prev.notes.map((note) =>
        note.id === noteId ? { ...note, ...updatedNote } : note
      ),
    }));
  };

  const deleteNote = (noteId: string): void => {
    setWorldData((prev) => ({
      ...prev,
      notes: prev.notes.filter((note) => note.id !== noteId),
    }));
  };

  const renderCurrentModule = (): JSX.Element => {
    switch (currentModule) {
      case "home":
        return <Home world={worldData} />;
      case "chronology":
        return (
          <Chronology
            events={worldData.events}
            onAddEvent={addEvent}
            onUpdateEvent={updateEvent}
            onDeleteEvent={deleteEvent}
            soundEnabled={soundEnabled}
          />
        );
      case "notes":
        return (
          <Notes
            notes={worldData.notes}
            events={worldData.events}
            onAddNote={addNote}
            onUpdateNote={updateNote}
            onDeleteNote={deleteNote}
            soundEnabled={soundEnabled}
          />
        );
      case "lore":
        return <Lore lore={worldData.lore} />;
      case "characters":
        return <Characters characters={worldData.characters} />;
      default:
        return <Home world={worldData} />;
    }
  };

  return (
    <div className="App">
      <Navigation
        currentModule={currentModule}
        onModuleChange={setCurrentModule}
        soundEnabled={soundEnabled}
        onSoundToggle={setSoundEnabled}
      />
      <Container fluid className="main-content">
        <Row>
          <Col>{renderCurrentModule()}</Col>
        </Row>
      </Container>
    </div>
  );
};

export default App;
