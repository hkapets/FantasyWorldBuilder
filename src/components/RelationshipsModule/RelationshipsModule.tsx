import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";

interface Relationship {
  id: number | null; // Зроблено опціональним, щоб підтримувати null
  character1Id: number;
  character2Id: number;
  type: string; // Наприклад: "Friend", "Enemy", "Family"
  description: string;
}

interface RelationshipsModuleProps {
  selectedWorldId?: number; // Додано проп для вибраного світу
}

const RelationshipsModule: React.FC<RelationshipsModuleProps> = ({
  selectedWorldId,
}) => {
  const [relationships, setRelationships] = useState<Relationship[]>(() => {
    if (selectedWorldId !== undefined) {
      const savedRelationships = localStorage.getItem(
        `relationships_${selectedWorldId}`
      );
      return savedRelationships ? JSON.parse(savedRelationships) : [];
    }
    return [];
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedRelationship, setSelectedRelationship] =
    useState<Relationship | null>(null);
  const [formData, setFormData] = useState<Relationship>({
    id: null,
    character1Id: 0,
    character2Id: 0,
    type: "Friend",
    description: "",
  });

  useEffect(() => {
    if (selectedWorldId !== undefined) {
      localStorage.setItem(
        `relationships_${selectedWorldId}`,
        JSON.stringify(relationships)
      );
    }
  }, [relationships, selectedWorldId]);

  const handleSave = () => {
    if (selectedWorldId === undefined) {
      alert("Спочатку виберіть світ!");
      return;
    }
    const newRelationship = {
      ...formData,
      id: formData.id || Date.now(), // Якщо id є null, замінюємо на Date.now()
    };
    setRelationships((prev) =>
      selectedRelationship
        ? prev.map((r) =>
            r.id === selectedRelationship.id ? newRelationship : r
          )
        : [...prev, newRelationship]
    );
    setShowModal(false);
    setFormData({
      id: null,
      character1Id: 0,
      character2Id: 0,
      type: "Friend",
      description: "",
    });
    setSelectedRelationship(null);
  };

  const handleEdit = (relationship: Relationship) => {
    if (selectedWorldId !== undefined) {
      setSelectedRelationship(relationship);
      setFormData(relationship);
      setShowModal(true);
    }
  };

  const handleDelete = (id: number) => {
    if (selectedWorldId === undefined) return;
    if (window.confirm("Ви впевнені, що хочете видалити цей зв’язок?")) {
      setRelationships(
        (prev) => prev.filter((r) => r.id !== null && r.id === id) // Фільтруємо тільки записи з не-null id
      );
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-dark">Зв’язки</h2>
        <Button
          variant="primary"
          onClick={() => {
            if (selectedWorldId !== undefined) {
              setSelectedRelationship(null);
              setFormData({
                id: null,
                character1Id: 0,
                character2Id: 0,
                type: "Friend",
                description: "",
              });
              setShowModal(true);
            }
          }}
          style={{ backgroundColor: "#6b4e9a", border: "none" }}
        >
          Додати зв’язок
        </Button>
      </div>

      {relationships.length > 0 ? (
        <div className="row row-cols-1 g-3">
          {relationships.map((relationship) => (
            <div key={relationship.id || 0} className="col">
              <div
                className="card shadow-sm"
                style={{
                  backgroundColor: "#f0f0f0",
                  borderLeft: "4px solid #6b4e9a",
                }}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="card-title mb-1">
                        {`Персонаж ${relationship.character1Id} - ${relationship.type} - Персонаж ${relationship.character2Id}`}
                      </h5>
                      <p className="card-text text-muted">
                        {relationship.description}
                      </p>
                    </div>
                    <div>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(relationship)}
                      >
                        Редагувати
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(relationship.id || 0)}
                      >
                        Видалити
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted text-center">
          Немає зв’язків для відображення.
        </p>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedRelationship ? "Редагувати зв’язок" : "Додати зв’язок"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>ID першого персонажа</Form.Label>
              <Form.Control
                type="number"
                value={formData.character1Id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    character1Id: Number(e.target.value),
                  })
                }
                placeholder="Введіть ID першого персонажа"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>ID другого персонажа</Form.Label>
              <Form.Control
                type="number"
                value={formData.character2Id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    character2Id: Number(e.target.value),
                  })
                }
                placeholder="Введіть ID другого персонажа"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Тип зв’язку</Form.Label>
              <Form.Control
                as="select"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <option value="Friend">Друг</option>
                <option value="Enemy">Ворог</option>
                <option value="Family">Родина</option>
                <option value="Ally">Союзник</option>
                <option value="Rival">Суперник</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Опис</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Введіть опис зв’язку"
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

export default RelationshipsModule;
