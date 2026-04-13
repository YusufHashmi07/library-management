import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginAccount } from "../api/libraryApi";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import ErrorAlert from "../components/ErrorAlert";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const validate = () => {
    if (!formData.email || !formData.password) {
      return "Email and password are required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email address";
    }

    if (formData.password.length < 8) {
      return "Password must be at least 8 characters";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await loginAccount(formData);
      login(response.data.token, response.data.user);
      const nextPath = response.data.user.role === "admin" ? "/admin/dashboard" : "/user/home";
      navigate(nextPath);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow p-4 login-card">
        <h3 className="mb-3 text-center">Secure Account Login</h3>
        <ErrorAlert message={error} />
        {loading && <Loader />}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>Sign In</button>
          <p className="small mt-3 mb-0 text-center">New user? <Link to="/register">Register here</Link></p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
