import './SkillCard.css';

function SkillCard({ skill, categoryIndex, skillIndex }) {
  return (
    <div 
      className="skill-card"
      style={{ animationDelay: `${(categoryIndex * 0.1 + skillIndex * 0.05)}s` }}
    >
      <div className="skill-logo">
        <img 
          src={skill.icon} 
          alt={`${skill.name} Logo`} 
          className="skill-logo-img" 
          width="80"
        />
      </div>
      <h4 className="skill-name">{skill.name}</h4>
      <p className="skill-description">{skill.description}</p>
    </div>
  );
}

export default SkillCard;
