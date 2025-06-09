import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import {
  MdMilitaryTech,
  MdPerson,
  MdDomain,
  MdDomainDisabled,
  MdOutlineAutoAwesome,
} from "react-icons/md";
import NotesModule from "./NotesModule"; // Перевірений шлях

interface Event {
  id: number;
  date: string;
  title: string;
  description: string;
  location: string;
  relatedCharacters: string;
  type: string;
}

interface TimelineModuleProps {
  onNoteSaved?: (event: Event) => void;
}

const TimelineModule: React.FC<TimelineModuleProps> = ({ onNoteSaved }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<Event>({
    date: "",
    title: "",
    description: "",
    location: "",
    relatedCharacters: "",
    type: "",
    id: 0,
  });
  const [filterYear, setFilterYear] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");

  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem("events") || "[]");
    setEvents(savedEvents);
  }, []);

  const saveEvents = (updatedEvents: Event[]) => {
    setEvents(updatedEvents);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    if (updatedEvents.length > events.length && onNoteSaved) {
      const newEvent = updatedEvents[updatedEvents.length - 1];
      onNoteSaved({
        ...newEvent,
        id: newEvent.id,
        description: newEvent.description || "",
        location: newEvent.location || "",
      });
    }
  };

  const handleSave = () => {
    if (!/^\d+$/.test(formData.date)) {
      setValidationError("Дата має бути числовим значенням (наприклад, 1200)!");
      return;
    }
    setValidationError("");
    if (selectedEvent) {
      const updatedEvents = events.map((event) =>
        event.id === selectedEvent.id ? { ...formData, id: event.id } : event
      );
      saveEvents(updatedEvents);
    } else {
      const newEvent = { ...formData, id: Date.now() };
      saveEvents([...events, newEvent]);
    }
    setShowModal(false);
    setSelectedEvent(null);
    setFormData({
      date: "",
      title: "",
      description: "",
      location: "",
      relatedCharacters: "",
      type: "",
      id: 0,
    });
  };

  const handleDelete = (event: Event) => {
    if (window.confirm("Ви впевнені, що хочете видалити подію?")) {
      const updatedEvents = events.filter((e) => e.id !== event.id);
      saveEvents(updatedEvents);
    }
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setFormData(event);
    setShowModal(true);
  };

  const filteredEvents = events.filter((event) => {
    const yearMatch = !filterYear || event.date.includes(filterYear);
    const typeMatch =
      !filterType ||
      event.type.toLowerCase() === filterType.toLowerCase() ||
      (filterType === "Користувацький" &&
        ![
          "битва",
          "народження",
          "створення держав",
          "зникнення держав",
          "магічна подія",
        ].includes(event.type.toLowerCase()));
    return yearMatch && typeMatch;
  });

  const getEventIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "битва":
        return <MdMilitaryTech />;
      case "народження":
        return <MdPerson />;
      case "створення держав":
        return <MdDomain />;
      case "зникнення держав":
        return <MdDomainDisabled />;
      case "магічна подія":
        return <MdOutlineAutoAwesome />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4">
      <h2>Хронологія</h2>
      <Button
        variant="primary"
        onClick={() => setShowModal(true)}
        className="mb-3"
      >
        Додати подію
      </Button>
      <div className="mb-3 d-flex gap-3">
        <input
          type="text"
          className="form-control"
          placeholder="Фільтр за роком (наприклад, 1200)"
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
        />
        <Form.Select
          className="form-control"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">Всі типи</option>
          <option value="Битва">Битва</option>
          <option value="Народження">Народження</option>
          <option value="Створення держав">Створення держав</option>
          <option value="Зникнення держав">Зникнення держав</option>
          <option value="Магічна подія">Магічна подія</option>
          <option value="Користувацький">Користувацький</option>
        </Form.Select>
      </div>
      <div className="timeline">
        {filteredEvents.map((event, index) => (
          <div
            key={event.id}
            className={`timeline-item ${
              index % 2 === 0 ? "left" : "right"
            } fade-in`}
          >
            <div className="timeline-date">{event.date}</div>
            <div className="timeline-content">
              {getEventIcon(event.type)}
              <h5>{event.title}</h5>
              <p>{event.description.substring(0, 50)}...</p>
              <Button
                variant="warning"
                onClick={() => handleEdit(event)}
                className="me-2"
              >
                Редагувати
              </Button>
              <Button variant="danger" onClick={() => handleDelete(event)}>
                Видалити
              </Button>
              <Button
                variant="info"
                onClick={() => handleEdit(event)}
                className="ms-2"
              >
                Додати нотатку
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedEvent ? "Редагувати" : "Додати"} подію
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="mb-3">
              <Form.Label>Дата</Form.Label>
              <Form.Control
                type="text"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                placeholder="Рік (наприклад, 1200)"
                isInvalid={!!validationError}
              />
              <Form.Control.Feedback type="invalid">
                {validationError}
              </Form.Control.Feedback>
            </div>
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
              <Form.Label>Опис</Form.Label>
              <Form.Control
                as="textarea"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <Form.Label>Місце</Form.Label>
              <Form.Control
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </div>
            <div className="mb-3">
              <Form.Label>Пов’язані персонажі</Form.Label>
              <Form.Control
                type="text"
                value={formData.relatedCharacters}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    relatedCharacters: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-3">
              <Form.Label>Тип</Form.Label>
              <Form.Control
                as="select"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="form-control"
              >
                <option value="">Виберіть тип</option>
                <option value="Битва">Битва</option>
                <option value="Народження">Народження</option>
                <option value="Створення держав">Створення держав</option>
                <option value="Зникнення держав">Зникнення держав</option>
                <option value="Магічна подія">Магічна подія</option>
                <option value="Користувацький">Власний тип</option>
              </Form.Control>
              {formData.type === "Користувацький" && (
                <Form.Control
                  type="text"
                  placeholder="Введіть власний тип"
                  value={
                    formData.type === "Користувацький" ? "" : formData.type
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="form-control mt-2"
                />
              )}
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

      <NotesModule onEventSaved={onNoteSaved} />
    </div>
  );
};

export default TimelineModule;
