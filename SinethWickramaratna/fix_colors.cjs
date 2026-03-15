const fs = require('fs');
const path = require('path');

const cssDir = path.join('e:', 'Projects', 'Portfolio', 'SinethWickramaratna', 'src', 'Components');

const replaceColorsInFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace strict hex values and rgb parts:
  content = content.replace(/#00ff88/gi, 'var(--primary)');
  content = content.replace(/rgba\(0,\s*255,\s*136/gi, 'rgba(59, 130, 246');
  
  content = content.replace(/#00ffcc/gi, 'var(--secondary)');
  content = content.replace(/#00ffff/gi, 'var(--secondary)');
  content = content.replace(/#00ccff/gi, 'var(--secondary)');
  content = content.replace(/rgba\(0,\s*204,\s*255/gi, 'rgba(139, 92, 246');
  content = content.replace(/rgba\(0,\s*255,\s*255/gi, 'rgba(139, 92, 246');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated colors in ${filePath}`);
  }
};

const walkSync = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walkSync(filePath);
    } else if (filePath.endsWith('.css')) {
      replaceColorsInFile(filePath);
    }
  }
};

// Also do index.css, theme.css, and About.css if applicable
try { replaceColorsInFile(path.join('e:', 'Projects', 'Portfolio', 'SinethWickramaratna', 'src', 'index.css')); } catch(e){}
try { replaceColorsInFile(path.join('e:', 'Projects', 'Portfolio', 'SinethWickramaratna', 'src', 'theme.css')); } catch(e){}
walkSync(cssDir);

console.log("Done updating colors!");
