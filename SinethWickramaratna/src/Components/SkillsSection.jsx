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

function SkillsSection() {
  const [skillsRef, isSkillsInView] = useInView();

  const stats = [
    { label: 'Total Skills', value: '27', icon: '⭐' },
    { label: 'Categories', value: '6', icon: '🎯' },
    { label: 'Technologies', value: '20+', icon: '🚀' }
  ];

  const skillCategories = [
    {
      category: 'Programming Languages',
      icon: '💻',
      skills: [
        { name: 'Python', icon: pythonLogo, description: 'Data science, ML & web development' },
        { name: 'JavaScript', icon: javaScriptLogo, description: 'Frontend & backend development'},
        { name: 'Java', icon: javaLogo, description: 'Enterprise applications'},
        { name: 'SQL', icon: sqlLogo, description: 'Database management & querying'}
      ]
    },
    {
      category: 'Data Science & ML',
      icon: '🤖',
      skills: [
        { name: 'Machine Learning', icon: machineLearningIcon, description: 'Building ML models'},
        { name: 'Data Analysis', icon: dataAnalysisIcon, description: 'Data analysis & visualization'},
        { name: 'Statistics', icon: statisticsIcon, description: 'Statistical analysis & insights'},
        { name: 'Pandas', icon: pandasIcon, description: 'Data manipulation & analysis'},
        { name: 'NumPy', icon: numpyIcon, description: 'Numerical computing'},
        { name: 'Scikit-learn', icon: scikitLearnIcon, description: 'ML algorithms'}
      ]
    },
    {
      category: 'Web Development',
      icon: '🌐',
      skills: [
        { name: 'React', icon: reactIcon, description: 'Building interactive UIs'},
        { name: 'HTML', icon: htmlIcon, description: 'Web content structure' },
        { name: 'CSS', icon: cssIcon, description: 'Web page styling' },
        { name: 'Node.js', icon: nodejsIcon, description: 'Server-side development'},
        { name: 'Express', icon: expressIcon, description: 'Web application framework'},
        { name: 'Spring Boot', icon: springBootIcon, description: 'Java web applications'}
      ]
    },
    {
      category: 'Tools & Platforms',
      icon: '🛠️',
      skills: [
        { name: 'Git', icon: gitIcon, description: 'Version control & collaboration' },
        { name: 'Jupyter Notebook', icon: jupyterIcon, description: 'Interactive data analysis'},
        { name: 'VS Code', icon: vscodeIcon, description: 'Code editing & debugging' },
        { name: 'Docker', icon: dockerIcon, description: 'Containerization & deployment'}
      ]
    },
    {
      category: 'Databases',
      icon: '🗃️',
      skills: [
        { name: 'MySQL', icon: mysqlIcon, description: 'Relational databases'},
        { name: 'PostgreSQL', icon: postgresqlIcon, description: 'Advanced databases'},
      ]
    },
    {
      category: 'Design & Visualization',
      icon: '🎭',
      skills: [
        { name: 'Figma', icon: figmaIcon, description: 'UI/UX design & prototyping'},
        { name: 'Matplotlib', icon: matplotlibIcon, description: 'Data visualization'},
        { name: 'Seaborn', icon: seabornIcon, description: 'Statistical visualization'},
        { name: 'Photoshop', icon: photoshopIcon, description: 'Image editing & design'},
        { name: 'Canva', icon: canvaIcon, description: 'Visual design creation'}
      ]
    }
  ];

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
