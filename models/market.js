const { Schema, model, connection } = require("mongoose");

async function createTimeSeriesCollection() {
  await connection.db.createCollection("marketPrice", {
    timeseries: {
      timeField: "timestamp",  
      metaField: "metadata",   
      granularity: "minutes"  
    }
  });
}

const PriceSchema = new Schema({
  metadata: {
    type: Object,
    required: true,
    default: { symbol: "EUR/USD" }  // Stores symbol & other info
  },
  timestamp: {
    type: Date,
    required: true,
    index: true
  },
  open: Number,
  high: Number,
  low: Number,
  close: Number,
  volume: Number
});

// Use a single model for all currency pairs
const Price = model("marketPrice", PriceSchema);

module.exports = { Price, createTimeSeriesCollection };
