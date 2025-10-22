const multer = require('multer');
const path = require('path');
const fs = require('fs');

const tempDir = path.join(__dirname, '..', 'temp_uploads');

// ✅ Créer le dossier s’il n’existe pas
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        // Remplacer les caractères spéciaux dans le nom du fichier
        const sanitized = file.originalname.replace(/[^\w.\-()]/g, '_');
        cb(null, `${uniqueSuffix}-${sanitized}`);
    }
});

const upload = multer({ storage });

module.exports = upload;
