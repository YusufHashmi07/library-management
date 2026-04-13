import { useEffect, useState } from "react";
import { addBook, deleteBook, getAllBooks, updateBook } from "../api/libraryApi";
import Loader from "../components/Loader";
import ErrorAlert from "../components/ErrorAlert";

const initialForm = { title: "", author: "", category: "", ISBN: "", quantity: 1 };

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadBooks = async () => {
    try {
      setLoading(true);
      const response = await getAllBooks();
      setBooks(response.data.data);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const validate = () => {
    if (!form.title || !form.author || !form.category || !form.ISBN) {
      return "All fields are required";
    }

    if (Number(form.quantity) < 0) {
      return "Quantity must be zero or greater";
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
      setError("");
      const payload = { ...form, quantity: Number(form.quantity) };

      if (editingId) {
        await updateBook(editingId, payload);
      } else {
        await addBook(payload);
      }

      setForm(initialForm);
      setEditingId(null);
      await loadBooks();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to save book");
    }
  };

  const onEdit = (book) => {
    setForm({
      title: book.title,
      author: book.author,
      category: book.category,
      ISBN: book.ISBN,
      quantity: book.quantity,
    });
    setEditingId(book._id);
  };

  const onDelete = async (id) => {
    try {
      await deleteBook(id);
      await loadBooks();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to delete book");
    }
  };

  return (
    <section>
      <h2 className="mb-3">Book Management</h2>
      <ErrorAlert message={error} />

      <form className="card card-body shadow-sm mb-4" onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-12 col-md-6"><input className="form-control" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
          <div className="col-12 col-md-6"><input className="form-control" placeholder="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required /></div>
          <div className="col-12 col-md-4"><input className="form-control" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required /></div>
          <div className="col-12 col-md-4"><input className="form-control" placeholder="ISBN" value={form.ISBN} onChange={(e) => setForm({ ...form, ISBN: e.target.value })} required /></div>
          <div className="col-12 col-md-4"><input type="number" min="0" className="form-control" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required /></div>
        </div>
        <div className="mt-3 d-flex gap-2">
          <button type="submit" className="btn btn-primary">{editingId ? "Update Book" : "Add Book"}</button>
          {editingId && (
            <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setForm(initialForm); }}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <Loader />
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>ISBN</th>
                <th>Qty</th>
                <th>Available</th>
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
                  <td>{book.availability ? "Yes" : "No"}</td>
                  <td className="d-flex gap-2">
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => onEdit(book)}>Edit</button>
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onDelete(book._id)}>Delete</button>
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

export default BooksPage;
