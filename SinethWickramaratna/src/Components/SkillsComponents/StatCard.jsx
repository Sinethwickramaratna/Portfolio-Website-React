import './StatCard.css';

function StatCard({ stat, index }) {
  return (
    <div className="stat-card" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="stat-icon">{stat.icon}</div>
      <div className="stat-content">
        <div className="stat-value">{stat.value}</div>
        <div className="stat-label">{stat.label}</div>
      </div>
    </div>
  );
}

export default StatCard;
