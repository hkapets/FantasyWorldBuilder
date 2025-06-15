import React from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Home from "./components/Home/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="App">
        <nav className="navbar navbar-dark bg-dark">
          <div className="container-fluid">
            <span className="navbar-brand mb-0 h1">Fantasy World Builder</span>
          </div>
        </nav>
        <main className="mt-4">
          <Home />
        </main>
      </div>
    </Provider>
  );
};

export default App;
