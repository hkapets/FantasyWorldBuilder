import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface Character {
  id: number;
  portrait: string;
  name: string;
  race: string;
  age: string;
  birthPlace: string;
  gender: string;
  status: string;
  family: string;
  classOccupation: string;
  description: string;
  tags?: string[];
}

const CharactersModule: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const [formData, setFormData] = useState<Character>({
    id: Date.now(),
    portrait: "/images/default-silhouette.png",
    name: "",
    race: "",
    age: "",
    birthPlace: "",
    gender: "",
    status: "",
    family: "",
    classOccupation: "",
    description: "",
    tags: [],
  });
  const [filterRace, setFilterRace] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name");

  // Завантаження з localStorage
  useEffect(() => {
    const savedCharacters = JSON.parse(
      localStorage.getItem("characters") || "[]"
    );
    setCharacters(savedCharacters);
  }, []);

  // Дебounced збереження в localStorage
  const saveCharacters = useCallback((updatedCharacters: Character[]) => {
    const debounce = setTimeout(() => {
      setCharacters(updatedCharacters);
      localStorage.setItem("characters", JSON.stringify(updatedCharacters));
    }, 300);
    return () => clearTimeout(debounce);
  }, []);

  // Додавання/редагування персонажа
  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("Ім'я є обов'язковим полем!");
      return;
    }
    if (selectedCharacter) {
      const updatedCharacters = characters.map((char) =>
        char.id === selectedCharacter.id ? { ...formData, id: char.id } : char
      );
      saveCharacters(updatedCharacters);
    } else {
      const newCharacter = { ...formData, id: Date.now() };
      saveCharacters([...characters, newCharacter]);
    }
    setShowModal(false);
    setSelectedCharacter(null);
    setFormData({
      id: Date.now(),
      portrait: "/images/default-silhouette.png",
      name: "",
      race: "",
      age: "",
      birthPlace: "",
      gender: "",
      status: "",
      family: "",
      classOccupation: "",
      description: "",
      tags: [],
    });
  };

  // Видалення персонажа
  const handleDelete = (character: Character) => {
    if (window.confirm("Ви впевнені, що хочете видалити персонажа?")) {
      const updatedCharacters = characters.filter(
        (char) => char.id !== character.id
      );
      saveCharacters(updatedCharacters);
    }
  };

  // Відкриття форми
  const handleEdit = (character: Character) => {
    setSelectedCharacter(character);
    setFormData(character);
    setShowModal(true);
  };

  // Обробка завантаження портрета
  const handlePortraitUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, portrait: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Обробка тегів
  const handleAddTag = (tag: string) => {
    if (tag.trim() && !formData.tags?.includes(tag.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tag.trim()],
      });
    }
  };

  // Фільтрований та відсортований список персонажів
  const filteredCharacters = characters
    .filter((character) => {
      const matchesRace = filterRace
        ? character.race === filterRace ||
          (filterRace === "Користувацькі" &&
            !["Люди", "Ельфи", "Орки", "Гноми", "Демони", "Духи"].includes(
              character.race
            ))
        : true;
      const matchesSearch = character.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesRace && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "race") return a.race.localeCompare(b.race);
      if (sortBy === "age") return parseInt(a.age) - parseInt(b.age);
      return 0;
    });

  return (
    <div
      className="p-4"
      style={{
        backgroundColor: "#2c1e3a",
        color: "white",
        borderRadius: "10px",
      }}
    >
      <h2 className="mb-3" style={{ borderBottom: "2px solid #6b4e9a" }}>
        Персонажі
      </h2>
      <div className="mb-3 d-flex justify-content-between">
        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
          style={{ backgroundColor: "#6b4e9a", border: "none" }}
        >
          Додати персонажа
        </Button>
        <div>
          <input
            type="text"
            className="form-control"
            placeholder="Пошук за ім'ям..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "200px",
              backgroundColor: "#4a2c5a",
              color: "white",
              border: "1px solid #6b4e9a",
            }}
          />
          <select
            className="form-control ms-2 custom-select-fantasy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              width: "150px",
              backgroundColor: "#4a2c5a",
              color: "white",
              border: "1px solid #6b4e9a",
            }}
          >
            <option value="name">Сортувати за ім'ям</option>
            <option value="race">Сортувати за расою</option>
            <option value="age">Сортувати за віком</option>
          </select>
        </div>
      </div>
      <select
        className="form-control mb-3 custom-select-fantasy"
        value={filterRace}
        onChange={(e) => setFilterRace(e.target.value)}
        style={{
          backgroundColor: "#4a2c5a",
          color: "white",
          border: "1px solid #6b4e9a",
        }}
      >
        <option value="">Усі раси</option>
        <option value="Люди">Люди</option>
        <option value="Ельфи">Ельфи</option>
        <option value="Орки">Орки</option>
        <option value="Гноми">Гноми</option>
        <option value="Демони">Демони</option>
        <option value="Духи">Духи</option>
        <option value="Користувацькі">Користувацькі</option>
      </select>
      <div className="row">
        {filteredCharacters.map((character) => (
          <div key={character.id} className="col-md-4 col-sm-6 mb-3">
            <div
              className="card bg-dark text-white p-3"
              style={{
                border: "1px solid #6b4e9a",
                borderRadius: "8px",
                maxWidth: "300px",
                height: "400px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "60%",
                  overflow: "hidden",
                }}
              >
                <img
                  src={character.portrait}
                  alt={character.name}
                  className="img-fluid"
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>
              <div style={{ paddingTop: "10px", height: "40%" }}>
                <h5>{character.name}</h5>
                <p>
                  {character.race}, {character.classOccupation}, {character.age}{" "}
                  років
                </p>
                {character.tags && character.tags.length > 0 && (
                  <p className="text-muted small">
                    Теги: {character.tags.join(", ")}
                  </p>
                )}
                <div className="d-flex justify-content-between mt-2">
                  <Button
                    variant="warning"
                    onClick={() => handleEdit(character)}
                    style={{
                      backgroundColor: "#ffc107",
                      border: "none",
                      width: "48%",
                    }}
                  >
                    Редагувати
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(character)}
                    style={{
                      backgroundColor: "#dc3545",
                      border: "none",
                      width: "48%",
                    }}
                  >
                    Видалити
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "#4a2c5a",
            color: "white",
            borderBottom: "1px solid #6b4e9a",
          }}
        >
          <Modal.Title>
            {selectedCharacter ? "Редагувати" : "Додати"} персонажа
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#2c1e3a", color: "white" }}>
          <div className="mb-3">
            <label>Портрет</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handlePortraitUpload}
              style={{
                backgroundColor: "#4a2c5a",
                border: "1px solid #6b4e9a",
              }}
            />
            {formData.portrait && (
              <img
                src={formData.portrait}
                alt="Portrait"
                className="img-fluid mt-2"
                style={{
                  maxHeight: "150px",
                  border: "2px solid #6b4e9a",
                  objectFit: "contain",
                }}
              />
            )}
          </div>
          <div className="mb-3">
            <label>Ім'я</label>
            <input
              className="form-control"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              style={{
                backgroundColor: "#4a2c5a",
                color: "white",
                border: "1px solid #6b4e9a",
              }}
            />
          </div>
          <div className="mb-3">
            <label>Раса</label>
            <input
              className="form-control"
              value={formData.race}
              onChange={(e) =>
                setFormData({ ...formData, race: e.target.value })
              }
              placeholder="Введіть расу або виберіть з нижнього списку"
              style={{
                backgroundColor: "#4a2c5a",
                color: "white",
                border: "1px solid #6b4e9a",
              }}
            />
            <select
              className="form-control mt-2 custom-select-fantasy"
              value={formData.race}
              onChange={(e) =>
                setFormData({ ...formData, race: e.target.value })
              }
              style={{
                backgroundColor: "#4a2c5a",
                color: "white",
                border: "1px solid #6b4e9a",
              }}
            >
              <option value="">Оберіть расу</option>
              <option value="Люди">Люди</option>
              <option value="Ельфи">Ельфи</option>
              <option value="Орки">Орки</option>
              <option value="Гноми">Гноми</option>
              <option value="Демони">Демони</option>
              <option value="Духи">Духи</option>
            </select>
          </div>
          <div className="mb-3">
            <label>Вік</label>
            <input
              type="number"
              className="form-control"
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
          </div>
          <div className="mb-3">
            <label>Місце народження</label>
            <input
              className="form-control"
              value={formData.birthPlace}
              onChange={(e) =>
                setFormData({ ...formData, birthPlace: e.target.value })
              }
              style={{
                backgroundColor: "#4a2c5a",
                color: "white",
                border: "1px solid #6b4e9a",
              }}
            />
          </div>
          <div className="mb-3">
            <label>Стать</label>
            <select
              className="form-control custom-select-fantasy"
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              style={{
                backgroundColor: "#4a2c5a",
                color: "white",
                border: "1px solid #6b4e9a",
              }}
            >
              <option value="">Оберіть стать</option>
              <option value="Жіноча">Жіноча</option>
              <option value="Чоловіча">Чоловіча</option>
              <option value="Інше">Інше</option>
              <option value="Невідомо">Невідомо</option>
            </select>
          </div>
          <div className="mb-3">
            <label>Статус</label>
            <select
              className="form-control custom-select-fantasy"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              style={{
                backgroundColor: "#4a2c5a",
                color: "white",
                border: "1px solid #6b4e9a",
              }}
            >
              <option value="">Оберіть статус</option>
              <option value="Живий/Жива">Живий/Жива</option>
              <option value="Мертвий/Мертва">Мертвий/Мертва</option>
              <option value="Невідомо">Невідомо</option>
            </select>
          </div>
          <div className="mb-3">
            <label>Родина</label>
            <input
              className="form-control"
              value={formData.family}
              onChange={(e) =>
                setFormData({ ...formData, family: e.target.value })
              }
              style={{
                backgroundColor: "#4a2c5a",
                color: "white",
                border: "1px solid #6b4e9a",
              }}
            />
          </div>
          <div className="mb-3">
            <label>Клас/Рід занять</label>
            <input
              className="form-control"
              value={formData.classOccupation}
              onChange={(e) =>
                setFormData({ ...formData, classOccupation: e.target.value })
              }
              style={{
                backgroundColor: "#4a2c5a",
                color: "white",
                border: "1px solid #6b4e9a",
              }}
            />
          </div>
          <div className="mb-3">
            <label>Опис</label>
            <textarea
              className="form-control"
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
          </div>
          <div className="mb-3">
            <label>Теги</label>
            <input
              className="form-control"
              placeholder="Додати тег (наприклад, Герой)"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddTag(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
              style={{
                backgroundColor: "#4a2c5a",
                color: "white",
                border: "1px solid #6b4e9a",
              }}
            />
            {formData.tags && formData.tags.length > 0 && (
              <div className="mt-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="badge bg-secondary me-1"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        tags: formData.tags?.filter((t) => t !== tag),
                      })
                    }
                  >
                    {tag} ×
                  </span>
                ))}
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer
          style={{ backgroundColor: "#4a2c5a", borderTop: "1px solid #6b4e9a" }}
        >
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            style={{ backgroundColor: "#8b0000", border: "none" }}
          >
            Скасувати
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            style={{ backgroundColor: "#6b4e9a", border: "none" }}
          >
            Зберегти
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CharactersModule;
