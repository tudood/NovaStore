const express = require('express');
const router = express.Router();

const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');

// 用户注册
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 检查必填信息
    if (!username || !email || !password) {
        if (password.length < 8 || password.length > 72) {
    return res.status(400).json({
        message: 'Password must be between 8 and 72 characters'
        });
    }
      return res.status(400).json({
        message: 'Please provide all required fields'
      });
    }

    // 检查邮箱是否已经注册
    const [users] = await db.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (users.length > 0) {
      return res.status(409).json({
        message: 'Email already registered'
      });
    }

    // 对密码进行哈希处理
    const hashedPassword = await bcrypt.hash(password, 10);

    // 保存用户
    const [result] = await db.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    res.status(201).json({
      message: 'Registration successful',
      userId: result.insertId
    });

  } catch (error) {
    console.error('Register error:', error);

    res.status(500).json({
      message: 'Registration failed'
    });
  }
});
// 用户登录
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 检查必填信息
    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide email and password'
      });
    }

    // 根据邮箱查询用户
    const [users] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const user = users[0];

    // 验证密码
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // 生成 JWT Token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);

    res.status(500).json({
      message: 'Login failed'
    });
  }
});
// 获取当前登录用户信息
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const [users] = await db.execute(
      'SELECT id, username, email FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.json({
      message: 'User profile retrieved successfully',
      user: users[0]
    });

  } catch (error) {
    console.error('Profile error:', error);

    res.status(500).json({
      message: 'Failed to retrieve user profile'
    });
  }
});
module.exports = router;