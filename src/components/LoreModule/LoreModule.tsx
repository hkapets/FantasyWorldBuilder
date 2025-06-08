import React, { useState, useEffect } from "react";

interface LoreEntry {
  id: string;
  section: string;
  text: string;
}

interface Skill {
  id: string;
  name: string;
  icon: string;
  customIcon?: File | null;
  parentId?: string | null; // Дозволяємо null для батьківського навичку
  isUltimate?: boolean; // Позначає ультимативний навик
}

interface MagicType {
  id: string;
  name: string;
  icon: string;
  customIcon?: File | null;
  skills: Skill[];
}

const LoreModule: React.FC = () => {
  const [loreEntries, setLoreEntries] = useState<LoreEntry[]>(() => {
    try {
      const saved = localStorage.getItem("loreEntries");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.warn("Failed to load lore entries from localStorage:", error);
      return [];
    }
  });
  const [newLore, setNewLore] = useState("");
  const [selectedSection, setSelectedSection] = useState(
    "worldDescription-geography-continents"
  );
  const [magicTypes, setMagicTypes] = useState<MagicType[]>(() => {
    try {
      const saved = localStorage.getItem("magicTypes");
      return saved
        ? JSON.parse(saved).map((m: any) => ({
            ...m,
            customIcon: null,
            skills: m.skills || [],
          }))
        : [
            {
              id: "1",
              name: "Вогонь",
              icon: "/icons/fire.png",
              customIcon: null,
              skills: [],
            },
            {
              id: "2",
              name: "Вода",
              icon: "/icons/water.png",
              customIcon: null,
              skills: [],
            },
            {
              id: "3",
              name: "Повітря",
              icon: "/icons/air.png",
              customIcon: null,
              skills: [],
            },
            {
              id: "4",
              name: "Земля",
              icon: "/icons/earth.png",
              customIcon: null,
              skills: [],
            },
            {
              id: "5",
              name: "Рослин",
              icon: "/icons/plants.png",
              customIcon: null,
              skills: [],
            },
            {
              id: "6",
              name: "Світла",
              icon: "/icons/light.png",
              customIcon: null,
              skills: [],
            },
            {
              id: "7",
              name: "Темряви",
              icon: "/icons/darkness.png",
              customIcon: null,
              skills: [],
            },
            {
              id: "8",
              name: "Швидкості",
              icon: "/icons/speed.png",
              customIcon: null,
              skills: [],
            },
            {
              id: "9",
              name: "Електромагія",
              icon: "/icons/electromagic.png",
              customIcon: null,
              skills: [],
            },
            {
              id: "10",
              name: "Магія впливу",
              icon: "/icons/influence.png",
              customIcon: null,
              skills: [],
            },
            {
              id: "11",
              name: "Магія посилення",
              icon: "/icons/enhancement.png",
              customIcon: null,
              skills: [],
            },
            {
              id: "12",
              name: "Тіні",
              icon: "/icons/shadow.png",
              customIcon: null,
              skills: [],
            },
            {
              id: "13",
              name: "Створення",
              icon: "/icons/creation.png",
              customIcon: null,
              skills: [],
            },
          ];
    } catch (error) {
      console.warn("Failed to load magic types from localStorage:", error);
      return [
        {
          id: "1",
          name: "Вогонь",
          icon: "/icons/fire.png",
          customIcon: null,
          skills: [],
        },
        {
          id: "2",
          name: "Вода",
          icon: "/icons/water.png",
          customIcon: null,
          skills: [],
        },
        {
          id: "3",
          name: "Повітря",
          icon: "/icons/air.png",
          customIcon: null,
          skills: [],
        },
        {
          id: "4",
          name: "Земля",
          icon: "/icons/earth.png",
          customIcon: null,
          skills: [],
        },
        {
          id: "5",
          name: "Рослин",
          icon: "/icons/plants.png",
          customIcon: null,
          skills: [],
        },
        {
          id: "6",
          name: "Світла",
          icon: "/icons/light.png",
          customIcon: null,
          skills: [],
        },
        {
          id: "7",
          name: "Темряви",
          icon: "/icons/darkness.png",
          customIcon: null,
          skills: [],
        },
        {
          id: "8",
          name: "Швидкості",
          icon: "/icons/speed.png",
          customIcon: null,
          skills: [],
        },
        {
          id: "9",
          name: "Електромагія",
          icon: "/icons/electromagic.png",
          customIcon: null,
          skills: [],
        },
        {
          id: "10",
          name: "Магія впливу",
          icon: "/icons/influence.png",
          customIcon: null,
          skills: [],
        },
        {
          id: "11",
          name: "Магія посилення",
          icon: "/icons/enhancement.png",
          customIcon: null,
          skills: [],
        },
        {
          id: "12",
          name: "Тіні",
          icon: "/icons/shadow.png",
          customIcon: null,
          skills: [],
        },
        {
          id: "13",
          name: "Створення",
          icon: "/icons/creation.png",
          customIcon: null,
          skills: [],
        },
      ];
    }
  });
  const [newMagicName, setNewMagicName] = useState("");
  const [newMagicIcon, setNewMagicIcon] = useState<File | null>(null);
  const [selectedMagicType, setSelectedMagicType] = useState<string | null>(
    null
  );
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillIcon, setNewSkillIcon] = useState<File | null>(null);
  const [parentSkillId, setParentSkillId] = useState<string | null>(null);
  const [isUltimate, setIsUltimate] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("loreEntries", JSON.stringify(loreEntries));
      localStorage.setItem(
        "magicTypes",
        JSON.stringify(
          magicTypes.map((m) => ({
            id: m.id,
            name: m.name,
            icon: m.icon,
            skills: m.skills.map((s) => ({
              id: s.id,
              name: s.name,
              icon: s.icon,
              parentId: s.parentId,
              isUltimate: s.isUltimate,
            })),
          }))
        )
      );
    } catch (error) {
      console.warn("Failed to save to localStorage:", error);
    }
  }, [loreEntries, magicTypes]);

  const addLore = () => {
    if (newLore.trim()) {
      const newEntry: LoreEntry = {
        id: Date.now().toString(),
        section: selectedSection,
        text: `${newLore} - ${new Date().toLocaleDateString()}`,
      };
      setLoreEntries([...loreEntries, newEntry]);
      setNewLore("");
    }
  };

  const clearLore = () => {
    setLoreEntries([]);
    try {
      localStorage.removeItem("loreEntries");
    } catch (error) {
      console.warn("Failed to clear lore entries from localStorage:", error);
    }
  };

  const addMagicType = () => {
    if (
      (selectedMagicType === "custom" && newMagicName.trim()) ||
      selectedMagicType
    ) {
      const magicToAdd = magicTypes.find((m) => m.id === selectedMagicType);
      if (magicToAdd) {
        setMagicTypes(
          magicTypes.map((m) =>
            m.id === selectedMagicType
              ? {
                  ...m,
                  customIcon: newMagicIcon,
                  icon: newMagicIcon
                    ? URL.createObjectURL(newMagicIcon)
                    : m.icon,
                }
              : m
          )
        );
      } else if (newMagicName.trim()) {
        const newMagic: MagicType = {
          id: Date.now().toString(),
          name: newMagicName,
          icon: newMagicIcon
            ? URL.createObjectURL(newMagicIcon)
            : "/icons/undefined.png",
          customIcon: newMagicIcon,
          skills: [],
        };
        setMagicTypes([...magicTypes, newMagic]);
      }
      setNewMagicName("");
      setNewMagicIcon(null);
      setSelectedMagicType(null);
    }
  };

  const addSkill = () => {
    if (newSkillName.trim() && selectedMagicType) {
      const newSkill: Skill = {
        id: Date.now().toString(),
        name: newSkillName,
        icon: newSkillIcon
          ? URL.createObjectURL(newSkillIcon)
          : "/icons/undefined.png",
        customIcon: newSkillIcon,
        parentId: parentSkillId,
        isUltimate: isUltimate,
      };
      setMagicTypes(
        magicTypes.map((m) =>
          m.id === selectedMagicType
            ? { ...m, skills: [...m.skills, newSkill] }
            : m
        )
      );
      setNewSkillName("");
      setNewSkillIcon(null);
      setParentSkillId(null);
      setIsUltimate(false);
    }
  };

  const deleteMagicType = (id: string) => {
    setMagicTypes(magicTypes.filter((m) => m.id !== id));
  };

  const deleteSkillTree = (magicId: string) => {
    setMagicTypes(
      magicTypes.map((m) => (m.id === magicId ? { ...m, skills: [] } : m))
    );
  };

  const sections = {
    worldDescription: "Опис світу",
    racesAndPeoples: "Расы і народи",
    religionAndMythology: "Релігія і міфологія",
    magic: "Магія",
    artifacts: "Артефакти",
  };

  return (
    <div className="p-4">
      <h2 className="h4">Lore Module</h2>
      {/* Лор-розділи */}
      <div className="input-group mb-3">
        <select
          className="form-select"
          value={selectedSection}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setSelectedSection(e.target.value)
          }
        >
          {Object.entries(sections).map(([key, value]) => (
            <optgroup key={key} label={value}>
              {key === "worldDescription" && (
                <>
                  <option value={`${key}-geography-continents`}>
                    Географія - Континенти
                  </option>
                  <option value={`${key}-geography-oceans`}>
                    Географія - Океани
                  </option>
                  <option value={`${key}-climate`}>Клімат</option>
                  <option value={`${key}-locations`}>Локації</option>
                </>
              )}
              {key !== "worldDescription" && (
                <option value={key}>{value}</option>
              )}
            </optgroup>
          ))}
        </select>
        <input
          type="text"
          className="form-control"
          placeholder="Enter lore here..."
          value={newLore}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewLore(e.target.value)
          }
        />
        <button onClick={addLore} className="btn btn-secondary">
          Add Lore Entry
        </button>
      </div>
      <div className="mt-3">
        {Object.entries(sections).map(([key, value]) => (
          <div key={key} className="mb-4">
            <h3 className="h5 text-gray-700">{value}</h3>
            {key === "worldDescription" && (
              <div className="ml-3">
                <h4 className="h6 text-gray-600">Географія</h4>
                <div>
                  <h5 className="h6 text-gray-500">Континенти</h5>
                  <ul className="list-group">
                    {loreEntries
                      .filter(
                        (entry) =>
                          entry.section === `${key}-geography-continents`
                      )
                      .map((entry) => (
                        <li key={entry.id} className="list-group-item">
                          {entry.text}
                        </li>
                      ))}
                  </ul>
                </div>
                <div>
                  <h5 className="h6 text-gray-500">Океани</h5>
                  <ul className="list-group">
                    {loreEntries
                      .filter(
                        (entry) => entry.section === `${key}-geography-oceans`
                      )
                      .map((entry) => (
                        <li key={entry.id} className="list-group-item">
                          {entry.text}
                        </li>
                      ))}
                  </ul>
                </div>
                <h4 className="h6 text-gray-600">Клімат</h4>
                <ul className="list-group">
                  {loreEntries
                    .filter((entry) => entry.section === `${key}-climate`)
                    .map((entry) => (
                      <li key={entry.id} className="list-group-item">
                        {entry.text}
                      </li>
                    ))}
                </ul>
                <h4 className="h6 text-gray-600">Локації</h4>
                <ul className="list-group">
                  {loreEntries
                    .filter((entry) => entry.section === `${key}-locations`)
                    .map((entry) => (
                      <li key={entry.id} className="list-group-item">
                        {entry.text}
                      </li>
                    ))}
                </ul>
              </div>
            )}
            {key === "magic" && (
              <div className="ml-3">
                <h4 className="h6 text-gray-600">Типи магії</h4>
                <div className="input-group mb-3">
                  <select
                    className="form-select"
                    value={selectedMagicType || ""}
                    onChange={(e) => setSelectedMagicType(e.target.value)}
                  >
                    <option value="" disabled>
                      Оберіть тип магії
                    </option>
                    {magicTypes.map((magic) => (
                      <option key={magic.id} value={magic.id}>
                        {magic.name}
                      </option>
                    ))}
                    <option value="custom">Користувацька</option>
                  </select>
                  {selectedMagicType === "custom" && (
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Назва нової магії..."
                      value={newMagicName}
                      onChange={(e) => setNewMagicName(e.target.value)}
                    />
                  )}
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) =>
                      setNewMagicIcon(e.target.files?.[0] || null)
                    }
                  />
                  <button onClick={addMagicType} className="btn btn-secondary">
                    Додати/Оновити магію
                  </button>
                  {selectedMagicType && (
                    <button
                      onClick={() => deleteMagicType(selectedMagicType)}
                      className="btn btn-danger ms-2"
                    >
                      Видалити магію
                    </button>
                  )}
                </div>
                <h4 className="h6 text-gray-600">Дерево навичок</h4>
                {magicTypes.map((magic) => (
                  <div key={magic.id} className="mb-3">
                    <h5 className="h6 text-gray-500">
                      <img
                        src={magic.icon}
                        alt={magic.name}
                        style={{ width: "30px", height: "30px" }}
                      />
                      {magic.name}
                    </h5>
                    <div className="input-group mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Назва навичку..."
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                      />
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) =>
                          setNewSkillIcon(e.target.files?.[0] || null)
                        }
                      />
                      <select
                        className="form-select"
                        value={parentSkillId || ""}
                        onChange={(e) => setParentSkillId(e.target.value)}
                      >
                        <option value="">Без батьківського навичку</option>
                        {magic.skills.map((skill) => (
                          <option key={skill.id} value={skill.id}>
                            {skill.name}
                          </option>
                        ))}
                      </select>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={isUltimate}
                          onChange={(e) => setIsUltimate(e.target.checked)}
                        />
                        <label className="form-check-label">
                          Ультимативний навик
                        </label>
                      </div>
                      <button onClick={addSkill} className="btn btn-secondary">
                        Додати навик
                      </button>
                    </div>
                    <ul className="list-group">
                      {renderSkillTree(magic.skills, magic.id)}
                    </ul>
                    <button
                      onClick={() => deleteSkillTree(magic.id)}
                      className="btn btn-danger mt-2"
                    >
                      Очистити дерево навичок
                    </button>
                  </div>
                ))}
              </div>
            )}
            {key !== "worldDescription" && key !== "magic" && (
              <ul className="list-group">
                {loreEntries
                  .filter((entry) => entry.section === key)
                  .map((entry) => (
                    <li key={entry.id} className="list-group-item">
                      {entry.text}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <button onClick={clearLore} className="btn btn-danger mt-2 ms-2">
        Clear Lore
      </button>
    </div>
  );
};

// Функція для рекурсивного рендерингу дерева навичок
const renderSkillTree = (skills: Skill[], magicId: string) => {
  return skills.map((skill) => (
    <li
      key={skill.id}
      className="list-group-item d-flex justify-content-between align-items-center"
    >
      <div>
        <img
          src={skill.icon}
          alt={skill.name}
          style={{ width: "20px", height: "20px" }}
        />
        {skill.name} {skill.isUltimate && "(Ультимативний)"}
      </div>
      {skill.isUltimate ? null : (
        <ul className="list-group">
          {renderSkillTree(
            skills.filter((s) => s.parentId === skill.id),
            magicId
          )}
        </ul>
      )}
    </li>
  ));
};

export default LoreModule;
