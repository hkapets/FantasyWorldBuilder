import React from "react";
import { Button } from "react-bootstrap";

interface World {
  id: number;
  name: string;
  createdAt: string; // Дата створення у форматі, сумісному з Date
  // Додайте інші поля, якщо потрібно (наприклад, description, details)
}

interface WorldCardProps {
  world: World;
  onEdit: (world: World) => void;
  onDelete: (world: World) => void;
  onSelect: (world: World) => void;
  isSelected: boolean;
}

const WorldCard: React.FC<WorldCardProps> = ({
  world,
  onEdit,
  onDelete,
  onSelect,
  isSelected,
}) => {
  return (
    <div
      className="card bg-dark text-white mb-3"
      style={{
        border: "1px solid #6b4e9a",
        borderRadius: "8px",
        maxWidth: "300px",
        transition: "transform 0.2s",
      }}
    >
      <div
        style={{ height: "150px", overflow: "hidden", background: "#4a2c5a" }}
      >
        <img
          src="/images/world-placeholder.jpg"
          alt={world.name}
          className="img-fluid"
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
      </div>
      <div className="p-3">
        <h5>{world.name}</h5>
        <p className="text-muted small">
          Створено: {new Date(world.createdAt).toLocaleDateString()}
        </p>
        <div className="d-flex justify-content-between mt-2">
          <Button
            variant={isSelected ? "success" : "primary"}
            onClick={() => onSelect(world)}
            style={{
              backgroundColor: isSelected ? "#28a745" : "#6b4e9a",
              border: "none",
              width: "48%",
            }}
          >
            {isSelected ? "Вибрано" : "Вибрати"}
          </Button>
          <Button
            variant="warning"
            onClick={() => onEdit(world)}
            style={{ backgroundColor: "#ffc107", border: "none", width: "48%" }}
          >
            Редагувати
          </Button>
        </div>
        <Button
          variant="danger"
          onClick={() => onDelete(world)}
          style={{
            backgroundColor: "#dc3545",
            border: "none",
            width: "100%",
            marginTop: "10px",
          }}
        >
          Видалити
        </Button>
      </div>
    </div>
  );
};

export default WorldCard;
