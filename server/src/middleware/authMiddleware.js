const jwt = require('jsonwebtoken');

// 验证用户身份
const authMiddleware = (req, res, next) => {
  try {
    // 获取请求头中的 Token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Access denied. No token provided.'
      });
    }

    // 提取 Token
    const token = authHeader.split(' ')[1];

    // 验证 Token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // 保存用户信息，供后续接口使用
    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token'
    });
  }
};

module.exports = authMiddleware;