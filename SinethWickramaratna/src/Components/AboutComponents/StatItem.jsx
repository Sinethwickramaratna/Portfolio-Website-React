import './StatItem.css';

function StatItem({ number, label, icon, delay = 0 }) {
  return (
    <div className="stat-item" style={{ animationDelay: `${delay}s` }}>
      {icon && <div className="stat-icon">{icon}</div>}
      <div className="stat-content">
        <div className="stat-number">{number}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}

export default StatItem;
