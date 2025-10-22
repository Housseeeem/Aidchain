const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const users = []; // dummy in-memory store

// // Ajoute cet utilisateur admin/admin au démarrage
// (async () => {
//     const hashed = await bcrypt.hash('admin', 10);
//     users.push({ id: 1, username: 'admin', password: hashed, role: 'admin' });
// })();

const register = async (req, res) => {
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = { id: users.length + 1, username, password: hashed };
    users.push(user);
    res.json({ message: 'User registered', userId: user.id });
};

const login = async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user) return res.status(400).json({ message: 'User not found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Logged in', token });
};

module.exports = { register, login };
