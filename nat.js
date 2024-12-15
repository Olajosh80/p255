const fs = require('fs');
const path = require('path');
const minify = require('html-minifier').minify;
const CleanCSS = require('clean-css');
const JavaScriptObfuscator = require('javascript-obfuscator');

// Generate a random string for obfuscation
function generateRandomString(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// Function to obfuscate inline CSS and JS
function obfuscateInlineAssets(htmlContent) {
  let obfuscatedHtml = htmlContent;

  // Obfuscate only inline JavaScript (<script> without src attribute)
  obfuscatedHtml = obfuscatedHtml.replace(
    /<script(?![^>]*src)(\b[^>]*)>([\s\S]*?)<\/script>/gi,
    (match, attributes, scriptContent) => {
      const obfuscatedJs = JavaScriptObfuscator.obfuscate(scriptContent, {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,
        numbersToExpressions: true,
        simplify: true,
        stringArray: true,
        stringArrayEncoding: ['base64'],
        stringArrayThreshold: 1,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 0.4,
        renameGlobals: true,
      }).getObfuscatedCode();

      return `<script${attributes}>${obfuscatedJs}</script>`;
    }
  );

  // Minify inline CSS (<style> blocks)
  obfuscatedHtml = obfuscatedHtml.replace(
    /<style\b[^>]*>([\s\S]*?)<\/style>/gi,
    (match, cssContent) => {
      const minifiedCss = new CleanCSS({ level: 2 }).minify(cssContent).styles;
      return `<style>${minifiedCss}</style>`;
    }
  );

  return obfuscatedHtml;
}

// Function to process HTML files
function obfuscateHtmlFiles(inputDir, outputDir) {
  fs.readdirSync(inputDir).forEach((file) => {
    const filePath = path.join(inputDir, file);
    const outputFilePath = path.join(outputDir, file);

    if (fs.statSync(filePath).isDirectory()) {
      if (!fs.existsSync(outputFilePath)) fs.mkdirSync(outputFilePath);
      obfuscateHtmlFiles(filePath, outputFilePath);
    } else if (path.extname(file) === '.html') {
      let htmlContent = fs.readFileSync(filePath, 'utf-8');

      // Step 1: Obfuscate inline JS and CSS
      htmlContent = obfuscateInlineAssets(htmlContent);

      // Step 2: Minify the final HTML
      const obfuscatedHtml = minify(htmlContent, {
        collapseWhitespace: true,
        removeComments: true,
        removeAttributeQuotes: true,
        minifyJS: false, // Inline JS already obfuscated
        minifyCSS: false, // Inline CSS already processed
      });

      fs.writeFileSync(outputFilePath, obfuscatedHtml, 'utf-8');
      console.log(`Processed HTML: ${outputFilePath}`);
    }
  });
}

// Input and Output Folders
const inputFolder = path.join(__dirname, 'public'); // Original HTML files
const outputFolder = path.join(__dirname, 'dist');  // Processed files

if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder);

// Run the obfuscation process
obfuscateHtmlFiles(inputFolder, outputFolder);
console.log('Obfuscation completed.');
