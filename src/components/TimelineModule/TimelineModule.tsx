import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import {
  MdMilitaryTech,
  MdPerson,
  MdDomain,
  MdDomainDisabled,
  MdOutlineAutoAwesome,
} from "react-icons/md";
import NotesModule from "./NotesModule"; // Перевір шлях імпорту

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

const TimelineModule = ({ onNoteSaved }: TimelineModuleProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  // Логіка useEffect і handleSave (додай свою реалізацію)

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

  // Визначення filteredEvents (приклад: показуємо всі події)
  const filteredEvents = [...events]; // Заміни на свою логіку фільтрації, якщо є

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
      <div className="timeline">
        {filteredEvents.map((event: Event, index: number) => (
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
            </div>
          </div>
        ))}
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        {/* Форма Modal */}
      </Modal>
      <NotesModule onEventSaved={onNoteSaved} />{" "}
      {/* Перевір, чи імпорт працює */}
    </div>
  );
};

export default TimelineModule;
