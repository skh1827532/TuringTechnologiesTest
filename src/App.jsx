import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/Login";
import HomePage from "./components/HomePage";
import AppProvider from "./context/AppProvider.jsx";

import "./App.css";

const App = () => {
  return (
    <Router>
      <AppProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </AppProvider>
    </Router>
  );
};

export default App;
