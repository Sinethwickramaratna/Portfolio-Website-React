# Sineth Wickramaratna - Portfolio

A modern, fully responsive portfolio website showcasing projects, skills, experience, and expertise in software development, hardware design, and supply chain management.

## 🌐 Live Demo

Visit the portfolio: [Your Portfolio URL]

## ✨ Features

- **Modern Design**: Sleek, gradient-based UI with smooth animations and transitions
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **Project Showcase**: Display of completed and ongoing projects with GitHub links
- **Skills Section**: Comprehensive skills categorized by expertise area
- **About Section**: Professional background and statistics
- **Certificates & Achievements**: Display of professional certifications
- **Volunteering Experience**: Showcase of volunteer work and contributions
- **Design Gallery**: Interactive 3D carousel and gallery of design works
- **Contact Section**: Easy-to-use contact form with multiple ways to connect
- **Blog Section**: Share articles and insights (coming soon)
- **Smooth Animations**: Fade-in effects, scroll animations, and hover transitions

## 🛠️ Tech Stack

- **Frontend**: React 18, JavaScript/JSX
- **Build Tool**: Vite
- **Styling**: CSS3 with modern gradients and animations
- **State Management**: React Hooks (useState, useEffect, useRef)
- **Routing**: React Router (for page navigation)
- **Data Format**: JSON for dynamic content (skills, projects, certificates, etc.)

## 📁 Project Structure

```
SinethWickramaratna/
├── src/
│   ├── components/
│   │   ├── AboutSection.jsx
│   │   ├── BlogSection.jsx
│   │   ├── CertificatesSection.jsx
│   │   ├── ContactSection.jsx
│   │   ├── GalleryPage.jsx
│   │   ├── HeroSection.jsx
│   │   ├── ImageCarousel3D.jsx
│   │   ├── ProjectsSection.jsx
│   │   ├── SkillsSection.jsx
│   │   ├── VolunteeringSection.jsx
│   │   ├── public/
│   │   │   ├── NavBar.jsx
│   │   │   └── Footer.jsx
│   │   ├── AboutComponents/
│   │   ├── ContactComponents/
│   │   ├── SkillsComponents/
│   │   └── VolunteeringComponents/
│   ├── data/
│   │   ├── certificatesData.json
│   │   ├── contactData.json
│   │   ├── galleryImages.json
│   │   ├── projectsData.json
│   │   ├── skillsData.json
│   │   └── volunteeringData.json
│   ├── hooks/
│   │   └── useInView.js
│   ├── assets/
│   │   ├── Images/
│   │   ├── Certificates/
│   │   ├── Logos/
│   │   └── Icons/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── vite.config.js
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sinethwickramaratna/Portfolio.git
   cd SinethWickramaratna
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The portfolio will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 📊 Projects Included

### 1. 4-bit Nano Processor Implementation
- **Category**: Hardware Design
- **Status**: Completed (2024)
- **Technologies**: VHDL, FPGA, Digital Logic
- **Repository**: [GitHub Link](https://github.com/NirmalKBandara/microProcessorDesign.git)

### 2. Student Task Management
- **Category**: Full-Stack Development
- **Status**: In Progress (2025)
- **Technologies**: Flutter, Spring Boot, Java 17, PostgreSQL, JWT
- **Repository**: [GitHub Link](https://github.com/Sinethwickramaratna/Student-Task-Manager.git)

### 3. Maze Solver Using Floodfill Algorithm
- **Category**: Algorithm & Data Structures
- **Status**: Completed (2024)
- **Technologies**: C++, BFS, Pathfinding
- **Repository**: [GitHub Link](https://github.com/Sinethwickramaratna/Maze-solving-algorithm-using-Flood-Fill-algorithm.git)

### 4. KandyPack Railway
- **Category**: Supply Chain Management
- **Status**: In Progress (2025)
- **Technologies**: React, TypeScript, Python, FastAPI, WebSocket
- **Repository**: [GitHub Link](#)

## 📝 Customization

### Update Personal Information

Edit the data files in `src/data/` to customize content:

- **Skills**: `skillsData.json`
- **Projects**: `projectsData.json`
- **Certificates**: `certificatesData.json`
- **Volunteering**: `volunteeringData.json`
- **Contact Info**: `contactData.json`
- **Gallery**: `galleryImages.json`

### Update Links

Replace placeholder URLs and links:
- GitHub repositories in projects
- Social media links in footer
- Email and contact information
- Portfolio images and assets

### Customize Styling

Main style files:
- `src/index.css` - Global styles
- `src/theme.css` - Theme variables
- Component-specific CSS files in `src/Components/`

## 🎨 Color Scheme

The portfolio uses a modern teal and cyan color palette:
- Primary: `#0d7377` (Teal)
- Accent: `#20b2aa` (Light Teal)
- Secondary: `#17a2b8` (Light Blue)
- Background: Dark gradients with transparency

## 📱 Responsive Breakpoints

- **Mobile**: < 480px
- **Tablet**: 480px - 768px
- **Desktop**: 768px - 1024px
- **Large Desktop**: > 1024px

## 🔗 Social Links

Update social media links in:
- `src/Components/public/Footer.jsx`
- `src/Components/ContactSection.jsx`
- `src/data/contactData.json`

## 📄 License

This portfolio is personal work created in 2025. Feel free to use it as inspiration for your own portfolio, but please credit and respect intellectual property rights.

## 🤝 Contributing

This is a personal portfolio, but suggestions and feedback are welcome! Feel free to:
- Report bugs or issues
- Suggest design improvements
- Request new features

## 📧 Contact

For inquiries, feedback, or collaborations:
- **Email**: [your-email@example.com]
- **GitHub**: [github.com/Sinethwickramaratna](https://github.com/Sinethwickramaratna)
- **LinkedIn**: [Your LinkedIn Profile]
- **Twitter/X**: [Your Twitter Handle]

## 🙏 Acknowledgments

- Built with React and Vite
- Inspired by modern portfolio designs
- Thanks to the open-source community

---

**Last Updated**: February 2026

Made with ❤️ by Sineth Wickramaratna
