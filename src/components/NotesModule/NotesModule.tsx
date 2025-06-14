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
  relatedEvent: string | number;
  isPinned: boolean;
  date?: string;
  description?: string;
  location?: string;
  relatedCharacters?: string;
  type?: string;
}

interface Event {
  id: number;
  date: string;
  title: string;
  description: string;
  location: string;
  relatedCharacters: string;
  type: string;
  era?: string;
  age?: string;
}

interface NotesModuleProps {
  events?: Event[];
  onNoteSaved?: (note: Note) => void;
  filterType?: string;
  externalNotes?: Note[];
  onNoteDeleted?: (noteId: number) => void;
  onNoteUpdated?: (note: Note) => void;
}

const NotesModule = ({
  events = [],
  onNoteSaved,
  filterType,
  externalNotes = [],
  onNoteDeleted,
  onNoteUpdated,
}: NotesModuleProps) => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
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

  // Синхронізація з зовнішніми нотатками
  useEffect(() => {
    if (externalNotes.length > 0) {
      setNotes((prevNotes) => {
        const existingIds = new Set(prevNotes.map((note) => note.id));
        const newNotes = externalNotes.filter(
          (note) => !existingIds.has(note.id)
        );
        const updatedNotes = [...prevNotes, ...newNotes];
        localStorage.setItem("notes", JSON.stringify(updatedNotes));
        return updatedNotes;
      });
    }
  }, [externalNotes]);

  useEffect(() => {
    console.log("Events received in NotesModule:", events);
    localStorage.setItem("notes", JSON.stringify(notes));
    console.log("Notes rendered:", notes);
  }, [notes, events]);

  const handleSave = () => {
    if (!formData.category.trim()) {
      setError("Категорія є обов'язковою!");
      return;
    }
    setError("");

    const newNote = {
      ...formData,
      id: selectedNote ? selectedNote.id : Date.now(),
    };

    console.log("Saving note:", newNote);

    setNotes((prevNotes) => {
      const updatedNotes = selectedNote
        ? prevNotes.map((note) =>
            note.id === selectedNote.id ? newNote : note
          )
        : [...prevNotes, newNote];
      console.log("Current notes after update:", updatedNotes);
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
      return updatedNotes;
    });

    if (onNoteSaved) onNoteSaved(newNote);
    if (selectedNote && onNoteUpdated) onNoteUpdated(newNote);

    setShowModal(false);
    setFormData({
      id: null,
      title: "",
      text: "",
      category: "",
      tags: "",
      dateCreated: new Date().toISOString().split("T")[0],
      relatedEvent: "",
      isPinned: false,
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
      const updatedNotes = notes.filter((note) => note.id !== id);
      setNotes(updatedNotes);
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
      if (onNoteDeleted) onNoteDeleted(id);
    }
  };

  const togglePin = (id: number) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, isPinned: !note.isPinned } : note
    );
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));

    const updatedNote = updatedNotes.find((note) => note.id === id);
    if (updatedNote && onNoteUpdated) onNoteUpdated(updatedNote);
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

  // Об'єднання всіх нотаток для відображення
  const allNotes = [...notes];

  const filteredNotes = filterType
    ? allNotes.filter((note) => {
        const relatedEventId = Number(note.relatedEvent);
        const event = events?.find((e) => e.id === relatedEventId);
        return event
          ? event.type.toLowerCase() === filterType.toLowerCase()
          : false;
      })
    : allNotes;

  const sortedNotes = [...filteredNotes].sort((a, b) =>
    a.isPinned === b.isPinned ? 0 : a.isPinned ? -1 : 1
  );

  return (
    <div className="p-3 container mx-auto">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="text-dark">Нотатки</h3>
        <Button
          variant="primary"
          onClick={() => {
            setSelectedNote(null);
            setFormData({
              id: null,
              title: "",
              text: "",
              category: "",
              tags: "",
              dateCreated: new Date().toISOString().split("T")[0],
              relatedEvent: "",
              isPinned: false,
            });
            setShowModal(true);
          }}
          style={{ backgroundColor: "#6b4e9a", border: "none" }}
        >
          Додати нотатку
        </Button>
      </div>

      <div className="row row-cols-1 row-cols-md-2 g-4">
        {sortedNotes.length > 0 ? (
          sortedNotes.map((note) => (
            <div key={note.id} className="col">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="d-flex align-items-center">
                      {getCategoryIcon(note.category)}
                      <h5 className="ms-2 fs-5 fw-semibold mb-0">
                        {note.title}
                      </h5>
                    </div>
                    <div>
                      <Button
                        variant="light"
                        size="sm"
                        onClick={() => togglePin(note.id!)}
                        className="me-2"
                      >
                        <MdPushPin
                          color={note.isPinned ? "#e9c46a" : "#6c757d"}
                        />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(note.id!)}
                      >
                        <MdDelete />
                      </Button>
                    </div>
                  </div>
                  <p className="card-text text-muted">{note.text}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      Категорія: {note.category}
                    </small>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEdit(note)}
                    >
                      Редагувати
                    </Button>
                  </div>
                  {note.tags && (
                    <div className="mt-2">
                      <small className="text-muted">Теги: {note.tags}</small>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p className="text-muted text-center">
              Немає нотаток для відображення.
            </p>
          </div>
        )}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
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
                placeholder="Введіть заголовок нотатки"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Текст</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={formData.text}
                onChange={(e) =>
                  setFormData({ ...formData, text: e.target.value })
                }
                placeholder="Введіть текст нотатки"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Категорія *</Form.Label>
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
              <Form.Label>Пов'язана подія</Form.Label>
              <Form.Control
                as="select"
                value={formData.relatedEvent}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    relatedEvent: Number(e.target.value) || "",
                  })
                }
              >
                <option value="">Оберіть подію</option>
                {events?.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title} ({event.date})
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Теги</Form.Label>
              <Form.Control
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="Введіть теги через кому"
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
export type { Note, Event };
