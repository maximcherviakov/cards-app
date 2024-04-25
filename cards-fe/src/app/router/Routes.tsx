import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import Search from "../../features/search/Search";
import NotFound from "../errors/NotFound";
import DeckDetails from "../../features/deck/DeckDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "search", element: <Search /> },
      { path: "deck/:id", element: <DeckDetails /> },
      { path: "not-found", element: <NotFound /> },
      { path: "*", element: <Navigate replace to="/not-found" /> },
    ],
  },
]);
