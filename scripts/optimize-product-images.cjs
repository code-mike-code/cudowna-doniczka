const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const inputDir = path.join(__dirname, '../src/assets/product-img');
const outputDir = path.join(__dirname, '../src/assets/optimized/product-img');

const config = {
  webp: { 
    quality: 85, 
    effort: 6  // Higher effort = better compression (0-6)
  },
  sizes: [400, 800, 1200] // Responsive sizes for gallery
};

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

  // Generate optimized versions for each size
  for (const width of config.sizes) {
    const outputName = `${baseName}-${width}.webp`;
    const outputPath = path.join(outputDir, outputName);

    try {
      // Skip if target width is larger than original
      if (width > dimensions.width) {
        console.log(`   ⏭️  Skipping ${outputName} - larger than original`);
        continue;
      }

      // Process image
      await sharp(inputPath)
        .resize(width, null, {
          withoutEnlargement: true,
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

  // Also create a default size (800px) without suffix for simple usage
  const defaultOutputName = `${baseName}.webp`;
  const defaultOutputPath = path.join(outputDir, defaultOutputName);
  
  try {
    await sharp(inputPath)
      .resize(800, null, {
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp(config.webp)
      .toFile(defaultOutputPath);

    const defaultStats = await fs.stat(defaultOutputPath);
    const defaultSizeKB = (defaultStats.size / 1024).toFixed(2);
    console.log(`   ✅ ${defaultOutputName}: ${defaultSizeKB} KB (default size)`);
  } catch (error) {
    console.error(`   ❌ Error processing ${defaultOutputName}: ${error.message}`);
  }
}

async function main() {
  console.log('\n🚀 Starting product image optimization...\n');
  console.log(`Input directory:  ${inputDir}`);
  console.log(`Output directory: ${outputDir}`);
  console.log(`WebP quality:     ${config.webp.quality}\n`);

  // Create output directory
  await ensureDirectory(outputDir);

  // Get all PNG files from input directory
  let imageFiles;
  try {
    const files = await fs.readdir(inputDir);
    imageFiles = files.filter(file => file.endsWith('.png'));
    console.log(`Found ${imageFiles.length} PNG images to process\n`);
  } catch (error) {
    console.error(`❌ Error reading input directory: ${error.message}`);
    process.exit(1);
  }

  // Process each image
  for (const imageName of imageFiles) {
    await optimizeImage(imageName);
  }

  console.log('\n✨ Product image optimization complete!\n');
}

// Run the script
main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
