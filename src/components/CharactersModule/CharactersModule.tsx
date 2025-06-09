import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

const CharactersModule: React.FC = () => {
  const [characters, setCharacters] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const [formData, setFormData] = useState({
    portrait: "/images/default-silhouette.png", // За замовчуванням силует
    name: "",
    race: "",
    age: "",
    birthPlace: "",
    gender: "",
    status: "",
    family: "",
    classOccupation: "",
    description: "",
  });
  const [filterRace, setFilterRace] = useState<string>(""); // Стан для фільтрації

  // Завантаження з localStorage
  useEffect(() => {
    const savedCharacters = JSON.parse(
      localStorage.getItem("characters") || "[]"
    );
    setCharacters(savedCharacters);
  }, []);

  // Збереження в localStorage
  const saveCharacters = (updatedCharacters: any[]) => {
    setCharacters(updatedCharacters);
    localStorage.setItem("characters", JSON.stringify(updatedCharacters));
  };

  // Додавання/редагування персонажа
  const handleSave = () => {
    if (selectedCharacter) {
      // Редагування
      const updatedCharacters = characters.map((char) =>
        char === selectedCharacter ? { ...formData, id: char.id } : char
      );
      saveCharacters(updatedCharacters);
    } else {
      // Додавання
      const newCharacter = { ...formData, id: Date.now() };
      saveCharacters([...characters, newCharacter]);
    }
    setShowModal(false);
    setSelectedCharacter(null);
    setFormData({
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
    });
  };

  // Видалення персонажа
  const handleDelete = (character: any) => {
    if (window.confirm("Ви впевнені, що хочете видалити персонажа?")) {
      const updatedCharacters = characters.filter((char) => char !== character);
      saveCharacters(updatedCharacters);
    }
  };

  // Відкриття форми
  const handleEdit = (character: any) => {
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

  // Фільтрований список персонажів
  const filteredCharacters = filterRace
    ? characters.filter((character) => {
        // Якщо раса користувацька, фільтруємо як "Користувацькі"
        if (
          character.race &&
          !["Люди", "Ельфи", "Орки", "Гноми", "Демони", "Духи"].includes(
            character.race
          )
        ) {
          return filterRace === "Користувацькі";
        }
        return character.race === filterRace;
      })
    : characters;

  return (
    <div className="p-4">
      <h2>Персонажі</h2>
      <Button
        variant="primary"
        onClick={() => setShowModal(true)}
        className="mb-3"
      >
        Додати персонажа
      </Button>
      {/* Селект для фільтрації з фентезі-оформленням */}
      <select
        className="form-control mb-3 custom-select-fantasy"
        value={filterRace}
        onChange={(e) => setFilterRace(e.target.value)}
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
          <div key={character.id} className="col-md-4 mb-3">
            <div className="card bg-light text-dark p-3">
              <img
                src={character.portrait}
                alt={character.name}
                className="img-fluid mb-2"
                style={{ maxHeight: "100px" }}
              />
              <h5>{character.name}</h5>
              <p>
                {character.race}, {character.classOccupation}, {character.age}{" "}
                років
              </p>
              <Button
                variant="warning"
                onClick={() => handleEdit(character)}
                className="me-2"
              >
                Редагувати
              </Button>
              <Button variant="danger" onClick={() => handleDelete(character)}>
                Видалити
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedCharacter ? "Редагувати" : "Додати"} персонажа
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label>Портрет</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handlePortraitUpload}
            />
            {formData.portrait && (
              <img
                src={formData.portrait}
                alt="Portrait"
                className="img-fluid mt-2"
                style={{ maxHeight: "150px" }}
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
            />
            <select
              className="form-control mt-2 custom-select-fantasy"
              value={formData.race}
              onChange={(e) =>
                setFormData({ ...formData, race: e.target.value })
              }
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
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Скасувати
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Зберегти
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CharactersModule;
