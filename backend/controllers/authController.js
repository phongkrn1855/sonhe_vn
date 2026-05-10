import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import nodemailer from 'nodemailer';
import pool from '../config/database.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const register = async (req, res, next) => {
    try {
        const { phone, password, name, shop_name } = req.body;
        const [existing] = await pool.query('SELECT id FROM users WHERE phone = ?', [phone]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Phone number already registered' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query(
            'INSERT INTO users (phone, password, name, shop_name) VALUES (?, ?, ?, ?)',
            [phone, hashedPassword, name, shop_name]
        );
        
        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { phone, password } = req.body;
        const [users] = await pool.query('SELECT * FROM users WHERE phone = ?', [phone]);
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const user = users[0];
        const isMatch = await bcrypt.hash(password, 10) // wait, bcrypt.compare is correct.
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: user.id, phone: user.phone }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
    } catch (error) {
        next(error);
    }
};

export const logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
};

export const getMe = async (req, res, next) => {
    try {
        const [users] = await pool.query('SELECT id, phone, email, name, shop_name, created_at FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json({ user: users[0] });
    } catch (error) {
        next(error);
    }
};

export const googleLogin = async (req, res, next) => {
    try {
        const { token } = req.body;
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const { sub, email, name, picture } = ticket.getPayload();

        // Check if user exists
        let [users] = await pool.query('SELECT * FROM users WHERE google_id = ? OR email = ?', [sub, email]);
        let user;

        if (users.length === 0) {
            // Create new user
            const [result] = await pool.query(
                'INSERT INTO users (google_id, email, name, password) VALUES (?, ?, ?, ?)',
                [sub, email, name, 'google-auth-' + Math.random().toString(36).slice(-8)]
            );
            const [newUser] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
            user = newUser[0];
        } else {
            user = users[0];
            if (!user.google_id) {
                await pool.query('UPDATE users SET google_id = ? WHERE id = ?', [sub, user.id]);
            }
        }

        const jwtToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        res.cookie('token', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
    } catch (error) {
        next(error);
    }
};

export const sendOTP = async (req, res, next) => {
    try {
        const { email } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Check if user exists, if not create a skeleton
        let [users] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            await pool.query('INSERT INTO users (email, password, name) VALUES (?, ?, ?)', [email, 'otp-auth-' + Math.random().toString(36).slice(-8), 'User ' + email.split('@')[0]]);
        }

        await pool.query('UPDATE users SET otp_code = ?, otp_expiry = ? WHERE email = ?', [otp, expiry, email]);

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Mã xác thực SoNhe.vn',
            text: `Mã OTP của bạn là: ${otp}. Mã có hiệu lực trong 10 phút.`
        });

        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        next(error);
    }
};

export const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const [users] = await pool.query('SELECT * FROM users WHERE email = ? AND otp_code = ? AND otp_expiry > NOW()', [email, otp]);

        if (users.length === 0) {
            return res.status(401).json({ error: 'Mã OTP không hợp lệ hoặc đã hết hạn' });
        }

        const user = users[0];
        // Clear OTP
        await pool.query('UPDATE users SET otp_code = NULL, otp_expiry = NULL WHERE id = ?', [user.id]);

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const { password: _, otp_code: __, otp_expiry: ___, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
    } catch (error) {
        next(error);
    }
};
