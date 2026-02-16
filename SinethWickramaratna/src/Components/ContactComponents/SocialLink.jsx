import './SocialLink.css';

function SocialLink({ social, index }) {
  return (
    <a
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      className="social-link"
      title={social.name}
      style={{ 
        animationDelay: `${index * 0.1}s`,
        '--social-color': social.color 
      }}
    >
      <div className="social-icon">
        <img src={social.image} alt={social.name} />
      </div>
    </a>
  );
}

export default SocialLink;
