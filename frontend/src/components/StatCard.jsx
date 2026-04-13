const StatCard = ({ title, value, color }) => {
  return (
    <div className="col-12 col-md-6 col-xl-3">
      <div className={`card stat-card border-0 shadow-sm ${color}`}>
        <div className="card-body">
          <h6 className="text-uppercase text-muted small mb-2">{title}</h6>
          <h2 className="mb-0 fw-bold">{value}</h2>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
