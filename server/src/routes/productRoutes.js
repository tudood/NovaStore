const express = require('express');
const router = express.Router();

const pool = require('../config/db');

// 获取商品列表
router.get('/', async (req, res) => {
    try {
        const [products] = await pool.query(
            'SELECT * FROM products'
        );

        res.json({
            success: true,
            message: '获取商品成功',
            data: products
        });

    } catch (error) {
        console.error('获取商品失败：', error);

        res.status(500).json({
            success: false,
            message: '服务器内部错误'
        });
    }
});
// 根据商品 ID 获取商品详情
router.get('/:id', async (req, res) => {
    try {
        // 获取 URL 中的商品 ID
        const { id } = req.params;
        if (!Number.isInteger(Number(id)) || Number(id) < 1) {
    return res.status(400).json({
        success: false,
        message: '商品 ID 无效'
    });
}

        // 查询数据库
        const [products] = await pool.query(
            'SELECT * FROM products WHERE id = ?',
            [id]
        );

        // 商品不存在
        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: '商品不存在'
            });
        }

        // 返回商品信息
        res.json({
            success: true,
            message: '获取商品详情成功',
            data: products[0]
        });

    } catch (error) {
        console.error('获取商品详情失败：', error);

        res.status(500).json({
            success: false,
            message: '服务器内部错误'
        });
    }
});
module.exports = router;