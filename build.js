const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, 'build');
const cssDir = path.join(buildDir, 'static', 'css');
const jsDir = path.join(buildDir, 'static', 'js');
const panelHtmlPath = path.join(__dirname, 'src', 'panel.html');
const configHtmlPath = path.join(__dirname, 'src', 'config.html');
const mobileHtmlPath = path.join(__dirname, 'src', 'mobile.html');
const outputHtmlPath = path.join(buildDir, 'panel.html');
const outputMobileHtmlPath = path.join(buildDir, 'mobile.html');
const configOutputHtmlPath = path.join(buildDir, 'config.html');

const findLatestFile = (dir, ext) => {
  const files = fs.readdirSync(dir).filter(file => file.endsWith(ext));
  return files.find(file => file.includes('main')) || files[0];
};

const cssFile = findLatestFile(cssDir, '.css');
const jsFile = findLatestFile(jsDir, '.js');

let panelHtml = fs.readFileSync(panelHtmlPath, 'utf8');
let configHtml = fs.readFileSync(configHtmlPath, 'utf8');
let mobileHtml = fs.readFileSync(mobileHtmlPath, 'utf8');

if (cssFile) {
  panelHtml = panelHtml.replace('[static_css]', `./static/css/${cssFile}`);
  configHtml = configHtml.replace('[static_css]', `./static/css/${cssFile}`);
  mobileHtml = mobileHtml.replace('[static_css]', `./static/css/${cssFile}`);
}
if (jsFile) {
  panelHtml = panelHtml.replace('[static_js]', `./static/js/${jsFile}`);
  configHtml = configHtml.replace('[static_js]', `./static/js/${jsFile}`);
  mobileHtml = mobileHtml.replace('[static_js]', `./static/js/${jsFile}`);
}

fs.writeFileSync(outputHtmlPath, panelHtml, 'utf8');
fs.writeFileSync(configOutputHtmlPath, configHtml, 'utf-8');
fs.writeFileSync(outputMobileHtmlPath, mobileHtml, 'utf8');

console.log('panel.html updated successfully.');