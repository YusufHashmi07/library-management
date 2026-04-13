import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="d-flex min-vh-100 align-items-center justify-content-center app-bg">
      <div className="text-center">
        <h1 className="display-4 fw-bold">404</h1>
        <p className="lead">Page not found</p>
        <Link className="btn btn-primary" to="/">Go to Dashboard</Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
