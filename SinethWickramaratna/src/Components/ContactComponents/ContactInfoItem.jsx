import './ContactInfoItem.css';

function ContactInfoItem({ info, index }) {
  return (
    <div 
      className="contact-info-item" 
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="info-icon">
        {info.icon}
      </div>
      <div className="info-content">
        <p className="info-label">{info.label}</p>
        {info.link ? (
          <a href={info.link} className="info-value">
            {info.value}
          </a>
        ) : (
          <p className="info-value">{info.value}</p>
        )}
      </div>
    </div>
  );
}

export default ContactInfoItem;
