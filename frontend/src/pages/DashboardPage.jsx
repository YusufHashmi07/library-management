import { useEffect, useState } from "react";
import { fetchDashboardStats } from "../api/libraryApi";
import Loader from "../components/Loader";
import ErrorAlert from "../components/ErrorAlert";
import StatCard from "../components/StatCard";

const DashboardPage = () => {
  const [stats, setStats] = useState({ totalBooks: 0, issuedBooks: 0, returnedBooks: 0, totalStudents: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const response = await fetchDashboardStats();
        setStats(response.data.data);
      } catch (apiError) {
        setError(apiError.response?.data?.message || "Failed to fetch dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <section>
      <h2 className="mb-4">Dashboard</h2>
      <ErrorAlert message={error} />
      {loading ? (
        <Loader />
      ) : (
        <div className="row g-3">
          <StatCard title="Total Books" value={stats.totalBooks} color="stat-books" />
          <StatCard title="Issued Books" value={stats.issuedBooks} color="stat-issued" />
          <StatCard title="Returned Books" value={stats.returnedBooks} color="stat-returned" />
          <StatCard title="Total Students" value={stats.totalStudents} color="stat-students" />
        </div>
      )}
    </section>
  );
};

export default DashboardPage;
