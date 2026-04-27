const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const inputDir = path.join(__dirname, '../src/assets');
const outputDir = path.join(__dirname, '../src/assets/optimized');

const config = {
  webp: { 
    quality: 85, 
    effort: 6  // Higher effort = better compression (0-6)
  },
  responsive: {
    'hero-img.jpg': [640, 1280, 1920], // 3 sizes for hero (LCP element)
    'default': [400] // single size for other images
  }
};

// Images to optimize
const imagesToOptimize = [
  'hero-img.jpg',
  'flowerpots-collection-1.png',
  'flowerpots-collection-2.png',
  'flowerpots-collection-3.png',
  'family-painting-flowerpots-picnic.png',
  'flowerpots-herb-garden.png',
  'generated-image.jpeg'
];

async function ensureDirectory(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
    console.log(`✅ Directory created/verified: ${dir}`);
  } catch (error) {
    console.error(`❌ Error creating directory: ${error.message}`);
    throw error;
  }
}

async function getImageDimensions(imagePath) {
  try {
    const metadata = await sharp(imagePath).metadata();
    return { width: metadata.width, height: metadata.height };
  } catch (error) {
    console.error(`❌ Error getting dimensions for ${imagePath}: ${error.message}`);
    return null;
  }
}

async function optimizeImage(imageName) {
  const inputPath = path.join(inputDir, imageName);
  const baseName = path.parse(imageName).name;
  
  // Check if input file exists
  try {
    await fs.access(inputPath);
  } catch {
    console.warn(`⚠️  Skipping ${imageName} - file not found`);
    return;
  }

  // Get original file size
  const stats = await fs.stat(inputPath);
  const originalSizeKB = (stats.size / 1024).toFixed(2);
  
  // Get image dimensions
  const dimensions = await getImageDimensions(inputPath);
  if (!dimensions) return;

  console.log(`\n🖼️  Processing: ${imageName} (${originalSizeKB} KB, ${dimensions.width}x${dimensions.height})`);

  // Get responsive sizes for this image
  const sizes = config.responsive[imageName] || config.responsive.default;
  
  for (const width of sizes) {
    const outputName = sizes.length > 1 
      ? `${baseName}-${width}.webp`
      : `${baseName}.webp`;
    const outputPath = path.join(outputDir, outputName);

    try {
      // Process image
      await sharp(inputPath)
        .resize(width, null, {
          withoutEnlargement: true, // Don't upscale if original is smaller
          fit: 'inside'
        })
        .webp(config.webp)
        .toFile(outputPath);

      // Get output file size
      const outputStats = await fs.stat(outputPath);
      const outputSizeKB = (outputStats.size / 1024).toFixed(2);
      const savings = ((1 - outputStats.size / stats.size) * 100).toFixed(1);

      console.log(`   ✅ ${outputName}: ${outputSizeKB} KB (${savings}% smaller)`);
    } catch (error) {
      console.error(`   ❌ Error processing ${outputName}: ${error.message}`);
    }
  }
}

async function generateSummary() {
  console.log('\n📊 Generating summary...\n');
  
  try {
    // Get total size of original images
    let originalTotal = 0;
    for (const imageName of imagesToOptimize) {
      try {
        const stats = await fs.stat(path.join(inputDir, imageName));
        originalTotal += stats.size;
      } catch {
        // Skip if file doesn't exist
      }
    }

    // Get total size of optimized images
    const optimizedFiles = await fs.readdir(outputDir);
    let optimizedTotal = 0;
    for (const file of optimizedFiles) {
      if (file.endsWith('.webp')) {
        const stats = await fs.stat(path.join(outputDir, file));
        optimizedTotal += stats.size;
      }
    }

    const originalMB = (originalTotal / 1024 / 1024).toFixed(2);
    const optimizedMB = (optimizedTotal / 1024 / 1024).toFixed(2);
    const savings = ((1 - optimizedTotal / originalTotal) * 100).toFixed(1);

    console.log('═'.repeat(60));
    console.log('📈 OPTIMIZATION SUMMARY');
    console.log('═'.repeat(60));
    console.log(`Original size:   ${originalMB} MB`);
    console.log(`Optimized size:  ${optimizedMB} MB`);
    console.log(`Savings:         ${savings}% reduction`);
    console.log(`Files created:   ${optimizedFiles.length} WebP images`);
    console.log('═'.repeat(60));
    console.log('\n✨ Optimization complete!\n');
    console.log('Next steps:');
    console.log('1. Check src/assets/optimized/ for WebP images');
    console.log('2. Update React components to use <picture> elements');
    console.log('3. Run Lighthouse to verify improvements\n');
  } catch (error) {
    console.error(`❌ Error generating summary: ${error.message}`);
  }
}

async function main() {
  console.log('\n🚀 Starting image optimization...\n');
  console.log(`Input directory:  ${inputDir}`);
  console.log(`Output directory: ${outputDir}`);
  console.log(`WebP quality:     ${config.webp.quality}`);
  console.log(`Images to process: ${imagesToOptimize.length}\n`);

  // Create output directory
  await ensureDirectory(outputDir);

  // Process each image
  for (const imageName of imagesToOptimize) {
    await optimizeImage(imageName);
  }

  // Generate summary
  await generateSummary();
}

// Run the script
main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
