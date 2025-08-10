const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..');
const destDir = path.join(__dirname, '..', 'public', 'js');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const jsFiles = ['main.js', 'main-updated.js', 'validation-clean.js'];

jsFiles.forEach(file => {
  const srcPath = path.join(sourceDir, file);
  const destPath = path.join(destDir, file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log("Copied " + file + " to public/js/");
  } else {
    console.log("File " + file + " not found in root directory.");
  }
});
