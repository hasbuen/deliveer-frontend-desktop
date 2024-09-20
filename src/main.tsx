import React from "react";
import ReactDOM from "react-dom/client";
import Login from "./Login";
import "./input.css";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ToastContainer />

    <Login />
  </React.StrictMode>,
);
