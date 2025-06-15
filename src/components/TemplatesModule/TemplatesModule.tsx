import React, { useState, useEffect } from "react";
import { Button, Form, Modal, Card, ListGroup } from "react-bootstrap";

interface Template {
  id: number;
  name: string;
  geography: string;
  races: string;
  magic: string;
}

interface TemplatesModuleProps {
  selectedWorldId?: number; // Додано проп для вибраного світу
  onWorldCreated?: (worldData: {
    id: number;
    name: string;
    details: string;
  }) => void;
}

const TemplatesModule: React.FC<TemplatesModuleProps> = ({
  selectedWorldId,
  onWorldCreated,
}) => {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: 1,
      name: "Фентезійний світ",
      geography: "Різноманітні континенти з лісами, горами та пустелями",
      races: "Люди, ельфи, гноми, орки",
      magic: "Елементальна магія (вогонь, вода, повітря, земля)",
    },
    {
      id: 2,
      name: "Науково-фантастичний світ",
      geography: "Планети з різними кліматами, космічні станції",
      races: "Люди, андроїди, інопланетяни",
      magic: "Технологічні здібності, кібермантія",
    },
    {
      id: 3,
      name: "Постапокаліптичний світ",
      geography: "Зруйновані міста, пустки, радіоактивні зони",
      races: "Мутанти, вижили люди, тварини-хижаки",
      magic: "Мутантські здібності, реліктові артефакти",
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [newWorldName, setNewWorldName] = useState("");
  const [customDetails, setCustomDetails] = useState("");
  const [isCreatingFromScratch, setIsCreatingFromScratch] = useState(false); // Новий стан для створення з нуля

  useEffect(() => {
    if (selectedWorldId !== undefined) {
      const savedTemplates = localStorage.getItem(
        `templates_${selectedWorldId}`
      );
      if (savedTemplates) {
        setTemplates(JSON.parse(savedTemplates));
      }
    }
  }, [selectedWorldId]);

  useEffect(() => {
    if (selectedWorldId !== undefined) {
      localStorage.setItem(
        `templates_${selectedWorldId}`,
        JSON.stringify(templates)
      );
    }
  }, [templates, selectedWorldId]);

  const handleCreateWorld = () => {
    if (selectedWorldId === undefined) {
      alert("Спочатку виберіть світ!");
      return;
    }
    if (!newWorldName.trim()) {
      alert("Введіть назву нового світу!");
      return;
    }
    const newWorldId = Date.now();
    const worldData = {
      id: newWorldId,
      name: newWorldName,
      details: isCreatingFromScratch
        ? customDetails
        : customDetails ||
          (selectedTemplate
            ? `${selectedTemplate.geography}, ${selectedTemplate.races}, ${selectedTemplate.magic}`
            : ""),
    };
    if (onWorldCreated) onWorldCreated(worldData);
    // Затримка для стабілізації перед закриттям
    setTimeout(() => {
      setShowModal(false);
      setNewWorldName("");
      setCustomDetails("");
      setSelectedTemplate(null);
      setIsCreatingFromScratch(false);
    }, 100); // Затримка 100мс для уникнення миттєвого закриття
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-dark">Шаблони</h2>
        <div>
          <Button
            variant="primary"
            onClick={() => {
              if (selectedWorldId !== undefined) {
                setIsCreatingFromScratch(true); // Активуємо створення з нуля
                setSelectedTemplate(null);
                setShowModal(true);
              }
            }}
            style={{
              backgroundColor: "#6b4e9a",
              border: "none",
              marginRight: "10px",
            }}
          >
            Створити світ з нуля
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowModal(true)} // Відкриваємо модалку для вибору шаблону
            style={{ backgroundColor: "#4a2c5a", border: "none" }}
          >
            Вибрати шаблон
          </Button>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-3 g-4">
        {templates.map((template) => (
          <div key={template.id} className="col">
            <Card
              style={{
                backgroundColor: "#f0f0f0",
                borderLeft: "4px solid #6b4e9a",
              }}
              className="h-100 shadow-sm"
            >
              <Card.Body>
                <Card.Title>{template.name}</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    Географія: {template.geography}
                  </ListGroup.Item>
                  <ListGroup.Item>Раси: {template.races}</ListGroup.Item>
                  <ListGroup.Item>Магія: {template.magic}</ListGroup.Item>
                </ListGroup>
                <Button
                  variant="primary"
                  onClick={() => {
                    if (selectedWorldId !== undefined) {
                      setSelectedTemplate(template);
                      setShowModal(true);
                    }
                  }}
                  className="mt-3"
                  style={{ backgroundColor: "#6b4e9a", border: "none" }}
                >
                  Створити світ
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {isCreatingFromScratch
              ? "Створення світу з нуля"
              : selectedTemplate
              ? `Створення світу на основі "${selectedTemplate.name}"`
              : "Створення світу"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Назва нового світу</Form.Label>
              <Form.Control
                type="text"
                value={newWorldName}
                onChange={(e) => setNewWorldName(e.target.value)}
                placeholder="Введіть назву світу"
                style={{
                  backgroundColor: "#4a2c5a",
                  color: "white",
                  border: "1px solid #6b4e9a",
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Додаткові деталі (опціонально)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={customDetails}
                onChange={(e) => setCustomDetails(e.target.value)}
                placeholder={
                  isCreatingFromScratch
                    ? "Опишіть світ"
                    : "Додайте власні деталі або відредагуйте шаблон"
                }
                style={{
                  backgroundColor: "#4a2c5a",
                  color: "white",
                  border: "1px solid #6b4e9a",
                }}
              />
              {!isCreatingFromScratch && selectedTemplate && (
                <p className="text-muted mt-2">
                  Шаблон: {selectedTemplate.geography}, {selectedTemplate.races}
                  , {selectedTemplate.magic}
                </p>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            style={{ backgroundColor: "#8b0000", border: "none" }}
          >
            Закрити
          </Button>
          <Button
            variant="primary"
            onClick={handleCreateWorld}
            style={{ backgroundColor: "#6b4e9a", border: "none" }}
          >
            Створити
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TemplatesModule;
