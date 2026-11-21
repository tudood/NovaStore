require('dotenv').config();
const productRoutes = require('./routes/productRoutes');
const express = require('express');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');


const pool = require('./config/db');

const app = express();

// 中间件
app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
// 测试服务器接口
app.get('/', (req, res) => {
    res.send('NovaStore API is running!');
});

// 测试数据库接口
app.get('/api/test-db', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT DATABASE() AS db');

        res.json({
            success: true,
            message: '数据库连接成功！',
            database: rows[0].db
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: '数据库连接失败'
        });
    }
});

// 启动服务器
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`NovaStore API running at http://localhost:${PORT}`);
});