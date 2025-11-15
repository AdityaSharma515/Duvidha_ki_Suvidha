import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

// Initialize theme early so it applies before React mounts.
// Reads the saved preference from localStorage and sets/removes
// the `light` class on the documentElement (html).
try {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') document.documentElement.classList.add('light');
  else document.documentElement.classList.remove('light');
} catch (e) {
  // localStorage not available or blocked — ignore
}

import App from "./App.jsx";
import store from "./app/store.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
