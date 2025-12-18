import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home";
import Meals from "../pages/Meals";
import PrivateRoute from "../components/PrivateRoute";
import MealDetails from "../pages/MealsDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import DashboardLayout from "../layouts/DashboardLayout";
import Profile from "../dashboard/Profile";
// import MainLayout from "../layouts/MainLayout";
// import DashboardLayout from "../layouts/DashboardLayout";
// import Home from "../pages/Home";
// import Meals from "../pages/Meals";
// import MealDetails from "../pages/MealDetails";
// import Login from "../pages/Login";
// import Register from "../pages/Register";
// import ErrorPage from "../pages/ErrorPage";
// import PrivateRoute from "../components/PrivateRoute";
// import Profile from "../dashboard/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/meals", element: <Meals /> },
      {
        path: "/meals/:id",
        element: (
          <PrivateRoute>
            <MealDetails />
          </PrivateRoute>
        )
      },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> }
    ]
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "profile", element: <Profile /> }
    ]
  }
]);

export default router;