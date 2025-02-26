const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { Price, createTimeSeriesCollection } = require("./models/market"); // Your Mongoose model
require('dotenv').config()


const folderPath = "./data/eurusd"; // Change this to your CSV folder path

async function connectDB() {
  const mongoURI = process.env.MONGO_URI;
  await mongoose
    .connect(mongoURI)
    .then(() => console.log("🔥 Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));
  console.log("Connected to MongoDB");
}

async function importCSV(filePath) {
    return new Promise((resolve, reject) => {
      const prices = [];
      
      fs.createReadStream(filePath)
        .pipe(csv({ separator: ";" })) // Adjust delimiter if needed
        .on("data", (row) => {
          // Convert "20000530 172700" -> "YYYY-MM-DDTHH:mm:ssZ"
          const rawTimestamp = row.date.trim(); // Ensure no extra spaces
          const formattedTimestamp = parseTimestamp(rawTimestamp);
  
          if (!formattedTimestamp) {
            console.error(`Invalid date format: ${rawTimestamp}`);
            return; // Skip this row
          }
  
          prices.push({
            metadata: { symbol: "EUR/USD" },
            timestamp: formattedTimestamp,
            open: parseFloat(row.open),
            high: parseFloat(row.high),
            low: parseFloat(row.low),
            close: parseFloat(row.close),
            volume: parseInt(row.volume) || null
          });
        })
        .on("end", async () => {
          if (prices.length > 0) {
            await Price.insertMany(prices);
            console.log(`Imported ${prices.length} records from ${path.basename(filePath)}`);
          }
          resolve();
        })
        .on("error", reject);
    });
  }
  
  // Function to parse "20000530 172700" into a valid JavaScript Date object
  function parseTimestamp(timestampStr) {
    const match = timestampStr.match(/^(\d{4})(\d{2})(\d{2}) (\d{2})(\d{2})(\d{2})$/);
    if (!match) return null;
  
    const [_, year, month, day, hour, minute, second] = match;
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`); // UTC format
  }
  

async function importAllCSVs() {
  await connectDB();
  let data = await Price.find().limit(5)
  console.log(data)
//   await createTimeSeriesCollection()
//   const files = fs.readdirSync(folderPath).filter(file => file.endsWith(".csv"));
  
//   for (const file of files) {
//     await importCSV(path.join(folderPath, file));
//   }

//   console.log("✅ All files imported successfully!");
  mongoose.connection.close();
}

importAllCSVs().catch(err => console.error("Import failed:", err));
