const express = require("express");
const axios = require("axios");
const db = require("./server");  // MySQL connection
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.post("/process-transaction", async (req, res) => {
    try {
        const transactionData = req.body;
        console.log("📩 Transaction Data Received:", transactionData);

        // Send to Python backend
        const pythonResponse = await axios.post("http://127.0.0.1:5000/predict", transactionData);
        console.log("🎯 Fraud Flag from Python:", pythonResponse.data);

        if (pythonResponse.data.fraud_flag !== undefined) {
            const fraudFlag = pythonResponse.data.fraud_flag;
            const explanation = pythonResponse.data.explanation || "No explanation available";
            const status = "pending"; // New column with default value "pending"

            transactionData.fraud_flag = fraudFlag;
            transactionData.explanation = explanation;
            transactionData.status = status; // Add status to transaction data

            // Store transaction and explanation in MySQL
            const query = `
                INSERT INTO transactions (timestamp, customer_id, amount, merchant, transaction_type, 
                    location_from, location_to, fraud_flag, customer_transaction_count, payment_method, 
                    merchant_risk_score, previous_location, hour_of_day, explanation, status)
                VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`; // Added 'status' column

            const values = [
                transactionData.customer_id, transactionData.amount,
                transactionData.merchant, transactionData.transaction_type, transactionData.location_from,
                transactionData.location_to, fraudFlag, transactionData.customer_transaction_count,
                transactionData.payment_method, transactionData.merchant_risk_score,
                transactionData.previous_location, transactionData.hour_of_day, explanation, status // Added status
            ];

            db.query(query, values, (err, result) => {
                if (err) {
                    console.error("❌ Error inserting transaction:", err);
                    return res.status(500).json({ error: "Database error" });
                }
                res.json({ message: "✅ Transaction processed successfully", fraud_flag: fraudFlag, status: status });
            });
        } else {
            res.status(500).json({ error: "No fraud flag returned from Python backend" });
        }
    } catch (error) {
        console.error("❌ Error processing transaction:", error.message);
        res.status(500).json({ error: "Transaction processing failed" });
    }
});

app.post("/status", async (req, res) => {
    const { transaction_id, new_status } = req.body;

    if (!transaction_id || !new_status) {
        return res.status(400).json({ error: "Transaction ID and new status are required" });
    }

    if (!["clean", "fraud"].includes(new_status)) {
        return res.status(400).json({ error: "Invalid status. Use 'clean' or 'fraud'" });
    }

    const query = "UPDATE transactions SET status = ? WHERE id = ?";

    db.query(query, [new_status, transaction_id], (err, result) => {
        if (err) {
            console.error("❌ Error updating transaction status:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        res.json({ message: `✅ Transaction ${transaction_id} updated to ${new_status}` });
    });
});
app.get("/transactions", async (req, res) => {
    const query = "SELECT * FROM transactions ORDER BY timestamp DESC"; // Get all transactions (latest first)

    db.query(query, (err, result) => {
        if (err) {
            console.error("❌ Error fetching transactions:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: "No transactions found" });
        }

        res.json({ transactions: result });  // Return all transactions in the 'transactions' key
    });
});


app.get("/transaction/:id", async (req, res) => {
    const transactionId = req.params.id;

    if (!transactionId) {
        return res.status(400).json({ error: "Transaction ID is required" });
    }

    // Query to fetch the selected transaction
    const query1 = "SELECT * FROM transactions WHERE id = ?";
    
    db.query(query1, [transactionId], (err, result1) => {
        if (err) {
            console.error("❌ Error fetching transaction:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (result1.length === 0) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        const transaction = result1[0];
        const customerId = transaction.customer_id;

        // Query to fetch all previous transactions of the same customer
        const query2 = "SELECT * FROM transactions WHERE customer_id = ? AND id < ? ORDER BY timestamp DESC";

        db.query(query2, [customerId, transactionId], (err, result2) => {
            if (err) {
                console.error("❌ Error fetching previous transactions:", err);
                return res.status(500).json({ error: "Database error" });
            }

            res.json({
                selected_transaction: transaction,
                previous_transactions: result2
            });
        });
    });
});


app.listen(PORT, () => {
  console.log(`🚀 Node.js server running on port ${PORT}`);
});

module.exports = { app };























// const express = require("express");
// const axios = require("axios");
// const db = require("./server");  // MySQL connection
// const cors = require("cors");
// const { OpenAI } = require("openai");

// const app = express();
// const PORT = 3000;

// app.use(express.json());
// app.use(cors());

// // Initialize OpenAI client
// const openai = new OpenAI({
//   apiKey: "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"  // Replace with your OpenAI API key
// });

// async function generateHumanReadableExplanation(rawExplanation) {
//     try {
//         // Construct the prompt to generate the explanation
//         const prompt = `Below is a raw explanation of a fraud detection prediction. Convert this into a human-readable, easy-to-understand explanation:\n${rawExplanation}`;

//         // Call the OpenAI API to generate the human-readable explanation
//         const response = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo",  // You can use "gpt-4" as well if required
//             messages: [
//                 { role: "system", content: "You are a helpful assistant." },
//                 { role: "user", content: prompt }
//             ],
//             max_tokens: 200,
//             temperature: 0.7
//         });

//         return response.choices[0].message.content.trim();
//     } catch (error) {
//         console.error("Error generating explanation with OpenAI:", error);
//         throw new Error("Failed to generate explanation");
//     }
// }

// app.post("/process-transaction", async (req, res) => {
//     try {
//         const transactionData = req.body;
//         console.log("📩 Transaction Data Received:", transactionData);

//         // Send to Python backend
//         const pythonResponse = await axios.post("http://127.0.0.1:5000/predict", transactionData);
//         console.log("🎯 Fraud Flag from Python:", pythonResponse.data);

//         if (pythonResponse.data.fraud_flag !== undefined) {
//             const fraudFlag = pythonResponse.data.fraud_flag;
//             const rawExplanation = pythonResponse.data.explanation || "No explanation available";

//             // Generate human-readable explanation using OpenAI API
//             const humanReadableExplanation = await generateHumanReadableExplanation(rawExplanation);

//             transactionData.fraud_flag = fraudFlag;
//             transactionData.explanation = humanReadableExplanation;

//             // Store transaction and explanation in MySQL
//             const query = `
//                 INSERT INTO transactions (timestamp, customer_id, amount, merchant, transaction_type, 
//                     location_from, location_to, fraud_flag, customer_transaction_count, payment_method, 
//                     merchant_risk_score, previous_location, hour_of_day, explanation)
//                 VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//             `;

//             const values = [
//                 transactionData.customer_id, transactionData.amount,
//                 transactionData.merchant, transactionData.transaction_type, transactionData.location_from,
//                 transactionData.location_to, fraudFlag, transactionData.customer_transaction_count,
//                 transactionData.payment_method, transactionData.merchant_risk_score,
//                 transactionData.previous_location, transactionData.hour_of_day, humanReadableExplanation
//             ];

//             db.query(query, values, (err, result) => {
//                 if (err) {
//                     console.error("❌ Error inserting transaction:", err);
//                     return res.status(500).json({ error: "Database error" });
//                 }
//                 res.json({ message: "✅ Transaction processed successfully", fraud_flag: fraudFlag, explanation: humanReadableExplanation });
//             });
//         } else {
//             res.status(500).json({ error: "No fraud flag returned from Python backend" });
//         }
//     } catch (error) {
//         console.error("❌ Error processing transaction:", error.message);
//         res.status(500).json({ error: "Transaction processing failed" });
//     }
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Node.js server running on port ${PORT}`);
// });

// module.exports = { app };
