import React, { useState, useEffect } from "react";

interface LoreEntry {
  id: string;
  section: string;
  text: string;
}

const LoreModule: React.FC = () => {
  const [loreEntries, setLoreEntries] = useState<LoreEntry[]>(() => {
    try {
      const saved = localStorage.getItem("loreEntries");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.warn("Failed to load lore entries from localStorage:", error);
      return [];
    }
  });
  const [newLore, setNewLore] = useState("");
  const [selectedSection, setSelectedSection] = useState("worldDescription");

  useEffect(() => {
    try {
      localStorage.setItem("loreEntries", JSON.stringify(loreEntries));
    } catch (error) {
      console.warn("Failed to save lore entries to localStorage:", error);
    }
  }, [loreEntries]);

  const addLore = () => {
    if (newLore.trim()) {
      const newEntry: LoreEntry = {
        id: Date.now().toString(),
        section: selectedSection,
        text: `${newLore} - ${new Date().toLocaleDateString()}`,
      };
      setLoreEntries([...loreEntries, newEntry]);
      setNewLore("");
    }
  };

  const clearLore = () => {
    setLoreEntries([]);
    try {
      localStorage.removeItem("loreEntries");
    } catch (error) {
      console.warn("Failed to clear lore entries from localStorage:", error);
    }
  };

  const sections = {
    worldDescription: "Опис світу",
    racesAndPeoples: "Раси і народи",
    religionAndMythology: "Релігія і міфологія",
    characters: "Персонажі",
    magic: "Магія",
    artifacts: "Артефакти",
  };

  return (
    <div className="p-4">
      <h2 className="h4">Lore Module</h2>
      <div className="input-group mb-3">
        <select
          className="form-select"
          value={selectedSection}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setSelectedSection(e.target.value)
          }
        >
          {Object.entries(sections).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
        <input
          type="text"
          className="form-control"
          placeholder="Enter lore here..."
          value={newLore}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewLore(e.target.value)
          }
        />
        <button onClick={addLore} className="btn btn-secondary">
          Add Lore Entry
        </button>
      </div>
      <div className="mt-3">
        {Object.entries(sections).map(([key, value]) => (
          <div key={key} className="mb-4">
            <h3 className="h5 text-gray-700">{value}</h3>
            {key === "worldDescription" && (
              <div className="ml-3">
                <h4 className="h6 text-gray-600">Географія</h4>
                <ul className="list-group">
                  {loreEntries
                    .filter((entry) => entry.section === `${key}-geography`)
                    .map((entry) => (
                      <li key={entry.id} className="list-group-item">
                        {entry.text}
                      </li>
                    ))}
                </ul>
                <h4 className="h6 text-gray-600">Клімат</h4>
                <ul className="list-group">
                  {loreEntries
                    .filter((entry) => entry.section === `${key}-climate`)
                    .map((entry) => (
                      <li key={entry.id} className="list-group-item">
                        {entry.text}
                      </li>
                    ))}
                </ul>
                <h4 className="h6 text-gray-600">Локації</h4>
                <ul className="list-group">
                  {loreEntries
                    .filter((entry) => entry.section === `${key}-locations`)
                    .map((entry) => (
                      <li key={entry.id} className="list-group-item">
                        {entry.text}
                      </li>
                    ))}
                </ul>
              </div>
            )}
            {key !== "worldDescription" && (
              <ul className="list-group">
                {loreEntries
                  .filter((entry) => entry.section === key)
                  .map((entry) => (
                    <li key={entry.id} className="list-group-item">
                      {entry.text}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <button onClick={clearLore} className="btn btn-danger mt-2 ms-2">
        Clear Lore
      </button>
    </div>
  );
};

export default LoreModule;
