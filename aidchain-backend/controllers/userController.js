const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../collections/User');

/**
 * Register a new user
 * @route POST /users/register
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const register = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Validation
        if (!username || !password) {
            return res.status(400).json({ 
                error: 'Username and password are required' 
            });
        }

        if (password.length < 6) {
            return res.status(400).json({ 
                error: 'Password must be at least 6 characters long' 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ 
                error: 'Username already exists' 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            password: hashedPassword
        });

        await newUser.save();

        console.log(`User created: ${username}`);
        
        return res.status(201).json({ 
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                username: newUser.username
            }
        });

    } catch (error) {
        console.error('Error in register controller:', error);
        
        // Handle duplicate key error (in case unique index catches it)
        if (error.code === 11000) {
            return res.status(409).json({ 
                error: 'Username already exists' 
            });
        }
        
        return res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
};

/**
 * Login user and return JWT token
 * @route POST /users/login
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation
        if (!username || !password) {
            return res.status(400).json({ 
                error: 'Username and password are required' 
            });
        }

        // Find user in MongoDB
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ 
                error: 'Invalid username or password' 
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ 
                error: 'Invalid username or password' 
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user._id,
                username: user.username 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        console.log(`User logged in: ${username}`);

        return res.status(200).json({ 
            message: 'Logged in successfully',
            token,
            user: {
                id: user._id,
                username: user.username
            }
        });

    } catch (error) {
        console.error('Error in login controller:', error);
        return res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
};

module.exports = { register, login };
