import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Navigation from "./components/Navigation";
import Home from "./components/Home";
import WorldList from "./components/WorldList";
import WorldEditor from "./components/WorldEditor";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/worlds" element={<WorldList />} />
              <Route path="/world-editor" element={<WorldEditor />} />
              <Route path="/world-editor/:id" element={<WorldEditor />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
