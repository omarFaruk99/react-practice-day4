import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import NotFound from "../NotFound/NotFound";
import Home from "../Pages/Home";
import ProfilePage from "../Pages/ProfilePage";
import SignIn from "../Pages/SignIn";
import SignUp from "../Pages/SignUp";
import Tasks from "../Pages/Tasks";
import { ProtectedRoute } from "./ProtectedRoute";

export const router: any = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/signin",
        element: <SignIn />,
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/tasks",
        element: (
          <ProtectedRoute adminOnly>
            <Tasks />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
