import { WorldData } from "../types";

const STORAGE_KEY = "fantasyWorldBuilder";

export const loadFromStorage = (): WorldData | null => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      // Перетворюємо дати з рядків назад в об'єкти Date
      parsed.events =
        parsed.events?.map((event: any) => ({
          ...event,
          createdAt: new Date(event.createdAt),
          updatedAt: new Date(event.updatedAt),
        })) || [];

      parsed.notes =
        parsed.notes?.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        })) || [];

      parsed.lore =
        parsed.lore?.map((lore: any) => ({
          ...lore,
          createdAt: new Date(lore.createdAt),
          updatedAt: new Date(lore.updatedAt),
        })) || [];

      parsed.characters =
        parsed.characters?.map((character: any) => ({
          ...character,
          createdAt: new Date(character.createdAt),
          updatedAt: new Date(character.updatedAt),
        })) || [];

      return parsed;
    }
  } catch (error) {
    console.error("Помилка при завантаженні даних з localStorage:", error);
  }
  return null;
};

export const saveToStorage = (data: WorldData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Помилка при збереженні даних в localStorage:", error);
  }
};

export const clearStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Помилка при очищенні localStorage:", error);
  }
};

export const exportData = (): string => {
  const data = loadFromStorage();
  return JSON.stringify(data, null, 2);
};

export const importData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    saveToStorage(data);
    return true;
  } catch (error) {
    console.error("Помилка при імпорті даних:", error);
    return false;
  }
};
