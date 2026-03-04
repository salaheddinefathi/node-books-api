const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/authMiddleware');

// @route   GET /api/analytics
// @desc    Get dashboard analytics (admin only)
router.get('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfYesterday = new Date(startOfToday);
        startOfYesterday.setDate(startOfYesterday.getDate() - 1);

        const startOfThisWeek = new Date(now);
        startOfThisWeek.setDate(now.getDate() - 7);
        const startOfLastWeek = new Date(startOfThisWeek);
        startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        // Helper for period aggregation
        const getSalesForPeriod = async (start, end) => {
            const match = {
                status: { $in: ['confirmed', 'delivered'] },
                createdAt: { $gte: start }
            };
            if (end) match.createdAt.$lt = end;

            const result = await Order.aggregate([
                { $match: match },
                { $group: { _id: null, totalSales: { $sum: "$total" }, count: { $sum: 1 } } }
            ]);
            return result.length > 0 ? result[0] : { totalSales: 0, count: 0 };
        };

        const [
            totalData,
            dailyData,
            yesterdayData,
            weeklyData,
            lastWeekData,
            monthlyData,
            lastMonthData
        ] = await Promise.all([
            getSalesForPeriod(new Date(0)),
            getSalesForPeriod(startOfToday),
            getSalesForPeriod(startOfYesterday, startOfToday),
            getSalesForPeriod(startOfThisWeek),
            getSalesForPeriod(startOfLastWeek, startOfThisWeek),
            getSalesForPeriod(startOfThisMonth),
            getSalesForPeriod(startOfLastMonth, startOfThisMonth)
        ]);

        const calculateTrend = (current, previous) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return ((current - previous) / previous) * 100;
        };

        // Top Selling Books (Aggregate from Orders)
        const topBooks = await Order.aggregate([
            { $match: { status: { $in: ['confirmed', 'delivered'] } } },
            { $unwind: "$items" },
            { $group: { _id: "$items.book", title: { $first: "$items.title" }, totalSold: { $sum: "$items.quantity" } } },
            { $sort: { totalSold: -1 } },
            { $limit: 5 }
        ]);

        res.json({
            totalRevenue: totalData.totalSales,
            totalOrders: totalData.count,
            dailyRevenue: dailyData.totalSales,
            weeklyRevenue: weeklyData.totalSales,
            monthlyRevenue: monthlyData.totalSales,
            trends: {
                daily: calculateTrend(dailyData.totalSales, yesterdayData.totalSales),
                weekly: calculateTrend(weeklyData.totalSales, lastWeekData.totalSales),
                monthly: calculateTrend(monthlyData.totalSales, lastMonthData.totalSales)
            },
            topBooks
        });

    } catch (err) {
        console.error('Analytics Error:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
