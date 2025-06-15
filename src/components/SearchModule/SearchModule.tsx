import React, { useState, useEffect } from "react";
import { Button, Form, Card, ListGroup } from "react-bootstrap";

interface Note {
  id: number | null;
  title: string;
  text: string;
  category: string;
}

interface Relationship {
  id: number;
  character1Id: number;
  character2Id: number;
  type: string;
  description: string;
}

interface LoreEntry {
  id: string;
  section: string;
  text: string;
}

interface Map {
  id: number;
  name: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
}

interface SearchModuleProps {
  selectedWorldId?: number; // Додано проп для вибраного світу
  notes?: Note[];
  relationships?: Relationship[];
  loreEntries?: LoreEntry[];
  maps?: Map[];
  events?: Event[];
}

const SearchModule: React.FC<SearchModuleProps> = ({
  selectedWorldId,
  notes = [],
  relationships = [],
  loreEntries = [],
  maps = [],
  events = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<
    Array<{ type: string; item: any }>
  >([]);

  useEffect(() => {
    if (selectedWorldId === undefined) {
      setSearchResults([]);
      return;
    }

    const search = (term: string) => {
      const results: Array<{ type: string; item: any }> = [];

      // Пошук у нотатках
      notes.forEach((note) => {
        if (
          note.title.toLowerCase().includes(term.toLowerCase()) ||
          note.text.toLowerCase().includes(term.toLowerCase())
        ) {
          results.push({ type: "Note", item: note });
        }
      });

      // Пошук у зв’язках
      relationships.forEach((relationship) => {
        if (
          relationship.description.toLowerCase().includes(term.toLowerCase()) ||
          relationship.type.toLowerCase().includes(term.toLowerCase())
        ) {
          results.push({ type: "Relationship", item: relationship });
        }
      });

      // Пошук у лорі
      loreEntries.forEach((entry) => {
        if (entry.text.toLowerCase().includes(term.toLowerCase())) {
          results.push({ type: "LoreEntry", item: entry });
        }
      });

      // Пошук у картах
      maps.forEach((map) => {
        if (map.name.toLowerCase().includes(term.toLowerCase())) {
          results.push({ type: "Map", item: map });
        }
      });

      // Пошук у подіях
      events.forEach((event) => {
        if (
          event.title.toLowerCase().includes(term.toLowerCase()) ||
          event.description.toLowerCase().includes(term.toLowerCase())
        ) {
          results.push({ type: "Event", item: event });
        }
      });

      setSearchResults(results);
    };

    if (searchTerm.trim()) {
      search(searchTerm);
    } else {
      setSearchResults([]);
    }
  }, [
    searchTerm,
    notes,
    relationships,
    loreEntries,
    maps,
    events,
    selectedWorldId,
  ]);

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-dark">Пошук</h2>
      </div>
      <Form.Control
        type="text"
        placeholder="Введіть ключове слово..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          backgroundColor: "#4a2c5a",
          color: "white",
          border: "1px solid #6b4e9a",
        }}
      />

      {searchResults.length > 0 && (
        <div className="mt-3">
          <h4 className="text-white">
            Результати пошуку ({searchResults.length})
          </h4>
          <ListGroup>
            {searchResults.map((result, index) => (
              <ListGroup.Item
                key={index}
                className="bg-dark text-white"
                style={{ border: "1px solid #6b4e9a" }}
              >
                <strong>{result.type}:</strong>{" "}
                {result.type === "Note" && result.item.title}
                {result.type === "Relationship" &&
                  `Персонаж ${result.item.character1Id} - ${result.item.type} - Персонаж ${result.item.character2Id}`}
                {result.type === "LoreEntry" &&
                  result.item.text.substring(0, 50) + "..."}
                {result.type === "Map" && result.item.name}
                {result.type === "Event" && result.item.title}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}

      {searchTerm && searchResults.length === 0 && (
        <p className="text-muted mt-3">Нічого не знайдено.</p>
      )}
    </div>
  );
};

export default SearchModule;
