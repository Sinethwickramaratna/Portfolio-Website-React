import './SkillCard.css';

function SkillCard({ skill, categoryIndex, skillIndex }) {
  return (
    <div 
      className="skill-card-hex"
      style={{ animationDelay: `${(categoryIndex * 0.15 + skillIndex * 0.05)}s` }}
      data-cursor="execute"
    >
      <div className="card-hex-inner">
        {/* Front Panel: Metal armor shell with logo */}
        <div className="panel-front">
          <div className="hex-border-overlay"></div>
          <div className="skill-logo">
            <img 
              src={skill.icon} 
              alt={`${skill.name} Logo`} 
              className="skill-logo-img" 
              width="55"
              height="55"
              loading="lazy"
            />
          </div>
          <h4 className="skill-name font-display">{skill.name}</h4>
          <div className="hex-hud-marker monospace-val">[READY]</div>
        </div>

        {/* Back Panel: Revealed intelligence log */}
        <div className="panel-back">
          <div className="back-glow-grid"></div>
          <span className="back-spec monospace-val">// SPEC_DATA //</span>
          <p className="skill-desc-text">{skill.description || 'Combat skill module active.'}</p>
          <div className="tech-level-bar">
            <span className="level-fill" style={{ width: '85%' }}></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkillCard;
