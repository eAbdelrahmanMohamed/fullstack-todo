import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./main/App";
import { Provider } from "react-redux";
import  store  from "./redux/store";
import { BrowserRouter } from "react-router-dom";

const container = document.getElementById("root");

if (!container) throw new Error("Root container not found");

const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// Optional performance report
