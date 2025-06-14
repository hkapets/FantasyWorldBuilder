import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import {
  MdMilitaryTech,
  MdPerson,
  MdDomain,
  MdDomainDisabled,
  MdOutlineAutoAwesome,
  MdDelete,
  MdEdit,
  MdRemoveCircle,
} from "react-icons/md";
import NotesModule, { Note, Event } from "../NotesModule/NotesModule";

interface TimelineModuleProps {
  onNoteSaved?: (note: Note) => void;
}

interface Timeline {
  id: number;
  events: Event[];
  name: string;
}

const TimelineModule = ({ onNoteSaved }: TimelineModuleProps) => {
  const [timelines, setTimelines] = useState<Timeline[]>(() => {
    const savedTimelines = localStorage.getItem("timelines");
    const initialTimelines = savedTimelines
      ? JSON.parse(savedTimelines)
      : [{ id: Date.now(), events: [], name: "Основна хронологія" }];
    console.log("Initial timelines:", initialTimelines);
    return initialTimelines;
  });
  const [selectedTimelineId, setSelectedTimelineId] = useState<number>(() => {
    const savedId = localStorage.getItem("selectedTimelineId");
    return savedId ? parseInt(savedId) : timelines[0]?.id || Date.now();
  });
  const [showEventModal, setShowEventModal] = useState(false);
  const [formData, setFormData] = useState<Event>({
    id: 0,
    date: "",
    title: "",
    description: "",
    location: "",
    relatedCharacters: "",
    type: "",
    era: "",
    age: "",
  });
  const [editEventId, setEditEventId] = useState<number | null>(null);
  const [newTimelineName, setNewTimelineName] = useState<string>("");
  const [scale, setScale] = useState<number>(1);
  const [filterType, setFilterType] = useState<string>("");

  const eventTypeColors: { [key: string]: string } = {
    Битва: "#ff6347",
    Народження: "#98fb98",
    "Створення держав": "#87ceeb",
    "Зникнення держав": "#dda0dd",
    "Магічна подія": "#ffa500",
    Користувацький: "#b19cd9",
  };

  useEffect(() => {
    console.log("Timelines updated:", timelines);
    localStorage.setItem("timelines", JSON.stringify(timelines));
    localStorage.setItem("selectedTimelineId", selectedTimelineId.toString());
  }, [timelines, selectedTimelineId]);

  const selectedTimeline =
    timelines.find((t) => t.id === selectedTimelineId) || timelines[0];

  const handleSaveOrEditEvent = () => {
    if (!formData.date.trim()) {
      alert("Будь ласка, введіть дату!");
      return;
    }
    const newEvent = { ...formData, id: editEventId || Date.now() };
    console.log("Зберігається подія:", newEvent);
    setTimelines(
      timelines.map((t) =>
        t.id === selectedTimelineId
          ? {
              ...t,
              events: editEventId
                ? t.events.map((e) => (e.id === editEventId ? newEvent : e))
                : [...t.events, newEvent],
            }
          : t
      )
    );
    setShowEventModal(false);
    setFormData({
      id: 0,
      date: "",
      title: "",
      description: "",
      location: "",
      relatedCharacters: "",
      type: "",
      era: "",
      age: "",
    });
    setEditEventId(null);
  };

  const handleEditEvent = (event: Event) => {
    setEditEventId(event.id);
    setFormData(event);
    setShowEventModal(true);
  };

  const handleDeleteEvent = (eventId: number) => {
    if (window.confirm("Ви впевнені, що хочете видалити цю подію?")) {
      setTimelines(
        timelines.map((t) =>
          t.id === selectedTimelineId
            ? { ...t, events: t.events.filter((e) => e.id !== eventId) }
            : t
        )
      );
    }
  };

  const handleAddTimeline = () => {
    if (newTimelineName.trim()) {
      const newTimeline = { id: Date.now(), events: [], name: newTimelineName };
      setTimelines([...timelines, newTimeline]);
      setSelectedTimelineId(newTimeline.id);
      setNewTimelineName("");
    }
  };

  const handleDeleteTimeline = (timelineId: number) => {
    if (window.confirm("Ви впевнені, що хочете видалити цю хронологію?")) {
      const newTimelines = timelines.filter((t) => t.id !== timelineId);
      setTimelines(newTimelines);
      setSelectedTimelineId(newTimelines[0]?.id || Date.now());
    }
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

  const getPositionBasedOnDate = (
    date: string,
    minDate: number,
    maxDate: number
  ) => {
    const eventDate = Math.max(1, parseInt(date, 10) || 1);
    const range = Math.max(1, maxDate - 1);
    const basePosition =
      eventDate === 1 ? 0.5 : Math.round(((eventDate - 1) / range) * 99) + 0.5;
    return Math.min(basePosition, 99.5);
  };

  const dates = selectedTimeline.events.map(
    (event) => parseInt(event.date, 10) || 1
  );
  const minDate = Math.min(...dates, 1);
  const maxDate = Math.max(...dates);
  const dynamicWidth = Math.max(1200, (maxDate - minDate + 1) * 80);

  const sortedEvents = [...selectedTimeline.events].sort(
    (a, b) => parseInt(a.date, 10) - parseInt(b.date, 10)
  );

  const uniqueEventTypes = Array.from(
    new Set(selectedTimeline.events.map((event) => event.type))
  );

  const filteredEvents = filterType
    ? sortedEvents.filter(
        (event) => event.type.toLowerCase() === filterType.toLowerCase()
      )
    : sortedEvents;

  return (
    <div
      className="p-3 container mx-auto"
      style={{ fontFamily: "MedievalSharp, serif" }}
    >
      <h2
        className="display-6 fw-bold mb-3 text-white"
        style={{
          backgroundColor: "#2c1e3a",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        Хронологія
      </h2>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center">
          <Form.Control
            as="select"
            value={selectedTimelineId}
            onChange={(e) => setSelectedTimelineId(Number(e.target.value))}
            className="me-2"
            style={{
              width: "200px",
              backgroundColor: "#4a2c5a",
              color: "white",
              border: "1px solid #6b4e9a",
            }}
          >
            {timelines.map((timeline) => (
              <option
                key={timeline.id}
                value={timeline.id}
                style={{ backgroundColor: "#4a2c5a", color: "white" }}
              >
                {timeline.name}
              </option>
            ))}
          </Form.Control>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDeleteTimeline(selectedTimelineId)}
            className="me-2"
            style={{ backgroundColor: "#8b0000", border: "none" }}
          >
            <MdRemoveCircle />
          </Button>
          <Form.Control
            type="text"
            value={newTimelineName}
            onChange={(e) => setNewTimelineName(e.target.value)}
            placeholder="Назва нової хронології"
            className="me-2"
            style={{
              width: "200px",
              backgroundColor: "#4a2c5a",
              color: "white",
              border: "1px solid #6b4e9a",
            }}
          />
          <Button
            variant="success"
            onClick={handleAddTimeline}
            className="ms-2"
            disabled={!newTimelineName.trim()}
            style={{ backgroundColor: "#006400", border: "none" }}
          >
            Додати хронологію
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setEditEventId(null);
              setShowEventModal(true);
            }}
            className="ms-2"
            style={{ backgroundColor: "#6b4e9a", border: "none" }}
          >
            Додати подію
          </Button>
        </div>
        <Form.Range
          value={scale}
          onChange={(e) => setScale(Number(e.target.value))}
          min="0.5"
          max="2"
          step="0.1"
          className="w-25"
          style={{ backgroundColor: "#4a2c5a", border: "1px solid #6b4e9a" }}
        />
      </div>
      <div className="mb-3">
        <Form.Group>
          <Form.Control
            as="select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              minWidth: "200px",
              backgroundColor: "#4a2c5a",
              color: "white",
              border: "1px solid #6b4e9a",
            }}
          >
            <option value="">Всі типи</option>
            {uniqueEventTypes.map((type) => (
              <option
                key={type}
                value={type}
                style={{ backgroundColor: "#4a2c5a", color: "white" }}
              >
                {type}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <NotesModule events={filteredEvents} onNoteSaved={onNoteSaved} />
      </div>

      {/* ОСНОВНА ХРОНОЛОГІЯ */}
      <div
        className="timeline-container"
        style={{
          height: "600px",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          backgroundColor: "#2c1e3a",
          border: "2px solid #6b4e9a",
          borderRadius: "5px",
          overflowX: "auto",
          overflowY: "hidden",
          minWidth: `${dynamicWidth}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {/* Горизонтальна лінія по центру */}
        <div
          className="timeline-line"
          style={{
            position: "absolute",
            top: "50%",
            left: "0",
            right: "0",
            height: "4px",
            backgroundColor: "#6b4e9a",
            transform: "translateY(-50%)",
            zIndex: 1,
          }}
        />

        {/* Події */}
        {filteredEvents.map((event, index) => {
          const eventDate = parseInt(event.date, 10) || 1;
          const position = getPositionBasedOnDate(event.date, minDate, maxDate);
          const isOdd = eventDate % 2 === 1;
          const eventColor =
            eventTypeColors[event.type] || eventTypeColors["Користувацький"];

          console.log(
            `Подія ${event.date}: ${
              isOdd ? "над лінією" : "під лінією"
            } at ${position}%`
          );

          return (
            <div
              key={event.id}
              className="timeline-event"
              style={{
                position: "absolute",
                left: `${position}%`,
                top: "50%",
                transform: "translateX(-50%)",
                zIndex: 2,
              }}
            >
              {/* Вертикальний конектор */}
              <div
                className="timeline-connector"
                style={{
                  position: "absolute",
                  left: "50%",
                  top: isOdd ? "-100px" : "2px",
                  width: "3px",
                  height: "100px",
                  backgroundColor: eventColor,
                  transform: "translateX(-50%)",
                  zIndex: 1,
                }}
              />

              {/* Картка з подією */}
              <div
                className="timeline-event-card"
                onClick={() => handleEditEvent(event)}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: isOdd ? "-150px" : "52px",
                  transform: "translateX(-50%)",
                  padding: "12px 20px",
                  backgroundColor: eventColor,
                  color: "white",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                  minWidth: "180px",
                  textAlign: "center",
                  cursor: "pointer",
                  border: `2px solid ${eventColor}`,
                  transition: "all 0.3s ease",
                  zIndex: 3,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateX(-50%) scale(1.05)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(0, 0, 0, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateX(-50%) scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0, 0, 0, 0.3)";
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    marginBottom: "4px",
                  }}
                >
                  {event.date}
                </div>
                <div style={{ fontSize: "12px", lineHeight: "1.3" }}>
                  {event.title}
                </div>

                {/* Кнопка видалення */}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteEvent(event.id);
                  }}
                  style={{
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    backgroundColor: "#dc3545",
                    border: "none",
                    padding: "2px 6px",
                    fontSize: "10px",
                    borderRadius: "3px",
                    zIndex: 4,
                  }}
                >
                  <MdDelete />
                </Button>
              </div>

              {/* Точка на лінії */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "-4px",
                  width: "8px",
                  height: "8px",
                  backgroundColor: eventColor,
                  borderRadius: "50%",
                  transform: "translateX(-50%)",
                  border: "2px solid #ffffff",
                  zIndex: 2,
                }}
              />
            </div>
          );
        })}
      </div>

      {/* МОДАЛЬНЕ ВІКНО ДЛЯ ПОДІЙ */}
      <Modal
        show={showEventModal}
        onHide={() => {
          setShowEventModal(false);
          setEditEventId(null);
        }}
        style={{ backgroundColor: "#2c1e3a" }}
      >
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#4a2c5a", color: "white" }}
        >
          <Modal.Title>
            {editEventId ? "Редагувати подію" : "Додати подію"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#2c1e3a", color: "white" }}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Дата (довільна, обов’язково)*</Form.Label>
              <Form.Control
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
                style={{
                  backgroundColor: "#4a2c5a",
                  color: "white",
                  border: "1px solid #6b4e9a",
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ера (опціонально)</Form.Label>
              <Form.Control
                value={formData.era}
                onChange={(e) =>
                  setFormData({ ...formData, era: e.target.value })
                }
                style={{
                  backgroundColor: "#4a2c5a",
                  color: "white",
                  border: "1px solid #6b4e9a",
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Вік (опціонально)</Form.Label>
              <Form.Control
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                style={{
                  backgroundColor: "#4a2c5a",
                  color: "white",
                  border: "1px solid #6b4e9a",
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Заголовок</Form.Label>
              <Form.Control
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                style={{
                  backgroundColor: "#4a2c5a",
                  color: "white",
                  border: "1px solid #6b4e9a",
                }}
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
                style={{
                  backgroundColor: "#4a2c5a",
                  color: "white",
                  border: "1px solid #6b4e9a",
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Локація</Form.Label>
              <Form.Control
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                style={{
                  backgroundColor: "#4a2c5a",
                  color: "white",
                  border: "1px solid #6b4e9a",
                }}
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
                style={{
                  backgroundColor: "#4a2c5a",
                  color: "white",
                  border: "1px solid #6b4e9a",
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Тип</Form.Label>
              <Form.Control
                type="text"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                placeholder="Введіть тип або виберіть із списку"
                style={{
                  backgroundColor: "#4a2c5a",
                  color: "white",
                  border: "1px solid #6b4e9a",
                }}
              />
              <Form.Control
                as="select"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                style={{
                  backgroundColor: "#4a2c5a",
                  color: "white",
                  border: "1px solid #6b4e9a",
                  marginTop: "5px",
                }}
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
        <Modal.Footer style={{ backgroundColor: "#4a2c5a" }}>
          <Button
            variant="secondary"
            onClick={() => {
              setShowEventModal(false);
              setEditEventId(null);
            }}
            style={{ backgroundColor: "#8b0000", border: "none" }}
          >
            Закрити
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveOrEditEvent}
            style={{ backgroundColor: "#6b4e9a", border: "none" }}
          >
            {editEventId ? "Зберегти зміни" : "Зберегти"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TimelineModule;
