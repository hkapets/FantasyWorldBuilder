import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

function Home() {
  const worlds = useSelector((state: RootState) => state.worldSlice.worlds);

  return (
    <div className="home">
      <header className="hero">
        <h1>Fantasy World Builder</h1>
        <p>
          Створюйте неймовірні фентезійні світи з деталізованими локаціями,
          персонажами та історіями
        </p>
        <Link to="/world-editor" className="cta-button">
          Створити новий світ
        </Link>
      </header>

      <section className="features">
        <h2>Можливості</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>🗺️ Конструктор світів</h3>
            <p>
              Створюйте детальні карти з різними локаціями, містами та регіонами
            </p>
          </div>
          <div className="feature-card">
            <h3>👥 Персонажі</h3>
            <p>Розробляйте унікальних персонажів з детальними біографіями</p>
          </div>
          <div className="feature-card">
            <h3>📚 Історії</h3>
            <p>Записуйте легенди, історії та хронології ваших світів</p>
          </div>
        </div>
      </section>

      {worlds.length > 0 && (
        <section className="recent-worlds">
          <h2>Ваші світи</h2>
          <div className="worlds-grid">
            {worlds.map((world) => (
              <div key={world.id} className="world-card">
                <h3>{world.name}</h3>
                <p>{world.description}</p>
                <Link to={`/world-editor/${world.id}`} className="edit-button">
                  Редагувати
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
