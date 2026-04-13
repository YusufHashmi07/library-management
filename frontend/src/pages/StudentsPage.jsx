import { useEffect, useState } from "react";
import { addStudent, deleteStudent, getAllStudents, updateStudent } from "../api/libraryApi";
import Loader from "../components/Loader";
import ErrorAlert from "../components/ErrorAlert";

const initialForm = { name: "", email: "", phone: "", enrollmentNumber: "" };

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await getAllStudents();
      setStudents(response.data.data);
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const validate = () => {
    if (!form.name || !form.email || !form.phone || !form.enrollmentNumber) {
      return "All fields are required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      return "Please enter a valid email";
    }

    const phoneRegex = /^[0-9+\-\s]{7,15}$/;
    if (!phoneRegex.test(form.phone)) {
      return "Phone should be 7 to 15 characters and numeric format";
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
      if (editingId) {
        await updateStudent(editingId, form);
      } else {
        await addStudent(form);
      }

      setForm(initialForm);
      setEditingId(null);
      await loadStudents();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to save student");
    }
  };

  const onEdit = (student) => {
    setForm({
      name: student.name,
      email: student.email,
      phone: student.phone,
      enrollmentNumber: student.enrollmentNumber,
    });
    setEditingId(student._id);
  };

  const onDelete = async (id) => {
    try {
      await deleteStudent(id);
      await loadStudents();
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Failed to delete student");
    }
  };

  return (
    <section>
      <h2 className="mb-3">Student Management</h2>
      <ErrorAlert message={error} />

      <form className="card card-body shadow-sm mb-4" onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-12 col-md-6"><input className="form-control" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
          <div className="col-12 col-md-6"><input className="form-control" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></div>
          <div className="col-12 col-md-6"><input className="form-control" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></div>
          <div className="col-12 col-md-6"><input className="form-control" placeholder="Enrollment Number" value={form.enrollmentNumber} onChange={(e) => setForm({ ...form, enrollmentNumber: e.target.value })} required /></div>
        </div>
        <div className="mt-3 d-flex gap-2">
          <button type="submit" className="btn btn-primary">{editingId ? "Update Student" : "Add Student"}</button>
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
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Enrollment #</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.phone}</td>
                  <td>{student.enrollmentNumber}</td>
                  <td className="d-flex gap-2">
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => onEdit(student)}>Edit</button>
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onDelete(student._id)}>Delete</button>
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

export default StudentsPage;
