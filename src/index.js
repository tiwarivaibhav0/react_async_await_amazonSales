import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import CategorySelector from "./CategorySelector";
import reportWebVitals from "./reportWebVitals";
import "@shopify/polaris/build/esm/styles.css";
import { AppProvider } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AppProvider i18n={enTranslations}>
    {" "}
    <CategorySelector />
  </AppProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
