const fs = require('fs');
const path = require('path');

const sourceDir = '.';
const destDir = './public/products';

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

fs.readdirSync(sourceDir).forEach(file => {
    if (file.startsWith('WhatsApp Image') && (file.endsWith('.jpeg') || file.endsWith('.jpg'))) {
        const sourcePath = path.join(sourceDir, file);
        const destPath = path.join(destDir, file);
        fs.renameSync(sourcePath, destPath);
        console.log(`Moved: ${file}`);
    }
});
