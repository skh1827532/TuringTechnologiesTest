import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/Login";
import HomePage from "./components/HomePage";
import AppProvider from "./context/AppProvider.jsx";
import Navbar from "./components/Navbar.jsx";

import "./App.css";
import { Nav } from "react-bootstrap";

const App = () => {
  return (
    <Router>
      <AppProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </AppProvider>
    </Router>
  );
};

export default App;
