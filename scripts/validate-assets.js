const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const projectRoot = path.resolve(__dirname, '..');
const publicDirs = {
  css: path.join(projectRoot, 'public', 'css'),
  js: path.join(projectRoot, 'public', 'js'),
  images: path.join(projectRoot, 'public', 'images'),
};

const htmlFiles = fs.readdirSync(projectRoot).filter(f => f.endsWith('.html'));

function fileExistsInPublic(filePath) {
  if (!filePath) return false;
  if (filePath.startsWith('/css/')) {
    return fs.existsSync(path.join(publicDirs.css, filePath.replace('/css/', '')));
  }
  if (filePath.startsWith('/js/')) {
    return fs.existsSync(path.join(publicDirs.js, filePath.replace('/js/', '')));
  }
  if (filePath.startsWith('/images/')) {
    return fs.existsSync(path.join(publicDirs.images, filePath.replace('/images/', '')));
  }
  return false;
}

function validateAssets() {
  htmlFiles.forEach(file => {
    const filePath = path.join(projectRoot, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const $ = cheerio.load(content);
    const assets = [];

    $('link[rel="stylesheet"]').each((i, el) => {
      assets.push($(el).attr('href'));
    });
    $('script[src]').each((i, el) => {
      assets.push($(el).attr('src'));
    });
    $('img[src]').each((i, el) => {
      assets.push($(el).attr('src'));
    });

    assets.forEach(asset => {
      if (!fileExistsInPublic(asset)) {
        console.warn('Missing asset in ' + file + ': ' + asset);
      }
    });
  });
}

validateAssets();
