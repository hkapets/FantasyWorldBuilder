import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="logo">
          🏰 Fantasy World Builder
        </Link>

        <ul className="nav-links">
          <li>
            <Link to="/" className={isActive("/") ? "active" : ""}>
              Головна
            </Link>
          </li>
          <li>
            <Link to="/worlds" className={isActive("/worlds") ? "active" : ""}>
              Мої світи
            </Link>
          </li>
          <li>
            <Link
              to="/world-editor"
              className={isActive("/world-editor") ? "active" : ""}
            >
              Створити світ
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
