import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import Search from "../../features/search/Search";
import NotFound from "../errors/NotFound";
import DeckDetails from "../../features/deck/DeckDetails";
import Unauthorized from "../errors/Unauthorized";
import Register from "../../features/account/Register";
import RequireAuth from "./RequireAuth";
import Dashboard from "../../features/dashboard/Dashboard";
import Login from "../../features/account/Login";
import Logout from "../../features/account/Logout";
import EditCardsPage from "../../features/deck/EditCardsPage";
import Profile from "../../features/account/Profile";
import ClassDetails from "../../features/class/ClassDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <RequireAuth />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "profile", element: <Profile /> },
          { path: "edit/deck/:id", element: <EditCardsPage /> },
        ],
      },
      { path: "", element: <HomePage /> },
      { path: "search", element: <Search /> },
      { path: "deck/:id", element: <DeckDetails /> },
      { path: "class/:id", element: <ClassDetails /> },

      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "logout", element: <Logout /> },

      { path: "not-found", element: <NotFound /> },
      { path: "unauthorized", element: <Unauthorized /> },
      { path: "*", element: <Navigate replace to="/not-found" /> },
    ],
  },
]);
