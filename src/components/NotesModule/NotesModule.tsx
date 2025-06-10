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
  date?: string;
  description?: string;
  location?: string;
  relatedCharacters?: string;
  type?: string;
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

  const handleSave = () => {
    const newNote = { ...formData, id: Date.now() };
    if (selectedNote) {
      setNotes(
        notes.map((note) => (note.id === selectedNote.id ? newNote : note))
      );
    } else {
      setNotes([...notes, newNote]);
    }
    if (onEventSaved) onEventSaved(newNote);
    setShowModal(false);
    setFormData({
      ...formData,
      id: null,
      title: "",
      text: "",
      category: "",
      tags: "",
      relatedEvent: "",
    });
    setSelectedNote(null);
  };

  const handleEdit = (note: Note) => {
    setSelectedNote(note);
    setFormData(note);
    setShowModal(true);
  };

  const togglePin = (id: number) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, isPinned: !note.isPinned } : note
      )
    );
  };

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

  const sortedNotes = [...notes].sort((a, b) =>
    a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Нотатки</h2>
      <Button
        variant="primary"
        onClick={() => setShowModal(true)}
        className="mb-4"
      >
        Додати нотатку
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedNotes.map((note) => (
          <div
            key={note.id}
            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                {getCategoryIcon(note.category)}
                <h5 className="ml-2 text-lg font-semibold">{note.title}</h5>
              </div>
              <Button
                variant="light"
                onClick={() => togglePin(note.id!)}
                className="ml-2"
              >
                <MdPushPin color={note.isPinned ? "#e9c46a" : "#4a2c2a"} />
              </Button>
            </div>
            <p className="mt-2 text-gray-600">{note.text}</p>
            <Button
              variant="link"
              onClick={() => handleEdit(note)}
              className="mt-2 text-blue-500"
            >
              Редагувати
            </Button>
          </div>
        ))}
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedNote ? "Редагувати нотатку" : "Додати нотатку"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Заголовок</Form.Label>
              <Form.Control
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Текст</Form.Label>
              <Form.Control
                as="textarea"
                value={formData.text}
                onChange={(e) =>
                  setFormData({ ...formData, text: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Категорія</Form.Label>
              <Form.Control
                as="select"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="">Оберіть категорію</option>
                <option value="Персонаж">Персонаж</option>
                <option value="Локація">Локація</option>
                <option value="Подія">Подія</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Теги</Form.Label>
              <Form.Control
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Пов’язана подія</Form.Label>
              <Form.Control
                value={formData.relatedEvent}
                onChange={(e) =>
                  setFormData({ ...formData, relatedEvent: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Закрити
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Зберегти
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NotesModule;
export type { Note };
