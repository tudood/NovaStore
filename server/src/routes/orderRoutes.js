const express = require('express');
const router = express.Router();

const db = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');

// 创建订单
router.post('/', authMiddleware, async (req, res) => {
  let connection;
  let transactionStarted = false;

try {
  connection = await db.getConnection();
    const {
            recipientName,
            phone,
            shippingAddress,
            items
        } = req.body;

        const userId = req.user.userId;

    // 开启事务
    await connection.beginTransaction();
    transactionStarted = true;

    // 计算订单总价
    // 校验购物车商品
    if (!Array.isArray(items) || items.length === 0) {
        if (connection) {
        await connection.rollback();
        }

        return res.status(400).json({
            message: 'Cart cannot be empty'
        });
    }

// 从数据库获取商品真实价格
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
    if (
        !Number.isInteger(Number(item.id)) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
    ) {
        throw new Error('Invalid product or quantity');
    }

    const [products] = await connection.execute(
        'SELECT id, price, stock FROM products WHERE id = ? FOR UPDATE',
        [item.id]
    );

    if (products.length === 0) {
        throw new Error('Product not found');
    }

    const product = products[0];

    if (product.stock < item.quantity) {
        throw new Error('Insufficient stock');
    }

    const price = Number(product.price);

    totalAmount += price * item.quantity;

    orderItems.push({
        id: product.id,
        quantity: item.quantity,
        price
    });
}

    // 创建订单
    const [orderResult] = await connection.execute(
      `INSERT INTO orders
      (user_id, total_amount, recipient_name, phone, shipping_address)
      VALUES (?, ?, ?, ?, ?)`,
      [
        userId,
        totalAmount,
        recipientName,
        phone,
        shippingAddress
      ]
    );

    const orderId = orderResult.insertId;

    // 保存订单商品
    for (const item of orderItems) {
    await connection.execute(
        `INSERT INTO order_items
        (order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)`,
            [
            orderId,
            item.id,
            item.quantity,
            item.price
            ]
        );
        // 扣减商品库存
    await connection.execute(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
            [item.quantity, item.id]
        );
    }

    // 提交事务
    await connection.commit();
    transactionStarted = false;

    res.status(201).json({
      message: 'Order created successfully!',
      orderId,
      totalAmount
    });

  } catch (error) {
  if (connection && transactionStarted) {
    await connection.rollback();
  }

  console.error('Create order error:', error);

  if (error.message === 'Invalid product or quantity') {
    return res.status(400).json({
      message: error.message
    });
  }

  if (error.message === 'Product not found') {
    return res.status(404).json({
      message: error.message
    });
  }

  if (error.message === 'Insufficient stock') {
    return res.status(409).json({
      message: error.message
    });
  }

  return res.status(500).json({
    message: 'Failed to create order'
  });
} finally {
        if (connection) {
    connection.release();
    }
  }
});
// 获取当前用户的订单列表

// 获取当前用户的订单列表
router.get('/my', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;

        const [orders] = await db.execute(
            `SELECT *
             FROM orders
             WHERE user_id = ?
             ORDER BY created_at DESC`,
            [userId]
        );

        // 查询每笔订单对应的商品信息
        for (const order of orders) {
            const [items] = await db.execute(
                `SELECT
                    oi.product_id,
                    p.name,
                    p.image_url,
                    oi.quantity,
                    oi.price
                 FROM order_items oi
                 JOIN products p ON oi.product_id = p.id
                 WHERE oi.order_id = ?`,
                [order.id]
            );

            order.items = items;
        }

        res.status(200).json({
            message: 'Orders retrieved successfully',
            orders
        });

    } catch (error) {
        console.error('Get orders error:', error);

        res.status(500).json({
            message: 'Failed to retrieve orders'
        });
    }
});

// 获取订单详情
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const orderId = req.params.id;

        const [orders] = await db.execute(
            `SELECT *
             FROM orders
             WHERE id = ? AND user_id = ?`,
            [orderId, userId]
        );

        if (orders.length === 0) {
            return res.status(404).json({
                message: 'Order not found'
            });
        }

        const [items] = await db.execute(
            `SELECT
                oi.product_id,
                p.name,
                p.image_url,
                oi.quantity,
                oi.price
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?`,
            [orderId]
        );

        res.status(200).json({
            message: 'Order details retrieved successfully',
            order: orders[0],
            items
        });

    } catch (error) {
        console.error('Get order details error:', error);

        res.status(500).json({
            message: 'Failed to retrieve order details'
        });
    }
});
module.exports = router;