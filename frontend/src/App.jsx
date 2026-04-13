import { Navigate, Route, Routes } from "react-router-dom";
import AppNavbar from "./components/AppNavbar";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BooksPage from "./pages/BooksPage";
import StudentsPage from "./pages/StudentsPage";
import IssuesPage from "./pages/IssuesPage";
import UserHomePage from "./pages/UserHomePage";
import NotFoundPage from "./pages/NotFoundPage";

const AdminShell = ({ children }) => (
  <div className="app-bg min-vh-100">
    <AppNavbar />
    <div className="container pb-4">{children}</div>
  </div>
);

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminShell>
              <DashboardPage />
            </AdminShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/books"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminShell>
              <BooksPage />
            </AdminShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminShell>
              <StudentsPage />
            </AdminShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/issues"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminShell>
              <IssuesPage />
            </AdminShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/user/home"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <AdminShell>
              <UserHomePage />
            </AdminShell>
          </ProtectedRoute>
        }
      />

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default App;
