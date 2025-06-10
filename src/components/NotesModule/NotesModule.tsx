import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import {
  MdNote,
  MdPersonOutline,
  MdLandscape,
  MdHistory,
  MdPushPin,
  MdDomain,
  MdMilitaryTech,
  MdDelete,
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
  const [error, setError] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("");

  const handleSave = () => {
    if (!formData.category.trim()) {
      setError("Категорія є обов'язковою!");
      return;
    }
    setError("");
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

  const handleDelete = (id: number) => {
    if (window.confirm("Ви впевнені, що хочете видалити цю нотатку?")) {
      setNotes(notes.filter((note) => note.id !== id));
    }
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
      case "організація":
        return <MdDomain />;
      case "міфологія":
        return <MdNote />;
      case "предмет":
        return <MdPushPin />;
      case "конфлікт":
        return <MdMilitaryTech />;
      default:
        return <MdNote />;
    }
  };

  const filteredNotes = filterCategory
    ? notes.filter((note) =>
        note.category.toLowerCase().includes(filterCategory.toLowerCase())
      )
    : notes;
  const sortedNotes = [...filteredNotes].sort((a, b) =>
    a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1
  );

  return (
    <div className="p-3 container mx-auto">
      <h2 className="display-6 fw-bold mb-3">Нотатки</h2>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
          className="mb-3"
        >
          Додати нотатку
        </Button>
        <Form.Group>
          <Form.Control
            type="text"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            placeholder="Фільтр за категорією"
            className="w-50 p-2 bg-light text-dark border border-secondary"
            style={{ minWidth: "200px" }} // Додано мінімальну ширину
          />
        </Form.Group>
      </div>
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {sortedNotes.map((note) => (
          <div
            key={note.id}
            className="bg-light p-3 rounded shadow-sm hover-shadow-lg transition-shadow"
          >
            <div className="d-flex justify-content-between align-items-start">
              <div className="d-flex align-items-center">
                {getCategoryIcon(note.category)}
                <h5 className="ms-2 fs-5 fw-semibold">{note.title}</h5>
              </div>
              <div>
                <Button
                  variant="light"
                  onClick={() => togglePin(note.id!)}
                  className="me-2"
                >
                  <MdPushPin color={note.isPinned ? "#e9c46a" : "#4a2c2a"} />
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(note.id!)}
                  className="ms-2"
                >
                  <MdDelete />
                </Button>
              </div>
            </div>
            <p className="mt-2 text-muted">{note.text}</p>
            <Button
              variant="link"
              onClick={() => handleEdit(note)}
              className="mt-2 text-primary"
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
                type="text"
                list="categoryOptions"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="Введіть або виберіть категорію"
                isInvalid={!!error}
              />
              <datalist id="categoryOptions">
                <option value="Персонаж" />
                <option value="Локація" />
                <option value="Подія" />
                <option value="Організація" />
                <option value="Міфологія" />
                <option value="Предмет" />
                <option value="Конфлікт" />
              </datalist>
              <Form.Control.Feedback type="invalid">
                {error}
              </Form.Control.Feedback>
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
