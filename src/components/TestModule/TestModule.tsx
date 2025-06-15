import React, { useState, useEffect } from "react";
import { Alert, Card, ListGroup } from "react-bootstrap";

interface Note {
  id: number | null;
  title: string;
}

interface Relationship {
  id: number;
  character1Id: number;
  character2Id: number;
}

interface Map {
  id: number;
  name: string;
}

interface TestModuleProps {
  selectedWorldId?: number; // Додано проп для вибраного світу
  notes?: Note[];
  relationships?: Relationship[];
  maps?: Map[];
}

const TestModule: React.FC<TestModuleProps> = ({
  selectedWorldId,
  notes = [],
  relationships = [],
  maps = [],
}) => {
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    if (selectedWorldId === undefined) {
      setTestResults(["Світ не вибрано. Тестування неможливе."]);
      return;
    }

    const results: string[] = [];

    // Перевірка дублювання ID у нотатках
    const noteIds = new Set(notes.map((note) => note.id));
    if (noteIds.size < notes.length) {
      results.push("Помилка: Є дублювання ID у нотатках!");
    }

    // Перевірка дублювання ID у зв’язках
    const relationshipIds = new Set(relationships.map((rel) => rel.id));
    if (relationshipIds.size < relationships.length) {
      results.push("Помилка: Є дублювання ID у зв’язках!");
    }

    // Перевірка дублювання ID у картах
    const mapIds = new Set(maps.map((map) => map.id));
    if (mapIds.size < maps.length) {
      results.push("Помилка: Є дублювання ID у картах!");
    }

    // Перевірка на пусті значення
    if (notes.some((note) => !note.title.trim())) {
      results.push("Помилка: Є нотатки без заголовка!");
    }
    if (relationships.some((rel) => rel.character1Id === rel.character2Id)) {
      results.push(
        "Помилка: Зв’язки не можуть бути між одним і тим самим персонажем!"
      );
    }
    if (maps.some((map) => !map.name.trim())) {
      results.push("Помилка: Є карти без назви!");
    }

    setTestResults(
      results.length > 0 ? results : ["Ніяких помилок не виявлено."]
    );
  }, [selectedWorldId, notes, relationships, maps]);

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-dark">Тести</h2>
      </div>

      <Card
        style={{ backgroundColor: "#f0f0f0", borderLeft: "4px solid #6b4e9a" }}
        className="shadow-sm"
      >
        <Card.Body>
          <Card.Title>Результати тестування</Card.Title>
          <ListGroup variant="flush">
            {testResults.map((result, index) => (
              <ListGroup.Item
                key={index}
                className={
                  result.includes("Помилка")
                    ? "bg-danger text-white"
                    : "bg-success text-white"
                }
                style={{ border: "1px solid #6b4e9a" }}
              >
                {result}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TestModule;
