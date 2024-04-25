import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router/Routes.tsx";
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/700.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
    <RouterProvider router={router} />
  // </React.StrictMode>
);
