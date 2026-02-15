import './StatItem.css';

function StatItem({ number, label, delay = 0 }) {
  return (
    <div className="stat-item" style={{ animationDelay: `${delay}s` }}>
      <div className="stat-number">{number}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default StatItem;
