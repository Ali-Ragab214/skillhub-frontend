import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import MainLayout from "./layouts/MainLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import StudentLayout from "./layouts/StudentLayout.jsx";
import InstructorLayout from "./layouts/InstructorLayout.jsx";
import ProtectedRoute from "./components/ui/ProtectedRoute.jsx";

import Home from "./pages/Home/index.jsx";
import Login from "./pages/auth/Login/index.jsx";
import Register from "./pages/auth/Register/index.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      {
        path: "courses/:id",
        lazy: async () => {
          const module = await import("./pages/courses/CourseDetail/index.jsx");
          return { Component: module.default };
        },
      },
      {
        path: "courses/:courseId/lessons/:lessonId",
        lazy: async () => {
          const module = await import("./pages/courses/CourseLessonViewer/index.jsx");
          return { Component: module.default };
        },
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute role="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        lazy: async () => {
          const module = await import("./pages/admin/Dashboard/index.jsx");
          return { Component: module.default };
        },
      },
      {
        path: "users",
        lazy: async () => {
          const module = await import("./pages/admin/Users/index.jsx");
          return { Component: module.default };
        },
      },
      {
        path: "courses",
        lazy: async () => {
          const module = await import("./pages/admin/Courses/index.jsx");
          return { Component: module.default };
        },
      },
    ],
  },
  {
    path: "/student",
    element: (
      <ProtectedRoute role="student">
        <StudentLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        lazy: async () => {
          const module = await import("./pages/student/Dashboard/index.jsx");
          return { Component: module.default };
        },
      },
      {
        path: "my-courses",
        lazy: async () => {
          const module = await import("./pages/student/MyCourses/index.jsx");
          return { Component: module.default };
        },
      },
      {
        path: "courses/:courseId/lessons/:lessonId",
        lazy: async () => {
          const [module, { loader }] = await Promise.all([
            import("./pages/student/LessonViewer/index.jsx"),
            import("./pages/student/LessonViewer/loader.js"),
          ]);
          return {
            Component: module.default,
            ErrorBoundary: module.ErrorBoundary,
            loader,
          };
        },
      },
      {
        path: "courses/:id",
        lazy: async () => {
          const [module, { loader }] = await Promise.all([
            import("./pages/student/CourseDetails/index.jsx"),
            import("./pages/student/CourseDetails/loader.js"),
          ]);
          return {
            Component: module.default,
            ErrorBoundary: module.ErrorBoundary,
            loader,
          };
        },
      },
      {
        path: "profile",
        lazy: async () => {
          const module = await import("./pages/student/Profile/index.jsx");
          return { Component: module.default };
        },
      },
    ],
  },
  {
    path: "/instructor",
    element: (
      <ProtectedRoute role="instructor">
        <InstructorLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        lazy: async () => {
          const module = await import("./pages/instructor/Dashboard/index.jsx");
          return { Component: module.default };
        },
      },
      {
        path: "my-courses",
        lazy: async () => {
          const module = await import("./pages/instructor/MyCourses/index.jsx");
          return { Component: module.default };
        },
      },
      {
        path: "profile",
        lazy: async () => {
          const module = await import("./pages/instructor/Profile/index.jsx");
          return { Component: module.default };
        },
      },
      {
        path: "courses/:courseId/content",
        lazy: async () => {
          const module = await import("./pages/instructor/CourseContent/index.jsx");
          return { Component: module.default };
        },
      },
    ],
  },
  {
    path: "*",
    element: (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-bg-primary">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-accent mb-4">404</h1>
          <p className="text-xl text-neutral-500 dark:text-muted mb-6">Page not found</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors duration-150"
          >
            Go Home
          </a>
        </div>
      </div>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
