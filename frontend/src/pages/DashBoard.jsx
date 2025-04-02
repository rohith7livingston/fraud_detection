import React, { useEffect, useState } from "react";
import './../stylesheet/DashBoard.css';

const DashBoard = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/transactions")
      .then((response) => response.json())
      .then((data) => {
        // Directly set the transactions array from the response
        setTransactions(data.transactions || []); // Fallback to empty array if no transactions
      })
      .catch((error) => console.error("Error fetching transactions:", error));
  }, []);

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Transaction Dashboard</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Transaction ID</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Customer</th>
            <th className="px-4 py-2">Merchant</th>
            <th className="px-4 py-2">Fraud Flag</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Payment Method</th>
            <th className="px-4 py-2">Merchant Risk Score</th>
            <th className="px-4 py-2">Location</th>
            <th className="px-4 py-2">Transaction Hour</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((txn) => (
              <tr key={txn.id} className="border-t">
                <td className="px-4 py-2">{txn.id}</td>
                <td className="px-4 py-2">${txn.amount ? Number(txn.amount).toFixed(2) : "0.00"}</td>
                <td className="px-4 py-2">{txn.transaction_type}</td>
                <td className="px-4 py-2">{txn.customer_id}</td>
                <td className="px-4 py-2">{txn.merchant}</td>
                <td className="px-4 py-2">{txn.fraud_flag === 1 ? 'Fraudulent' : 'Non-Fraudulent'}</td>
                <td className="px-4 py-2">{txn.status}</td>
                <td className="px-4 py-2">{txn.payment_method}</td>
                <td className="px-4 py-2">{txn.merchant_risk_score}</td>
                <td className="px-4 py-2">{txn.location_from} to {txn.location_to}</td>
                <td className="px-4 py-2">{txn.hour_of_day}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="text-center px-4 py-2">No transactions found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DashBoard;
