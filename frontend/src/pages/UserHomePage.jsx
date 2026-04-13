import { useEffect, useState } from "react";
import {
  getMyIssues,
  getMyProfile,
  getPublicBooks,
  issueBookAsUser,
  returnBookAsUser,
} from "../api/libraryApi";
import ErrorAlert from "../components/ErrorAlert";
import Loader from "../components/Loader";

const UserHomePage = () => {
  const [profile, setProfile] = useState(null);
  const [books, setBooks] = useState([]);
  const [issues, setIssues] = useState([]);
  const [activeBook, setActiveBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const loadUserData = async () => {
    try {
      setLoading(true);
      const [profileRes, booksRes, issuesRes] = await Promise.all([
        getMyProfile(),
        getPublicBooks(),
        getMyIssues(),
      ]);
      setProfile(profileRes.data.data);
      setBooks(booksRes.data.data);
      setIssues(issuesRes.data.data);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to load user dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const issuedBookIds = new Set(
    issues.filter((item) => item.status === "issued").map((item) => item.book?._id).filter(Boolean)
  );

  const handleIssueBook = async (bookId) => {
    try {
      setActionLoading(true);
      setError("");
      await issueBookAsUser(bookId);
      await loadUserData();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to issue book");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturnBook = async (issueId) => {
    try {
      setActionLoading(true);
      setError("");
      await returnBookAsUser(issueId);
      await loadUserData();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to return book");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <section>
      <h2 className="mb-3">User Dashboard</h2>
      <ErrorAlert message={error} />
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <h5 className="mb-1">Welcome, {profile?.name}</h5>
              <p className="text-secondary mb-0">Logged in as {profile?.email}</p>
            </div>
          </div>

          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <h5 className="mb-3">Available Books (Issue / Read)</h5>
              <div className="table-responsive">
                <table className="table table-striped align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Category</th>
                      <th>ISBN</th>
                      <th>Qty</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book) => (
                      <tr key={book._id}>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.category}</td>
                        <td>{book.ISBN}</td>
                        <td>{book.quantity}</td>
                        <td className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-primary"
                            onClick={() => handleIssueBook(book._id)}
                            disabled={book.quantity <= 0 || issuedBookIds.has(book._id) || actionLoading}
                          >
                            {issuedBookIds.has(book._id) ? "Issued" : "Issue"}
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => setActiveBook(book)}
                          >
                            Read
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="mb-3">My Issued Books (Return / Read)</h5>
              <div className="table-responsive">
                <table className="table table-striped align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>Book</th>
                      <th>Author</th>
                      <th>Issue Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {issues.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center text-muted py-3">
                          No books issued yet.
                        </td>
                      </tr>
                    ) : (
                      issues.map((item) => (
                        <tr key={item._id}>
                          <td>{item.book?.title || "N/A"}</td>
                          <td>{item.book?.author || "N/A"}</td>
                          <td>{new Date(item.issueDate).toLocaleDateString()}</td>
                          <td>
                            <span className={`badge ${item.status === "issued" ? "text-bg-warning" : "text-bg-success"}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="d-flex gap-2">
                            {item.status === "issued" ? (
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-success"
                                onClick={() => handleReturnBook(item._id)}
                                disabled={actionLoading}
                              >
                                Return
                              </button>
                            ) : (
                              <span className="small text-muted">Returned</span>
                            )}
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => setActiveBook(item.book || null)}
                              disabled={!item.book}
                            >
                              Read
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {activeBook && (
            <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true">
              <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Read Book Details</h5>
                    <button type="button" className="btn-close" onClick={() => setActiveBook(null)} />
                  </div>
                  <div className="modal-body">
                    <p className="mb-2"><strong>Title:</strong> {activeBook.title}</p>
                    <p className="mb-2"><strong>Author:</strong> {activeBook.author}</p>
                    <p className="mb-2"><strong>Category:</strong> {activeBook.category}</p>
                    <p className="mb-0"><strong>ISBN:</strong> {activeBook.ISBN}</p>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setActiveBook(null)}>
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default UserHomePage;
