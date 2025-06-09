import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import {
  MdNote,
  MdPersonOutline,
  MdLandscape,
  MdHistory,
  MdPushPin,
} from "react-icons/md";

interface Note {
  id: number | null;
  title: string;
  text: string;
  category: string;
  tags: string;
  dateCreated: string;
  relatedEvent: string;
  isPinned: boolean;
}

interface NotesModuleProps {
  onEventSaved?: (note: Note) => void;
}

const NotesModule = ({ onEventSaved }: NotesModuleProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState<Note>({
    id: null,
    title: "",
    text: "",
    category: "",
    tags: "",
    dateCreated: new Date().toISOString().split("T")[0],
    relatedEvent: "",
    isPinned: false,
  });

  // Логіка useEffect і handleSave (додай свою реалізацію)

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "персонаж":
        return <MdPersonOutline />;
      case "локація":
        return <MdLandscape />;
      case "подія":
        return <MdHistory />;
      default:
        return <MdNote />;
    }
  };

  // Сортування та використання
  const sortedNotes = [...notes].sort((a, b) =>
    a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1
  );

  return (
    <div className="p-4">
      <h2>Нотатки</h2>
      <div className="mb-3 d-flex gap-3">
        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
          className="me-2"
        >
          Додати нотатку
        </Button>
      </div>
      <div className="notes-list">
        {sortedNotes.map((note: Note) => (
          <div key={note.id} className="note-card fade-in">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                {getCategoryIcon(note.category)}
                <h5>{note.title}</h5>
              </div>
              <Button
                variant="light"
                onClick={() => {
                  /* togglePin logic */
                }}
                className="ms-2"
              >
                <MdPushPin color={note.isPinned ? "#e9c46a" : "#4a2c2a"} />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        {/* Форма Modal */}
      </Modal>
    </div>
  );
};

export default NotesModule;
