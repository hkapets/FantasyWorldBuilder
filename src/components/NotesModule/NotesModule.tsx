import React, { useState } from "react";

const NotesModule: React.FC = () => {
  const [notes, setNotes] = useState<string[]>([]);

  const addNote = () => {
    setNotes([...notes, `Note ${notes.length + 1}`]);
  };

  return (
    <div className="p-4">
      <h2 className="h4">Notes Module</h2>
      <button onClick={addNote} className="btn btn-primary mt-2">
        Add Note
      </button>
      <ul className="list-group mt-3">
        {notes.map((note, index) => (
          <li key={index} className="list-group-item">
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotesModule;
