import React, { useState, useRef, useEffect } from "react";
import LoreModule from "./components/LoreModule/LoreModule";
import CharactersModule from "./components/CharactersModule/CharactersModule";
import RelationshipsModule from "./components/RelationshipsModule/RelationshipsModule";
import TimelineModule from "./components/TimelineModule/TimelineModule";
import MapModule from "./components/MapModule/MapModule";
import NotesModule from "./components/NotesModule/NotesModule";
import TemplatesModule from "./components/TemplatesModule/TemplatesModule";
import SearchModule from "./components/SearchModule/SearchModule";
import ImportExportModule from "./components/ImportExportModule/ImportExportModule";
import TestModule from "./components/TestModule/TestModule";

// Інтерфейс для типізації вкладок
interface Tab {
  name: string;
  component: React.FC;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Лор");
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true); // Стан звуку

  // Масив вкладок у заданому порядку з українськими назвами
  const tabs: Tab[] = [
    { name: "Лор", component: LoreModule },
    { name: "Персонажі", component: CharactersModule },
    { name: "Зв’язки", component: RelationshipsModule },
    { name: "Хронологія", component: TimelineModule },
    { name: "Карти", component: MapModule },
    { name: "Нотатки", component: NotesModule },
    { name: "Шаблони", component: TemplatesModule },
    { name: "Пошук", component: SearchModule },
    { name: "Імпорт/Експорт", component: ImportExportModule },
    { name: "Тести", component: TestModule },
  ];

  const ActiveComponent = tabs.find((tab) => tab.name === activeTab)?.component;

  // Refs для аудіо
  const buttonSoundRef = useRef<HTMLAudioElement>(null);
  const pageTurnSoundRef = useRef<HTMLAudioElement>(null);
  const backgroundMusicRef = useRef<HTMLAudioElement>(null);

  // Список треків
  const backgroundTracks = [
    "/audio/Mythic Pulse.mp3",
    "/audio/Epiphany.mp3",
    "/audio/Elysian.mp3",
    "/audio/Mythic Realm.mp3",
    "/audio/Epic Realm.mp3",
    "/audio/Epic Quest.mp3",
    "/audio/The Vanguard.mp3",
    "/audio/Mythic.mp3",
    "/audio/DoubleTake.mp3",
    "/audio/Mystic Realms.mp3",
    "/audio/Mythic Rise.mp3",
    "/audio/Valor.mp3",
  ];

  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false); // Стан взаємодії

  // Функція для відтворення звуку кнопки
  const playButtonSound = () => {
    if (isSoundEnabled && buttonSoundRef.current) {
      buttonSoundRef.current.currentTime = 0;
      buttonSoundRef.current
        .play()
        .catch((error) =>
          console.warn("Помилка відтворення звуку кнопки:", error)
        );
    }
  };

  // Функція для відтворення звуку гортання
  const playPageTurnSound = () => {
    if (isSoundEnabled && pageTurnSoundRef.current) {
      pageTurnSoundRef.current.currentTime = 0;
      pageTurnSoundRef.current
        .play()
        .catch((error) =>
          console.warn("Помилка відтворення звуку гортання:", error)
        );
    }
  };

  // Ефект для управління фоновою музикою
  useEffect(() => {
    if (isSoundEnabled && hasUserInteracted && backgroundMusicRef.current) {
      backgroundMusicRef.current.src = backgroundTracks[currentTrackIndex];
      backgroundMusicRef.current.volume = 0.3; // Низька гучність
      backgroundMusicRef.current
        .play()
        .catch((error) =>
          console.warn("Помилка відтворення фонової музики:", error)
        );

      const handleEnded = () => {
        setCurrentTrackIndex(
          (prevIndex) => (prevIndex + 1) % backgroundTracks.length
        );
      };

      backgroundMusicRef.current.addEventListener("ended", handleEnded);

      return () => {
        backgroundMusicRef.current?.removeEventListener("ended", handleEnded);
        if (!isSoundEnabled && backgroundMusicRef.current) {
          backgroundMusicRef.current.pause();
          backgroundMusicRef.current.currentTime = 0;
        }
      };
    } else if (!isSoundEnabled && backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
    }
  }, [isSoundEnabled, hasUserInteracted, currentTrackIndex]);

  // Обробка першої взаємодії
  const handleUserInteraction = () => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
    }
  };

  return (
    <div
      className="min-vh-100 bg-dark text-light"
      onClick={handleUserInteraction}
      onChange={handleUserInteraction}
    >
      {/* Аудіо елементи */}
      <audio
        ref={buttonSoundRef}
        src="/audio/quill-button.wav"
        preload="auto"
      />
      <audio
        ref={pageTurnSoundRef}
        src="/audio/parchment-rustle.wav"
        preload="auto"
      />
      <audio ref={backgroundMusicRef} preload="auto" />

      {/* Навігаційна панель */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            FantasyWorldBuilder
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              {tabs.map((tab) => (
                <li className="nav-item" key={tab.name}>
                  <button
                    className={`nav-link ${
                      activeTab === tab.name ? "active" : ""
                    }`}
                    onClick={() => {
                      playButtonSound();
                      setTimeout(() => {
                        setActiveTab(tab.name);
                        playPageTurnSound();
                      }, 100);
                    }}
                  >
                    {tab.name}
                  </button>
                </li>
              ))}
            </ul>
            {/* Кнопка вимикання звуку справа */}
            <div className="form-check form-switch ms-auto">
              <input
                className="form-check-input"
                type="checkbox"
                id="soundToggle"
                checked={isSoundEnabled}
                onChange={(e) => setIsSoundEnabled(e.target.checked)}
              />
              <label
                className="form-check-label text-light"
                htmlFor="soundToggle"
              >
                Звук: {isSoundEnabled ? "Увімк." : "Вимк."}
              </label>
            </div>
          </div>
        </div>
      </nav>

      {/* Контейнер для вмісту вкладок */}
      <div className="container mt-4">
        <h2 className="text-center mb-4">
          Ласкаво просимо до модуля {activeTab}!
        </h2>
        <div className="card p-4 shadow-sm bg-secondary">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
};

export default App;
