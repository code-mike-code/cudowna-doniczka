import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.join(__dirname, '../src/assets/event-photos');
const outputDir = path.join(__dirname, '../src/assets/optimized/event-photos');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Get all jpg files from event-photos directory
const files = fs.readdirSync(inputDir).filter(file => file.endsWith('.jpg'));

console.log(`Found ${files.length} images to optimize...`);

// Process each image
Promise.all(
  files.map(async (file) => {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file.replace('.jpg', '.webp'));
    
    try {
      await sharp(inputPath)
        .webp({ quality: 85, effort: 6 })
        .toFile(outputPath);
      
      const inputStats = fs.statSync(inputPath);
      const outputStats = fs.statSync(outputPath);
      const savings = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);
      
      console.log(`✓ ${file} -> ${path.basename(outputPath)} (${savings}% smaller)`);
    } catch (error) {
      console.error(`✗ Error processing ${file}:`, error.message);
    }
  })
).then(() => {
  console.log('\n✓ All images optimized successfully!');
}).catch(error => {
  console.error('Error:', error);
  process.exit(1);
});

