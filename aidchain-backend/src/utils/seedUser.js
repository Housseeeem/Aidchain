require('dotenv').config();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/User');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const passwordHash = await bcrypt.hash('123456', 10);

  const user = new User({
    email: 'admin@aidchain.com',
    passwordHash,
    firstName: 'Aid',
    lastName: 'Admin',
    role: 'admin',
  });
  await user.save();
  console.log('✅ Seeded user:', user.email);
  await mongoose.disconnect();
})();
