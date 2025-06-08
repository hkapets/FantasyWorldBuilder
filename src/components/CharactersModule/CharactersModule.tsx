import React, { useState, useEffect } from "react";

interface Character {
  id: string;
  name: string;
  race: string;
  age: number;
  attributes: {
    strength: number;
    agility: number;
    intellect: number;
    endurance: number;
  };
  skills: string[];
  backstory: string;
  inventory: string[];
}

const CharactersModule: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>(() => {
    try {
      const saved = localStorage.getItem("characters");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.warn("Failed to load characters from localStorage:", error);
      return [];
    }
  });
  const [newCharacter, setNewCharacter] = useState<Character>({
    id: "",
    name: "",
    race: "",
    age: 0,
    attributes: { strength: 10, agility: 10, intellect: 10, endurance: 10 },
    skills: [],
    backstory: "",
    inventory: [],
  });

  useEffect(() => {
    try {
      localStorage.setItem("characters", JSON.stringify(characters));
    } catch (error) {
      console.warn("Failed to save characters to localStorage:", error);
    }
  }, [characters]);

  const addCharacter = () => {
    if (newCharacter.name.trim()) {
      setCharacters([
        ...characters,
        { ...newCharacter, id: Date.now().toString() },
      ]);
      setNewCharacter({
        id: "",
        name: "",
        race: "",
        age: 0,
        attributes: { strength: 10, agility: 10, intellect: 10, endurance: 10 },
        skills: [],
        backstory: "",
        inventory: [],
      });
    }
  };

  return (
    <div className="p-4">
      <h2 className="h4">Characters Module</h2>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Name"
          value={newCharacter.name}
          onChange={(e) =>
            setNewCharacter({ ...newCharacter, name: e.target.value })
          }
        />
        <input
          type="number"
          className="form-control"
          placeholder="Age"
          value={newCharacter.age}
          onChange={(e) =>
            setNewCharacter({
              ...newCharacter,
              age: parseInt(e.target.value) || 0,
            })
          }
        />
        <input
          type="text"
          className="form-control"
          placeholder="Race"
          value={newCharacter.race}
          onChange={(e) =>
            setNewCharacter({ ...newCharacter, race: e.target.value })
          }
        />
        <button onClick={addCharacter} className="btn btn-secondary">
          Add Character
        </button>
      </div>
      <ul className="list-group">
        {characters.map((char) => (
          <li key={char.id} className="list-group-item">
            {char.name} ({char.race}, {char.age} years)
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CharactersModule;
