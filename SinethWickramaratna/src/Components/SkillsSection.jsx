import './SkillsSection.css';
import { useState, useEffect } from 'react';

function SkillsSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const skillCategories = [
    {
      category: 'Programming Languages',
      icon: '💻',
      skills: [
        { name: 'Python', icon: '🐍' },
        { name: 'JavaScript', icon: '⚡' },
        { name: 'Java', icon: '☕' },
        { name: 'SQL', icon: '🗄️' },
        { name: 'R', icon: '📊' }
      ]
    },
    {
      category: 'Data Science & ML',
      icon: '🤖',
      skills: [
        { name: 'Machine Learning', icon: '🧠' },
        { name: 'Data Analysis', icon: '📈' },
        { name: 'Statistics', icon: '📊' },
        { name: 'Pandas', icon: '🐼' },
        { name: 'NumPy', icon: '🔢' },
        { name: 'Scikit-learn', icon: '🎯' }
      ]
    },
    {
      category: 'Web Development',
      icon: '🌐',
      skills: [
        { name: 'React', icon: '⚛️' },
        { name: 'HTML/CSS', icon: '🎨' },
        { name: 'Node.js', icon: '🟢' },
        { name: 'Express', icon: '🚀' },
        { name: 'REST API', icon: '🔌' }
      ]
    },
    {
      category: 'Tools & Platforms',
      icon: '🛠️',
      skills: [
        { name: 'Git', icon: '🌳' },
        { name: 'Jupyter Notebook', icon: '📓' },
        { name: 'VS Code', icon: '💾' },
        { name: 'TensorFlow', icon: '🔷' },
        { name: 'Docker', icon: '🐳' }
      ]
    },
    {
      category: 'Databases',
      icon: '🗃️',
      skills: [
        { name: 'MySQL', icon: '🐬' },
        { name: 'MongoDB', icon: '🍃' },
        { name: 'PostgreSQL', icon: '🐘' },
        { name: 'Firebase', icon: '🔥' }
      ]
    },
    {
      category: 'Design & Visualization',
      icon: '🎭',
      skills: [
        { name: 'Figma', icon: '✨' },
        { name: 'Matplotlib', icon: '📉' },
        { name: 'Seaborn', icon: '🎨' },
        { name: 'Data Visualization', icon: '📊' },
        { name: 'Tableau', icon: '📐' }
      ]
    }
  ];

  return (
    <section className="skills-section">
      <div className="skills-container">
        <div className={`skills-header ${isLoaded ? 'loaded' : ''}`}>
          <h2 className="skills-title">Skills & Expertise</h2>
          <div className="skills-accent"></div>
        </div>

        <div className={`skills-content ${isLoaded ? 'loaded' : ''}`}>
          {skillCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="skill-category">
              <div className="category-header">
                <span className="category-icon">{category.icon}</span>
                <h3 className="category-title">{category.category}</h3>
              </div>
              <div className="skills-cards-grid">
                {category.skills.map((skill, skillIndex) => (
                  <div 
                    key={skillIndex} 
                    className="skill-card"
                    style={{ animationDelay: `${(categoryIndex * 0.1 + skillIndex * 0.05)}s` }}
                  >
                    <div className="skill-logo">{skill.icon}</div>
                    <h4 className="skill-name">{skill.name}</h4>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SkillsSection;
