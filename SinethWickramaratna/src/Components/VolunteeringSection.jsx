import './VolunteeringSection.css';
import { useInView } from '../hooks/useInView';

function VolunteeringSection() {
  const [volunteeringRef, isVolunteeringInView] = useInView({ once: true });

  const volunteeringData = [
    {
      id: 1,
      organization: 'Rotaract Club of University of Moratuwa',
      position: 'Public Relations Director',
      startDate: { year: 2024, month: 'January' },
      endDate: { year: 'Present', month: '' },
      icon: '🤝',
      description: 'Oversee strategic communications, branding, and outreach activities'
    },
    {
      id: 2,
      organization: 'University Community Service Program',
      position: 'Volunteer Coordinator',
      startDate: { year: 2023, month: 'June' },
      endDate: { year: 2024, month: 'December' },
      icon: '💼',
      description: 'Organized and coordinated community service initiatives'
    },
    {
      id: 3,
      organization: 'Tech Education Initiative',
      position: 'Instructor',
      startDate: { year: 2023, month: 'March' },
      endDate: { year: 'Present', month: '' },
      icon: '📚',
      description: 'Teaching programming and digital literacy to underprivileged students'
    }
  ];

  return (
    <section className="volunteering-section" id="volunteering" ref={volunteeringRef}>
      <div className="volunteering-container">
        <div className={`volunteering-header ${isVolunteeringInView ? 'loaded' : ''}`}>
          <h2 className="volunteering-title">Volunteering & Leadership</h2>
          <div className="volunteering-accent"></div>
        </div>

        <div className={`volunteering-content ${isVolunteeringInView ? 'loaded' : ''}`}>
          <div className="volunteering-list">
            {volunteeringData.map((item, index) => (
              <div key={item.id} className="volunteering-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="card-icon">{item.icon}</div>
                
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default VolunteeringSection;
