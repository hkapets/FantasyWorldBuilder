import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

interface ImportExportModuleProps {
  selectedWorldId?: number; // Додано проп для вибраного світу
}

const ImportExportModule: React.FC<ImportExportModuleProps> = ({
  selectedWorldId,
}) => {
  const [importFile, setImportFile] = useState<File | null>(null);

  // Завантаження даних для поточного світу (приклад із characters, можна розширити)
  useEffect(() => {
    if (selectedWorldId !== undefined) {
      const characters = JSON.parse(
        localStorage.getItem(`characters_${selectedWorldId}`) || "[]"
      );
      // Додайте тут завантаження інших модулів (лору, нотаток тощо), якщо потрібно
    }
  }, [selectedWorldId]);

  // Експорт даних у JSON
  const handleExport = () => {
    if (selectedWorldId === undefined) {
      alert("Спочатку виберіть світ!");
      return;
    }

    const exportData = {
      characters: JSON.parse(
        localStorage.getItem(`characters_${selectedWorldId}`) || "[]"
      ),
      // Додайте інші модулі (лор, хронологія тощо) тут, якщо потрібно
      timestamp: new Date().toISOString(),
    };

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute(
      "download",
      `world_${selectedWorldId}_export_${
        new Date().toISOString().split("T")[0]
      }.json`
    );
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Імпорт даних із JSON
  const handleImport = () => {
    if (!importFile) {
      alert("Спочатку виберіть файл для імпорту!");
      return;
    }

    if (selectedWorldId === undefined) {
      alert("Спочатку виберіть світ!");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        if (importedData.characters) {
          localStorage.setItem(
            `characters_${selectedWorldId}`,
            JSON.stringify(importedData.characters)
          );
          alert("Дані успішно імпортовано!");
        } else {
          alert("Невірний формат файлу!");
        }
      } catch (error) {
        alert("Помилка при імпорті: невірний JSON-файл!");
      }
    };
    reader.readAsText(importFile);
    setImportFile(null); // Скидаємо файл після імпорту
  };

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
        Імпорт/Експорт
      </h2>
      <div className="mb-3">
        <Button
          variant="primary"
          onClick={handleExport}
          style={{
            backgroundColor: "#6b4e9a",
            border: "none",
            marginRight: "10px",
          }}
        >
          Експорт даних
        </Button>
        <input
          type="file"
          accept=".json"
          onChange={(e) => setImportFile(e.target.files?.[0] || null)}
          className="form-control-file"
          style={{
            display: "inline-block",
            width: "auto",
            backgroundColor: "#4a2c5a",
            color: "white",
            border: "1px solid #6b4e9a",
          }}
        />
        <Button
          variant="success"
          onClick={handleImport}
          style={{
            backgroundColor: "#28a745",
            border: "none",
            marginLeft: "10px",
          }}
          disabled={!importFile}
        >
          Імпорт даних
        </Button>
      </div>
      <p className="text-muted small">
        Експортуйте дані поточного світу в JSON-файл або імпортуйте дані з файлу
        для заміни поточних даних. Підтримується тільки формат із полем
        "characters".
      </p>
    </div>
  );
};

export default ImportExportModule;
