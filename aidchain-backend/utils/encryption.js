const crypto = require('crypto');

// Utilise une clé et un IV (initialization vector) pour le chiffrement symétrique
const algorithm = 'aes-256-cbc';
const secretKey = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex').slice(0, 32);
const iv = crypto.randomBytes(16);

// 🔒 Fonction de chiffrement
function encrypt(text) {
    if (!text) return '';
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    // On renvoie l'IV avec le texte chiffré pour pouvoir déchiffrer plus tard
    return iv.toString('hex') + ':' + encrypted;
}

// 🔓 Fonction de déchiffrement
function decrypt(encryptedText) {
    if (!encryptedText) return '';
    const [ivHex, encrypted] = encryptedText.split(':');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey), Buffer.from(ivHex, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = { encrypt, decrypt };
