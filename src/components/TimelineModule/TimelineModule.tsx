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
import { List } from "react-virtualized";
import NotesModule, { Note, Event } from "../NotesModule/NotesModule";
import "react-virtualized/styles.css"; // Стилі для react-virtualized

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
  const [showModal, setShowModal] = useState(false);
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
  const [filterCategory, setFilterCategory] = useState<string>("");

  useEffect(() => {
    console.log("Timelines updated:", timelines);
    localStorage.setItem("timelines", JSON.stringify(timelines));
    localStorage.setItem("selectedTimelineId", selectedTimelineId.toString());
  }, [timelines, selectedTimelineId]);

  const selectedTimeline =
    timelines.find((t) => t.id === selectedTimelineId) || timelines[0];

  const handleSaveOrEdit = () => {
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
    setShowModal(false);
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
    setShowModal(true);
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

  // Обчислення позиції для кожної події
  const getPositionBasedOnDate = (
    date: string,
    minDate: number,
    maxDate: number,
    totalEvents: number
  ) => {
    const eventDate = Math.max(1, parseInt(date, 10) || 1);
    const range = Math.max(1, maxDate - minDate);
    const basePosition = ((eventDate - minDate) / range) * 95; // Розподіл по 95% простору
    return basePosition;
  };

  const dates = selectedTimeline.events.map(
    (event) => parseInt(event.date, 10) || 1
  );
  const minDate = Math.min(...dates, 1);
  const maxDate = Math.max(...dates);
  const dynamicWidth = Math.max(1500, (maxDate - minDate + 1) * 20);

  // Конфігурація для react-virtualized List
  const listRef = useRef<List>(null);
  const rowRenderer = ({
    index,
    key,
    style,
  }: {
    index: number;
    key: string;
    style: React.CSSProperties;
  }) => {
    const event = selectedTimeline.events[index];
    const position = getPositionBasedOnDate(
      event.date,
      minDate,
      maxDate,
      selectedTimeline.events.length
    );
    console.log(
      `Rendering event ${index}: ${event.date} - ${event.title} at ${position}%`
    );

    return (
      <div
        key={key}
        style={{
          ...style,
          position: "absolute",
          left: `${position}%`,
          top: 0,
          height: "100%",
          width: `${100 / selectedTimeline.events.length}%`, // Ширина пропорційна кількості подій
          border: "1px solid red", // Тимчасова рамка для діагностики
          zIndex: 2,
        }}
      >
        <div
          className="position-relative"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className="timeline-connector"
            style={{
              position: "absolute",
              width: "2px",
              height: "150px",
              backgroundColor: "#6b4e9a",
              top: index % 2 === 0 ? "-150px" : "0",
              left: "0",
              transform: "translateX(-50%)",
              zIndex: 0,
            }}
          />
          <div
            className="timeline-data position-relative"
            onClick={() => handleEditEvent(event)}
            style={{
              padding: "15px 25px",
              fontSize: "18px",
              backgroundColor: index % 2 === 0 ? "#4a2c5a" : "#6b4e9a",
              color: "white",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
              top: index % 2 === 0 ? "-100px" : "40px", // Скорочено top для видимості
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              whiteSpace: "normal",
              minWidth: "150px",
              zIndex: 3,
            }}
          >
            {event.date} - {event.title}
            <Button
              variant="danger"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteEvent(event.id);
              }}
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                backgroundColor: "#8b0000",
                border: "none",
                zIndex: 4,
              }}
            >
              <MdDelete />
            </Button>
          </div>
        </div>
      </div>
    );
  };

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
              setShowModal(true);
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
        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
          className="mb-3"
          style={{ backgroundColor: "#6b4e9a", border: "none" }}
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
            style={{
              minWidth: "200px",
              backgroundColor: "#4a2c5a",
              color: "white",
              border: "1px solid #6b4e9a",
            }}
          />
        </Form.Group>
        <NotesModule
          events={selectedTimeline.events}
          onNoteSaved={onNoteSaved}
          filterCategory={filterCategory}
        />
      </div>
      <div
        className="timeline position-relative"
        style={{
          height: "500px",
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          backgroundColor: "#2c1e3a",
          border: "2px solid #6b4e9a",
          borderRadius: "5px",
          overflowX: "auto",
          overflowY: "hidden",
          whiteSpace: "nowrap",
          minWidth: `${dynamicWidth}px`,
          maxWidth: "100%",
          position: "relative",
        }}
      >
        <div
          className="timeline-line position-absolute top-50 start-0"
          style={{
            height: "4px",
            backgroundColor: "#6b4e9a",
            transform: "translateY(-50%)",
            width: `${dynamicWidth}px`,
            zIndex: 1,
          }}
        />
        <List
          ref={listRef}
          width={dynamicWidth}
          height={500}
          rowCount={selectedTimeline.events.length}
          rowHeight={500} // Змінено на висоту контейнера для горизонтального відображення
          rowRenderer={rowRenderer}
          style={{ position: "relative", top: 0, left: 0, width: "100%" }}
          overscanRowCount={10}
          horizontal={true}
        />
      </div>
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
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
                as="select"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                style={{
                  backgroundColor: "#4a2c5a",
                  color: "white",
                  border: "1px solid #6b4e9a",
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
              setShowModal(false);
              setEditEventId(null);
            }}
            style={{ backgroundColor: "#8b0000", border: "none" }}
          >
            Закрити
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveOrEdit}
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
