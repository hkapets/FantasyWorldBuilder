import React from "react";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import {
  FaClock,
  FaStickyNote,
  FaBook,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";
import { WorldData } from "../types";

interface HomeProps {
  world: WorldData;
}

const Home: React.FC<HomeProps> = ({ world }) => {
  const getRecentEvents = () => {
    return world.events
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  };

  const getRecentNotes = () => {
    return world.notes
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  };

  const getStatistics = () => {
    return {
      totalEvents: world.events.length,
      totalNotes: world.notes.length,
      totalLore: world.lore.length,
      totalCharacters: world.characters.length,
      highImportanceEvents: world.events.filter((e) => e.importance === "high")
        .length,
      categoriesUsed: new Set([
        ...world.events.map((e) => e.category),
        ...world.notes.map((n) => n.category),
      ]).size,
    };
  };

  const stats = getStatistics();
  const recentEvents = getRecentEvents();
  const recentNotes = getRecentNotes();

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="display-4 text-center mb-4">
            🏰 Ласкаво просимо до вашого фентезійного світу!
          </h1>
          <p className="lead text-center text-muted">
            Створюйте, досліджуйте та розвивайте свій унікальний світ
          </p>
        </Col>
      </Row>

      {/* Статистика */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <FaClock className="fs-1 text-primary mb-2" />
              <Card.Title>{stats.totalEvents}</Card.Title>
              <Card.Text className="text-muted">Подій в хронології</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <FaStickyNote className="fs-1 text-success mb-2" />
              <Card.Title>{stats.totalNotes}</Card.Title>
              <Card.Text className="text-muted">Нотаток</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <FaUsers className="fs-1 text-warning mb-2" />
              <Card.Title>{stats.totalCharacters}</Card.Title>
              <Card.Text className="text-muted">Персонажів</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 shadow-sm">
            <Card.Body>
              <FaChartLine className="fs-1 text-info mb-2" />
              <Card.Title>{stats.highImportanceEvents}</Card.Title>
              <Card.Text className="text-muted">Важливих подій</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Останні події */}
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <FaClock className="me-2" />
              Останні події
            </Card.Header>
            <Card.Body>
              {recentEvents.length > 0 ? (
                recentEvents.map((event) => (
                  <div key={event.id} className="border-bottom py-2">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1">{event.title}</h6>
                        <p className="mb-1 text-muted small">
                          {event.description}
                        </p>
                        <small className="text-muted">{event.date}</small>
                      </div>
                      <Badge
                        bg={
                          event.importance === "high"
                            ? "danger"
                            : event.importance === "medium"
                            ? "warning"
                            : "secondary"
                        }
                      >
                        {event.importance === "high"
                          ? "Висока"
                          : event.importance === "medium"
                          ? "Середня"
                          : "Низька"}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted">
                  Поки що немає подій. Почніть створювати свою хронологію!
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Останні нотатки */}
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-success text-white">
              <FaStickyNote className="me-2" />
              Останні нотатки
            </Card.Header>
            <Card.Body>
              {recentNotes.length > 0 ? (
                recentNotes.map((note) => (
                  <div key={note.id} className="border-bottom py-2">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1">{note.title}</h6>
                        <p className="mb-1 text-muted small">
                          {note.content.length > 100
                            ? note.content.substring(0, 100) + "..."
                            : note.content}
                        </p>
                        <small className="text-muted">
                          Категорія: {note.category}
                        </small>
                      </div>
                      {note.linkedEvents.length > 0 && (
                        <Badge bg="info">
                          {note.linkedEvents.length} зв'язків
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted">
                  Поки що немає нотаток. Почніть записувати свої ідеї!
                </p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Швидкі поради */}
      <Row className="mt-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-info text-white">
              <FaBook className="me-2" />
              Поради для створення світу
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <h6>🗓️ Хронологія</h6>
                  <p className="small text-muted">
                    Створюйте події у хронологічному порядку. Використовуйте
                    різні рівні важливості для кращої організації.
                  </p>
                </Col>
                <Col md={4}>
                  <h6>📝 Нотатки</h6>
                  <p className="small text-muted">
                    Зв'язуйте нотатки з подіями для створення цілісної картини
                    вашого світу. Використовуйте теги для групування.
                  </p>
                </Col>
                <Col md={4}>
                  <h6>🎭 Персонажі</h6>
                  <p className="small text-muted">
                    Розробляйте персонажів з детальною історією та зв'язками з
                    подіями світу.
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
