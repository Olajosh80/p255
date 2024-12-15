const fs = require('fs');
const path = require('path');
const glob = require('glob');
const JavaScriptObfuscator = require('javascript-obfuscator');
const CleanCSS = require('clean-css');
const { minify } = require('html-minifier');

const SOURCE_DIR = path.resolve(__dirname, './src');
const OUTPUT_DIR = path.resolve(__dirname, './dist');

function copyAndMinifyHTML(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const minifiedHtml = minify(html, {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeEmptyAttributes: true,
    minifyCSS: true,
    minifyJS: true,
  });

  const outputPath = filePath.replace(SOURCE_DIR, OUTPUT_DIR);
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, minifiedHtml, 'utf8');
  console.log(`Minified HTML: ${filePath} ➡️ ${outputPath}`);
}

function copyAndMinifyCSS(filePath) {
  const css = fs.readFileSync(filePath, 'utf8');
  const minifiedCss = new CleanCSS({}).minify(css).styles;

  const outputPath = filePath.replace(SOURCE_DIR, OUTPUT_DIR);
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, minifiedCss, 'utf8');
  console.log(`Minified CSS: ${filePath} ➡️ ${outputPath}`);
}

function obfuscateJS(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const obfuscatedCode = JavaScriptObfuscator.obfuscate(code, {
    compact: true,
    controlFlowFlattening: true,
    deadCodeInjection: true,
    debugProtection: true,
    disableConsoleOutput: true,
    stringArray: true,
    stringArrayThreshold: 0.75,
    selfDefending: true,
  }).getObfuscatedCode();

  const outputPath = filePath.replace(SOURCE_DIR, OUTPUT_DIR);
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, obfuscatedCode, 'utf8');
  console.log(`Obfuscated JS: ${filePath} ➡️ ${outputPath}`);
}

function copyOtherFiles(filePath) {
  const outputPath = filePath.replace(SOURCE_DIR, OUTPUT_DIR);
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  fs.copyFileSync(filePath, outputPath);
  console.log(`Copied file: ${filePath} ➡️ ${outputPath}`);
}

function processFiles() {
  // Process HTML files
  glob(`${SOURCE_DIR}/**/*.html`, (err, files) => {
    if (err) throw err;
    files.forEach(file => copyAndMinifyHTML(file));
  });

  // Process CSS files
  glob(`${SOURCE_DIR}/**/*.css`, (err, files) => {
    if (err) throw err;
    files.forEach(file => copyAndMinifyCSS(file));
  });

  // Process JS files
  glob(`${SOURCE_DIR}/**/*.js`, (err, files) => {
    if (err) throw err;
    files.forEach(file => obfuscateJS(file));
  });

  // Copy all other static files (images, fonts, etc.)
  glob(`${SOURCE_DIR}/**/*.*`, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      if (!file.endsWith('.js') && !file.endsWith('.html') && !file.endsWith('.css')) {
        copyOtherFiles(file);
      }
    });
  });
}

function startBuild() {
  console.log('⚙️ Starting build process...');
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
    console.log('🧹 Cleaned previous /dist folder');
  }
  processFiles();
}

startBuild();
