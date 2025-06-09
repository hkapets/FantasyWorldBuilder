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

const NotesModule: React.FC<NotesModuleProps> = ({ onEventSaved }) => {
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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    setNotes(savedNotes);
  }, []);

  useEffect(() => {
    if (autoSaveTimer) clearTimeout(autoSaveTimer);
    const timer = setTimeout(() => {
      if (selectedNote || formData.title) {
        const updatedNotes = [...notes, { ...formData, id: Date.now() }];
        saveNotes(updatedNotes);
        if (onEventSaved && !selectedNote) {
          onEventSaved({ ...formData, id: Date.now() });
        }
      }
    }, 5000);
    setAutoSaveTimer(timer);
    return () => clearTimeout(timer);
  }, [formData, notes, onEventSaved, selectedNote, autoSaveTimer]);

  const saveNotes = (updatedNotes: Note[]) => {
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  const handleSave = () => {
    if (!formData.title) return;
    const updatedNotes = selectedNote
      ? notes.map((note) =>
          note.id === selectedNote.id ? { ...formData, id: note.id } : note
        )
      : [...notes, { ...formData, id: Date.now() }];
    saveNotes(updatedNotes);
    setShowModal(false);
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
  };

  const handleDelete = (note: Note) => {
    if (window.confirm("Ви впевнені, що хочете видалити нотатку?")) {
      const updatedNotes = notes.filter((n) => n.id !== note.id);
      saveNotes(updatedNotes);
    }
  };

  const handleEdit = (note: Note) => {
    setSelectedNote(note);
    setFormData(note);
    setShowModal(true);
  };

  const togglePin = (note: Note) => {
    const updatedNotes = notes.map((n) =>
      n.id === note.id ? { ...n, isPinned: !n.isPinned } : n
    );
    saveNotes(updatedNotes);
  };

  const handleExport = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(notes));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "notes_backup.json");
    downloadAnchor.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const importedNotes = JSON.parse(e.target?.result as string);
        saveNotes([...notes, ...importedNotes]);
      };
      reader.readAsText(file);
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.dateCreated.includes(searchTerm)
  );

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return (
          new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
        );
      case "category":
        return a.category.localeCompare(b.category);
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

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
        <Button variant="secondary" onClick={handleExport}>
          Експорт
        </Button>
        <input
          type="file"
          accept=".json"
          onChange={handleImport}
          className="form-control-file"
        />
        <input
          type="text"
          className="form-control"
          placeholder="Пошук за ключовими словами, тегами або датою..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Form.Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="form-control"
        >
          <option value="date">За датою</option>
          <option value="category">За категорією</option>
          <option value="title">За назвою</option>
        </Form.Select>
      </div>
      <div className="notes-list">
        {sortedNotes.map((note) => (
          <div key={note.id} className="note-card fade-in">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                {getCategoryIcon(note.category)}
                <h5>{note.title}</h5>
              </div>
              <Button
                variant="light"
                onClick={() => togglePin(note)}
                className="ms-2"
              >
                <MdPushPin color={note.isPinned ? "#e9c46a" : "#4a2c2a"} />
              </Button>
            </div>
            <p>{note.text.substring(0, 50)}...</p>
            <span className="badge bg-secondary">{note.tags}</span>
            <div>
              <small>Дата: {note.dateCreated}</small>
              <Button
                variant="warning"
                onClick={() => handleEdit(note)}
                className="me-2 ms-2"
              >
                Редагувати
              </Button>
              <Button variant="danger" onClick={() => handleDelete(note)}>
                Видалити
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedNote ? "Редагувати" : "Додати"} нотатку
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="mb-3">
              <Form.Label>Назва</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <Form.Label>Текст</Form.Label>
              <Form.Control
                as="textarea"
                value={formData.text}
                onChange={(e) =>
                  setFormData({ ...formData, text: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <Form.Label>Категорія</Form.Label>
              <Form.Control
                as="select"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="form-control"
              >
                <option value="">Виберіть категорію</option>
                <option value="Персонаж">Персонаж</option>
                <option value="Локація">Локація</option>
                <option value="Подія">Подія</option>
              </Form.Control>
            </div>
            <div className="mb-3">
              <Form.Label>Теги (через кому)</Form.Label>
              <Form.Control
                type="text"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="Наприклад, #магія, #дракон"
              />
            </div>
            <div className="mb-3">
              <Form.Label>Дата створення</Form.Label>
              <Form.Control
                type="date"
                value={formData.dateCreated}
                onChange={(e) =>
                  setFormData({ ...formData, dateCreated: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <Form.Label>Пов’язана подія</Form.Label>
              <Form.Control
                type="text"
                value={formData.relatedEvent}
                onChange={(e) =>
                  setFormData({ ...formData, relatedEvent: e.target.value })
                }
                placeholder="Назва події"
              />
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Скасувати
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Зберегти
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default NotesModule; // Чіткий експорт
