const axios = require("axios");
const db = require("../server"); // MySQL connection

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://127.0.0.1:5000';

/**
 * Processes a transaction, gets a fraud prediction, and stores it in the database.
 */
const processTransaction = async (req, res) => {
    try {
        const transactionData = req.body;
        console.log("📩 Transaction Data Received:", transactionData);

        const pythonResponse = await axios.post(`${PYTHON_API_URL}/predict`, transactionData);

        if (!pythonResponse.data.success) {
            const errorMsg = pythonResponse.data.error?.message || "Prediction failed";
            console.error("❌ Python backend returned an error:", errorMsg);
            return res.status(400).json({ error: `Prediction service error: ${errorMsg}` });
        }
        
        const { fraud_flag, explanation } = pythonResponse.data.data;
        // ✨ FIX: Store the full structured explanation as a JSON string.
        // This preserves the weights and full feature details for richer frontend display.
        const explanationJSON = JSON.stringify(explanation);
        const status = "pending";

        const query = `
            INSERT INTO transactions (timestamp, customer_id, amount, merchant, transaction_type, 
                location_from, location_to, fraud_flag, customer_transaction_count, payment_method, 
                merchant_risk_score, previous_location, hour_of_day, explanation, status)
            VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            transactionData.customer_id, transactionData.amount,
            transactionData.merchant, transactionData.transaction_type, transactionData.location_from,
            transactionData.location_to, fraud_flag, transactionData.customer_transaction_count,
            transactionData.payment_method, transactionData.merchant_risk_score,
            transactionData.previous_location, transactionData.hour_of_day, explanationJSON, status
        ];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error("❌ Error inserting transaction:", err);
                return res.status(500).json({ error: "Database error during insertion" });
            }
            res.status(201).json({ 
                message: "✅ Transaction processed successfully", 
                fraud_flag: fraud_flag,
                // The frontend refetches, but returning this is good practice
                explanation: explanation, 
                status: status 
            });
        });

    } catch (error) {
        if (error.response) {
            console.error("❌ Error from Python service:", error.response.data);
            res.status(500).json({ error: "Prediction service failed." });
        } else {
            console.error("❌ Error processing transaction:", error.message);
            res.status(500).json({ error: "Could not connect to the prediction service." });
        }
    }
};

/**
 * Updates the status of a specific transaction.
 */
const updateTransactionStatus = async (req, res) => {
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
};

/**
 * Fetches all transactions from the database.
 */
const getAllTransactions = async (req, res) => {
    const query = "SELECT * FROM transactions ORDER BY timestamp DESC";

    db.query(query, (err, results) => {
        if (err) {
            console.error("❌ Error fetching transactions:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ transactions: results });
    });
};

/**
 * Fetches a single transaction and all previous transactions for the same customer.
 */
const getTransactionById = async (req, res) => {
    const { id: transactionId } = req.params;

    if (!transactionId) {
        return res.status(400).json({ error: "Transaction ID is required" });
    }

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
        const { customer_id } = transaction;

        const query2 = "SELECT * FROM transactions WHERE customer_id = ? AND id < ? ORDER BY timestamp DESC";
        db.query(query2, [customer_id, transactionId], (err, result2) => {
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
};

module.exports = {
    processTransaction,
    updateTransactionStatus,
    getAllTransactions,
    getTransactionById
};