import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AppNavbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";

  const onLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark app-nav mb-4">
      <div className="container-fluid">
        <span className="navbar-brand fw-bold">{isAdmin ? "Library Admin" : "Library Portal"}</span>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><NavLink className="nav-link" to="/">Home</NavLink></li>
            {isAdmin ? (
              <>
                <li className="nav-item"><NavLink className="nav-link" to="/admin/dashboard">Dashboard</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/admin/books">Books</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/admin/students">Students</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/admin/issues">Issues</NavLink></li>
              </>
            ) : (
              <li className="nav-item"><NavLink className="nav-link" to="/user/home">My Dashboard</NavLink></li>
            )}
          </ul>
          <button type="button" className="btn btn-sm btn-light" onClick={onLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;
