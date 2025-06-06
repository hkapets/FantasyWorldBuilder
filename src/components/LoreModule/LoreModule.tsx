import React, { useState, useEffect } from "react";

interface LoreEntry {
  id: string;
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

  return (
    <div className="p-4">
      <h2 className="h4">Lore Module</h2>
      <div className="input-group mb-3">
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
      <ul className="list-group mt-3">
        {loreEntries.length > 0 ? (
          loreEntries.map((entry) => (
            <li key={entry.id} className="list-group-item">
              {entry.text}
            </li>
          ))
        ) : (
          <li className="list-group-item text-muted">No lore entries yet.</li>
        )}
      </ul>
      <button onClick={clearLore} className="btn btn-danger mt-2 ms-2">
        Clear Lore
      </button>
    </div>
  );
};

export default LoreModule;
