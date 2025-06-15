import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import {
  FaHome,
  FaClock,
  FaStickyNote,
  FaBook,
  FaUsers,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";

interface NavigationProps {
  currentModule: string;
  onModuleChange: (module: string) => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  currentModule,
  onModuleChange,
  soundEnabled,
  onSoundToggle,
}) => {
  const modules = [
    { id: "home", name: "Головна", icon: <FaHome /> },
    { id: "chronology", name: "Хронологія", icon: <FaClock /> },
    { id: "notes", name: "Нотатки", icon: <FaStickyNote /> },
    { id: "lore", name: "Лор", icon: <FaBook /> },
    { id: "characters", name: "Персонажі", icon: <FaUsers /> },
  ];

  const playClickSound = () => {
    if (soundEnabled) {
      // Простий звуковий ефект через Web Audio API
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.1
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    }
  };

  const handleModuleChange = (module: string) => {
    playClickSound();
    onModuleChange(module);
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow">
      <Container fluid>
        <Navbar.Brand href="#" className="fw-bold">
          🏰 Fantasy World Builder
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {modules.map((module) => (
              <Nav.Link
                key={module.id}
                active={currentModule === module.id}
                onClick={() => handleModuleChange(module.id)}
                className="d-flex align-items-center gap-2"
              >
                {module.icon}
                {module.name}
              </Nav.Link>
            ))}
          </Nav>

          <div className="d-flex align-items-center">
            <Button
              variant="outline-light"
              size="sm"
              onClick={() => {
                playClickSound();
                onSoundToggle();
              }}
              className="d-flex align-items-center gap-2"
            >
              {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
              {soundEnabled ? "Звук" : "Тиша"}
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
