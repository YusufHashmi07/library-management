import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  const dashboardPath = user?.role === "admin" ? "/admin/dashboard" : "/user/home";

  return (
    <section className="hero-shell py-5">
      <div className="container">
        <div className="hero-card p-4 p-md-5 shadow-sm">
          <p className="hero-tag">Library Management System</p>
          <h1 className="display-5 fw-bold mb-3">Discover, Manage, and Track Every Book Journey</h1>
          <p className="lead text-secondary mb-4">
            A secure role-based platform for students, readers, and admins to manage books, issues, and returns.
          </p>
          <div className="d-flex flex-wrap gap-2">
            {!isAuthenticated && (
              <>
                <Link className="btn btn-primary" to="/login">Login</Link>
                <Link className="btn btn-outline-primary" to="/register">Create User Account</Link>
              </>
            )}
            {isAuthenticated && (
              <Link className="btn btn-primary" to={dashboardPath}>Go to Dashboard</Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
