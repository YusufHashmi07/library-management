import { useEffect, useState } from "react";
import { getAllBooks, getAllIssues, getAllStudents, issueBook, returnBook } from "../api/libraryApi";
import Loader from "../components/Loader";
import ErrorAlert from "../components/ErrorAlert";

const IssuesPage = () => {
  const [books, setBooks] = useState([]);
  const [students, setStudents] = useState([]);
  const [issues, setIssues] = useState([]);
  const [form, setForm] = useState({ bookId: "", studentId: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [booksRes, studentsRes, issuesRes] = await Promise.all([getAllBooks(), getAllStudents(), getAllIssues()]);
      setBooks(booksRes.data.data);
      setStudents(studentsRes.data.data);
      setIssues(issuesRes.data.data);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to load issue data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleIssue = async (event) => {
    event.preventDefault();

    if (!form.bookId || !form.studentId) {
      setError("Select both book and student");
      return;
    }

    try {
      setError("");
      await issueBook(form);
      setForm({ bookId: "", studentId: "" });
      await loadData();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to issue book");
    }
  };

  const handleReturn = async (issueId) => {
    try {
      setError("");
      await returnBook({ issueId });
      await loadData();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to return book");
    }
  };

  return (
    <section>
      <h2 className="mb-3">Issue / Return Management</h2>
      <ErrorAlert message={error} />

      <form className="card card-body shadow-sm mb-4" onSubmit={handleIssue}>
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-5">
            <label className="form-label">Select Book</label>
            <select className="form-select" value={form.bookId} onChange={(e) => setForm({ ...form, bookId: e.target.value })} required>
              <option value="">Choose book</option>
              {books.map((book) => (
                <option key={book._id} value={book._id}>{book.title} ({book.quantity} left)</option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-5">
            <label className="form-label">Select Student</label>
            <select className="form-select" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} required>
              <option value="">Choose student</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>{student.name} ({student.enrollmentNumber})</option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-2">
            <button type="submit" className="btn btn-primary w-100">Issue</button>
          </div>
        </div>
      </form>

      {loading ? (
        <Loader />
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Book</th>
                <th>Student</th>
                <th>Issue Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((item) => (
                <tr key={item._id}>
                  <td>{item.book?.title || "N/A"}</td>
                  <td>{item.student?.name || "N/A"}</td>
                  <td>{new Date(item.issueDate).toLocaleDateString()}</td>
                  <td>{item.returnDate ? new Date(item.returnDate).toLocaleDateString() : "-"}</td>
                  <td>
                    <span className={`badge ${item.status === "issued" ? "text-bg-warning" : "text-bg-success"}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    {item.status === "issued" ? (
                      <button type="button" className="btn btn-sm btn-outline-success" onClick={() => handleReturn(item._id)}>
                        Return Book
                      </button>
                    ) : (
                      "Completed"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default IssuesPage;
