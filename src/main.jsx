import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { CurrencyProvider } from "./context/Currency.jsx";
import { UserProvider } from './context/UserContext';
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CurrencyProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </CurrencyProvider>
  </React.StrictMode>
);
