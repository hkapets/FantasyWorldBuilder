import React, { useState } from "react";

const NotesModule: React.FC = () => {
  const [notes, setNotes] = useState<string[]>([]);

  const addNote = () => {
    setNotes([...notes, `Note ${notes.length + 1}`]);
  };

  return (
    <div className="p-4">
      <h2>Notes Module</h2>
      <button onClick={addNote} className="bg-blue-500 text-white p-2 rounded">
        Add Note
      </button>
      <ul>
        {notes.map((note, index) => (
          <li key={index}>{note}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotesModule;
