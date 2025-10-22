const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/accessRequests.json');

// === Helper functions ===
const readRequests = () => {
    try {
        if (!fs.existsSync(filePath)) return [];
        const data = fs.readFileSync(filePath, 'utf-8');
        return data ? JSON.parse(data) : [];
    } catch (err) {
        console.error('❌ Error reading requests file:', err);
        return [];
    }
};

const writeRequests = (requests) => {
    try {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log('📁 Folder created:', dir);
        }

        fs.writeFileSync(filePath, JSON.stringify(requests, null, 2));
        console.log('✅ File updated:', filePath);
    } catch (err) {
        console.error('❌ Error writing requests file:', err);
    }
};

// === Controllers ===
const requestAccess = (req, res) => {
    const { fileId } = req.body;
    const userId = req.user?.id;

    if (!fileId || !userId) {
        return res.status(400).json({ message: 'fileId and valid user required' });
    }

    const accessRequests = readRequests();

    // Vérifier si une requête existe déjà
    const existing = accessRequests.find(r => String(r.fileId) === String(fileId) && String(r.userId) === String(userId));
    if (existing) {
        return res.status(409).json({ message: 'Request already exists for this user and file' });
    }

    const newRequest = { fileId, userId, status: 'pending', createdAt: new Date() };
    accessRequests.push(newRequest);
    writeRequests(accessRequests);

    res.json({ message: 'Access requested', request: newRequest });
};

const approveAccess = (req, res) => {
    const { fileId, userId } = req.body;
    if (!fileId || !userId) {
        return res.status(400).json({ message: 'fileId and userId required' });
    }

    const accessRequests = readRequests();
    const reqItem = accessRequests.find(
        r => String(r.fileId) === String(fileId) && String(r.userId) === String(userId)
    );

    if (!reqItem) {
        return res.status(404).json({ message: 'Request not found' });
    }

    reqItem.status = 'approved';
    reqItem.approvedAt = new Date();
    writeRequests(accessRequests);

    res.json({ message: 'Access approved', fileId, userId });
};

module.exports = { requestAccess, approveAccess };
