const mysql = require("mysql2");

// Create the MySQL database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",  // Database username
  password: "rohith#SQL",  // Database password (ensure this is secure in production)
  database: "fraud_detection",
});

// Connect to MySQL database with error handling
db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);  // Exit the process if database connection fails
  } else {
    console.log("✅ Connected to MySQL database.");
  }
});

// Export the connection for use in other parts of the app
module.exports = db;
