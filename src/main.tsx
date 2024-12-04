import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Usuarios from "./pages/Usuarios/Usuarios";
import Lojas from "./pages/Lojas/Lojas";
import "./assets/styles/input.css";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router>
    <ToastContainer
        position="bottom-center"
        autoClose={5000} 
        hideProgressBar={false} 
        newestOnTop={false}
        closeOnClick 
        pauseOnHover 
        draggable 
        theme="colored" 
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/usuarios/*" element={<Usuarios />} />
        <Route path="/lojas/*" element={<Lojas />} />
      </Routes>
    </Router>
  </React.StrictMode>,
);
