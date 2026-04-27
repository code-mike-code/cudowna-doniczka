
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, '../src/assets/article-photos');
const outputDir = path.join(__dirname, '../src/assets/optimized/article-photos');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function optimizeImages() {
  try {
    const files = fs.readdirSync(inputDir);
    
    for (const file of files) {
      if (file.match(/\.(jpg|jpeg|png)$/i)) {
        const inputPath = path.join(inputDir, file);
        const filename = path.parse(file).name;
        const outputPath = path.join(outputDir, `${filename}.webp`);
        
        console.log(`Processing: ${file}`);
        
        await sharp(inputPath)
          .resize(1200, null, { // Max width 1200px, maintain aspect ratio
            withoutEnlargement: true
          })
          .webp({ quality: 80 })
          .toFile(outputPath);
          
        console.log(`Saved: ${outputPath}`);
      }
    }
    
    console.log('Optimization complete!');
    
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

optimizeImages();
