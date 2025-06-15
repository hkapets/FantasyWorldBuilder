import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { deleteWorld } from "../store/worldSlice";

function WorldList() {
  const worlds = useSelector((state: RootState) => state.worldSlice.worlds);
  const dispatch = useDispatch();

  const handleDeleteWorld = (id: string) => {
    if (window.confirm("Ви впевнені, що хочете видалити цей світ?")) {
      dispatch(deleteWorld(id));
    }
  };

  if (worlds.length === 0) {
    return (
      <div className="world-list-empty">
        <h2>У вас поки немає створених світів</h2>
        <p>Почніть створювати свій перший фентезійний світ!</p>
        <Link to="/world-editor" className="create-world-button">
          Створити перший світ
        </Link>
      </div>
    );
  }

  return (
    <div className="world-list">
      <div className="world-list-header">
        <h2>Ваші світи</h2>
        <Link to="/world-editor" className="create-world-button">
          Створити новий світ
        </Link>
      </div>

      <div className="worlds-grid">
        {worlds.map((world) => (
          <div key={world.id} className="world-card">
            <div className="world-card-header">
              <h3>{world.name}</h3>
              <div className="world-card-actions">
                <Link
                  to={`/world-editor/${world.id}`}
                  className="edit-button"
                  title="Редагувати світ"
                >
                  ✏️
                </Link>
                <button
                  onClick={() => handleDeleteWorld(world.id)}
                  className="delete-button"
                  title="Видалити світ"
                >
                  🗑️
                </button>
              </div>
            </div>

            <p className="world-description">{world.description}</p>

            <div className="world-stats">
              <span>Локацій: {world.locations?.length || 0}</span>
              <span>Персонажів: {world.characters?.length || 0}</span>
            </div>

            <div className="world-card-footer">
              <small>
                Створено:{" "}
                {new Date(world.createdAt).toLocaleDateString("uk-UA")}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorldList;
