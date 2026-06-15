import './VolunteeringCard.css';

function VolunteeringCard({ item, index }) {
  const isLeft = index % 2 === 0;
  
  return (
    <div 
      className={`timeline-item ${isLeft ? 'timeline-left' : 'timeline-right'}`}
      style={{ animationDelay: `${index * 0.2}s` }}
    >
      <div className="timeline-marker">
        <div className="timeline-dot">
          <div className="timeline-dot-inner">{item.icon}</div>
        </div>
      </div>
      
      <div className="volunteering-card shogun-card">
        <div className="hud-corner top-left"></div>
        <div className="hud-corner top-right"></div>
        <div className="hud-corner bottom-left"></div>
        <div className="hud-corner bottom-right"></div>
        <div className="card-content">
          <div className="card-header">
            <h3 className="position-title">{item.position}</h3>
            <div className="date-badge">
              <span className="start-date">
                {item.startDate.month} {item.startDate.year}
              </span>
              <span className="date-separator">→</span>
              <span className="end-date">
                {item.endDate.year === 'Present' ? 'Present' : `${item.endDate.month} ${item.endDate.year}`}
              </span>
            </div>
          </div>
          
          <p className="organization-name">{item.organization}</p>
          <p className="position-description">{item.description}</p>
        </div>
      </div>
    </div>
  );
}

export default VolunteeringCard;
