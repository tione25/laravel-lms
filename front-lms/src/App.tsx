import { RouterProvider, ScrollRestoration, createBrowserRouter } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import AdminLayout from "./components/Admin/Layout";
import FrontLayout from "./components/Front/Layout";
import Home from "./pages/front/Home";
import Library from "./pages/front/Library";
import CourseCreate from "./pages/admin/Courses/Create";
import CourseEdit from "./pages/admin/Courses/Edit";
import Courses from "./pages/admin/Courses/Index";
import Path from "./pages/front/Path/Index";
import Paths from "./pages/admin/Paths/Index";
import CreatePath from "./pages/admin/Paths/CreatePath";
import EditPath from "./pages/admin/Paths/EditPath";
import Users from "./pages/admin/Users";
import ShowCourse from "./pages/front/courses/ShowCourse";
import Login from "./pages/front/Auth/Login";
import Register from "./pages/front/Auth/Register";
import CourseViewer from "./pages/front/CourseViewer";
import Quizzes from "./pages/admin/Quizzes";

import "./App.css";
import Categories from "./pages/admin/Categories";
import EditCategory from "./pages/admin/Categories/EditCategory";
import CreateCategory from "./pages/admin/Categories/CreateCategory";
import PathsLibrary from "./pages/front/PathsLibrary";
import ViewPath from "./pages/front/Path/ViewPath";
import Profile from "./pages/front/Profile";
import MyCourses from "./pages/front/MyCourses";
import Contact from "./pages/front/Contact/Index";
import Confirm from "./pages/front/Auth/Confirm";
import ScrollToTop from "./components/ScrollToTop";
import PasswordReset from "./pages/front/Auth/PasswordReset";
import PasswordResetConfirm from "./pages/front/Auth/PasswordResetConfirm";

function App() {
  const router = createBrowserRouter([
    {
      element: <AdminLayout />,
      path: "/admin",
      children: [
        {
          path: "",
          element: <Dashboard />,
        },
        {
          path: "users",
          element: <Users />,
        },
        {
          path: "courses",
          element: <Courses />,
        },
        {
          path: "courses/create",
          element: <CourseCreate />,
        },
        {
          path: "courses/edit/:id",
          element: <CourseEdit />,
        },
        {
          path: "paths",
          element: <Paths />,
        },
        {
          path: "paths/create",
          element: <CreatePath />,
        },
        {
          path: "paths/edit/:id",
          element: <EditPath />,
        },
        {
          path: "quizzes",
          element: <Quizzes />,
        },
        {
          path: "categories",
          element: <Categories />,
        },

        {
          path: "categories/edit/:id",
          element: <EditCategory />,
        },

        {
          path: "categories/create",
          element: <CreateCategory />,
        },
      ],
    },

    {
      element: <FrontLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/signup",
          element: <Register />,
        },
        {
          path: "/password/reset",
          element: <PasswordReset />,
        },
        {
          path: "/password/reset/:email/:token",
          element: <PasswordResetConfirm />,
        },
        {
          path: "/confirm/:email/:token",
          element: <Confirm />,
        },
        {
          path: "/library",
          element: <Library />,
        },
        {
          path: "/paths",
          element: <PathsLibrary />,
        },
        {
          path: "/paths/:slug",
          element: <ViewPath />,
        },
        {
          path: "/courses/:slug",
          element: <ShowCourse />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/my-courses",
          element: <MyCourses />,
        },
        {
          path: "/contact",
          element: <Contact />,
        },
      ],
    },

    {
      path: "/courses/:slug/sections/:section/:lesson",
      element: <CourseViewer />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
