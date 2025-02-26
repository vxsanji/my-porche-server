var express = require('express');
var router = express.Router();
var { Price } = require('../models/market');

router.get('/', async function (req, res, next) {
    const { symbol, start, end, interval } = req.query;
    
    try {
        let data = await Price.aggregate([
            {
                $match: {
                    "metadata.symbol": symbol,
                    timestamp: {
                        $gte: new Date(start), // ✅ Convert to Date
                        $lte: new Date(end)    
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$timestamp" },
                        month: { $month: "$timestamp" },
                        day: { $dayOfMonth: "$timestamp" }
                    },
                    open: { $first: "$open" },
                    high: { $max: "$high" },
                    low: { $min: "$low" },
                    close: { $last: "$close" }
                }
            },
            {
                $project: {
                    _id: 0,
                    time: {
                        $dateToString: {
                            format: "%Y-%m-%d", // ✅ Convert to "yyyy-mm-dd"
                            date: {
                                $dateFromParts: {
                                    year: "$_id.year",
                                    month: "$_id.month",
                                    day: "$_id.day"
                                }
                            }
                        }
                    },
                    open: 1,
                    high: 1,
                    low: 1,
                    close: 1
                }
            },
            {
                $sort: { time: 1 }
            }
        ]);

        if (data.length > 0) {
            res.status(200).json({
                message: 'Successfully retrieved data',
                data: data
            });
        } else {
            res.status(404).json({ message: 'No data found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error: ' + error });
    }
});

module.exports = router;
