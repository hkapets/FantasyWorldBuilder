import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { selectWorld } from "../store/worldSlice";
import WorldList from "./WorldList";
import WorldEditor from "./WorldEditor";

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const { worlds, selectedWorldId } = useSelector(
    (state: RootState) => state.world
  );

  const handleWorldSelect = (worldId: number | null) => {
    dispatch(selectWorld(worldId));
  };

  const selectedWorld = selectedWorldId
    ? worlds.find((world) => world.id === selectedWorldId)
    : null;

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-4 col-lg-3">
          <div className="card">
            <div className="card-header">
              <h3 className="mb-0">Мої світи</h3>
            </div>
            <div className="card-body">
              <WorldList
                worlds={worlds}
                selectedWorldId={selectedWorldId}
                onWorldSelect={handleWorldSelect}
              />
            </div>
          </div>
        </div>

        <div className="col-md-8 col-lg-9">
          {selectedWorld ? (
            <WorldEditor world={selectedWorld} />
          ) : (
            <div className="jumbotron text-center">
              <h1 className="display-4">
                Ласкаво просимо до Fantasy World Builder
              </h1>
              <p className="lead">Оберіть світ зі списку або створіть новий</p>
              <hr className="my-4" />
              <p>
                Створюйте детальні фентезійні світи з персонажами, локаціями та
                історією
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
