import './SkillsSection.css';
import { useInView } from '../hooks/useInView';
import StatCard from './SkillsComponents/StatCard';
import SkillCard from './SkillsComponents/SkillCard';
import pythonLogo from '../assets/Images/Skills/python-logo-only.svg'
import javaScriptLogo from '../assets/Images/Skills/javascript-logo.svg'
import javaLogo from '../assets/Images/Skills/java-logo.svg'
import sqlLogo from '../assets/Images/Skills/sql-logo.svg'
import machineLearningIcon from '../assets/Images/Skills/machine-learning-icon.svg'
import dataAnalysisIcon from '../assets/Images/Skills/data-analytics-icon.png'
import statisticsIcon from '../assets/Images/Skills/statistics-icon.png'
import pandasIcon from '../assets/Images/Skills/Pandas_mark.svg'
import numpyIcon from '../assets/Images/Skills/numpy-icon.svg'
import scikitLearnIcon from '../assets/Images/Skills/scikit-learn.svg'
import reactIcon from '../assets/Images/Skills/react.svg'
import htmlIcon from '../assets/Images/Skills/html5.svg'
import cssIcon from '../assets/Images/Skills/css3.svg'
import nodejsIcon from '../assets/Images/Skills/node.js.svg'
import expressIcon from '../assets/Images/Skills/express.svg'
import springBootIcon from '../assets/Images/Skills/Spring.svg'
import gitIcon from '../assets/Images/Skills/Git.svg'
import jupyterIcon from '../assets/Images/Skills/Jupyter.svg'
import vscodeIcon from '../assets/Images/Skills/VS Code.svg'
import dockerIcon from '../assets/Images/Skills/docker.svg'
import mysqlIcon from '../assets/Images/Skills/MySQL.svg'
import postgresqlIcon from '../assets/Images/Skills/PostgresSQL.svg'
import figmaIcon from '../assets/Images/Skills/Figma.svg'
import matplotlibIcon from '../assets/Images/Skills/matplotlib.svg'
import seabornIcon from '../assets/Images/Skills/seaborn.svg'
import photoshopIcon from '../assets/Images/Skills/Adobe Photoshop.svg'
import canvaIcon from '../assets/Images/Skills/canva.svg'
import skillsData from '../data/skillsData.json';

function SkillsSection() {
  const [skillsRef, isSkillsInView] = useInView();

  const iconMap = {
    'python-logo-only.svg': pythonLogo,
    'javascript-logo.svg': javaScriptLogo,
    'java-logo.svg': javaLogo,
    'sql-logo.svg': sqlLogo,
    'machine-learning-icon.svg': machineLearningIcon,
    'data-analytics-icon.png': dataAnalysisIcon,
    'statistics-icon.png': statisticsIcon,
    'Pandas_mark.svg': pandasIcon,
    'numpy-icon.svg': numpyIcon,
    'scikit-learn.svg': scikitLearnIcon,
    'react.svg': reactIcon,
    'html5.svg': htmlIcon,
    'css3.svg': cssIcon,
    'node.js.svg': nodejsIcon,
    'express.svg': expressIcon,
    'Spring.svg': springBootIcon,
    'Git.svg': gitIcon,
    'Jupyter.svg': jupyterIcon,
    'VS Code.svg': vscodeIcon,
    'docker.svg': dockerIcon,
    'MySQL.svg': mysqlIcon,
    'PostgresSQL.svg': postgresqlIcon,
    'Figma.svg': figmaIcon,
    'matplotlib.svg': matplotlibIcon,
    'seaborn.svg': seabornIcon,
    'Adobe Photoshop.svg': photoshopIcon,
    'canva.svg': canvaIcon
  };

  const stats = skillsData.stats;

  const skillCategories = skillsData.skillCategories.map((category) => ({
    ...category,
    skills: category.skills.map((skill) => ({
      ...skill,
      icon: iconMap[skill.iconFile]
    }))
  }));

  return (
    <section className="skills-section" id="skills" ref={skillsRef}>
      <div className="skills-container">
        <div className={`skills-header ${isSkillsInView ? 'loaded' : ''}`}>
          <h2 className="skills-title">Skills & Expertise</h2>
          <div className="skills-accent"></div>
          
          <div className={`stats-container ${isSkillsInView ? 'loaded' : ''}`}>
            {stats.map((stat, index) => (
              <StatCard key={index} stat={stat} index={index} />
            ))}
          </div>
        </div>

        <div className={`skills-content ${isSkillsInView ? 'loaded' : ''}`}>
          {skillCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="skill-category">
              <div className="category-header">
                <span className="category-icon">{category.icon}</span>
                <h3 className="category-title">{category.category}</h3>
              </div>
              <div className="skills-cards-grid">
                {category.skills.map((skill, skillIndex) => (
                  <SkillCard 
                    key={skillIndex} 
                    skill={skill} 
                    categoryIndex={categoryIndex}
                    skillIndex={skillIndex}
                  />
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
