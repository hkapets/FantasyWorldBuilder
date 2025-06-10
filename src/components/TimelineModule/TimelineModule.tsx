import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import {
  MdMilitaryTech,
  MdPerson,
  MdDomain,
  MdDomainDisabled,
  MdOutlineAutoAwesome,
} from "react-icons/md";
import NotesModule from "../NotesModule/NotesModule";
import { Note } from "../NotesModule/NotesModule";

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
  onNoteSaved?: (note: Note) => void;
}

const TimelineModule = ({ onNoteSaved }: TimelineModuleProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Event>({
    id: 0,
    date: "",
    title: "",
    description: "",
    location: "",
    relatedCharacters: "",
    type: "",
  });

  const handleSave = () => {
    const newEvent = { ...formData, id: Date.now() };
    setEvents([...events, newEvent]);
    if (onNoteSaved)
      onNoteSaved({
        ...newEvent,
        text: newEvent.description,
        category: newEvent.type,
      } as Note);
    setShowModal(false);
    setFormData({
      id: 0,
      date: "",
      title: "",
      description: "",
      location: "",
      relatedCharacters: "",
      type: "",
    });
  };

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
    <div className="p-3 container mx-auto">
      <h2 className="display-6 fw-bold mb-3">Хронологія</h2>
      <Button
        variant="primary"
        onClick={() => setShowModal(true)}
        className="mb-3"
      >
        Додати подію
      </Button>
      <div className="position-relative">
        {events.map((event, index) => (
          <div
            key={event.id}
            className={`timeline-item ${
              index % 2 === 0 ? "text-start" : "text-end"
            } mb-4`}
          >
            <div className="timeline-date bg-secondary text-white p-2 rounded-circle text-center position-absolute top-0">
              {event.date}
            </div>
            <div className="timeline-content bg-light p-3 rounded shadow-sm ms-5 me-5">
              {getEventIcon(event.type)}
              <h5 className="fs-5 fw-semibold">{event.title}</h5>
              <p className="text-muted">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Додати подію</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Дата</Form.Label>
              <Form.Control
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </Form.Group>
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
              <Form.Label>Опис</Form.Label>
              <Form.Control
                as="textarea"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Локація</Form.Label>
              <Form.Control
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Пов’язані персонажі</Form.Label>
              <Form.Control
                value={formData.relatedCharacters}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    relatedCharacters: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Тип</Form.Label>
              <Form.Control
                as="select"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <option value="">Оберіть тип</option>
                <option value="Битва">Битва</option>
                <option value="Народження">Народження</option>
                <option value="Створення держав">Створення держав</option>
                <option value="Зникнення держав">Зникнення держав</option>
                <option value="Магічна подія">Магічна подія</option>
              </Form.Control>
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
      <NotesModule onEventSaved={onNoteSaved} />
    </div>
  );
};

export default TimelineModule;
