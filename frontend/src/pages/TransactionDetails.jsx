// import { useParams } from "react-router-dom";

// export default function TransactionDetails() {
//   const { id } = useParams();

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen font-sans">
//       <div className="flex justify-between items-center mb-4">
//         <div>
//           <p className="text-sm text-gray-500">Score</p>
//           <p className="text-green-600 font-bold text-2xl">112</p>
//         </div>
//         <div className="flex gap-2">
//           <button className="bg-red-500 text-white px-4 py-2 rounded">Fraud</button>
//           <button className="bg-green-500 text-white px-4 py-2 rounded">Not Fraud</button>
//           <button className="bg-blue-500 text-white px-4 py-2 rounded">Review Status</button>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-6">
//         {/* Whitebox Explanations */}
//         <div className="bg-white rounded-xl shadow p-4">
//           <h3 className="text-lg font-semibold mb-2">Whitebox Explanations</h3>
//           <ul className="text-sm text-gray-700 space-y-1">
//             <li>• Risky US shipping address city</li>
//             <li>• Age of user account</li>
//             <li>• Number of numerical digits in the billing email</li>
//             <li>• Number of distinct device info and device ID over last 24h</li>
//           </ul>
//         </div>

//         {/* Genome Graph Placeholder */}
//         <div className="bg-white rounded-xl shadow p-4">
//           <h3 className="text-lg font-semibold mb-2">Genome</h3>
//           <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400">
//             [Genome Graph Visualization]
//           </div>
//         </div>

//         {/* Processing */}
//         <div className="bg-white rounded-xl shadow p-4">
//           <h3 className="text-lg font-semibold mb-2">Processing</h3>
//           <p className="text-sm text-gray-700">Acquirer Response: <span className="text-green-600">Approved (Success)</span></p>
//           <p className="text-sm text-gray-700">Raw Acquirer Response: N/A</p>
//         </div>

//         {/* Transaction Details */}
//         <div className="bg-white rounded-xl shadow p-4">
//           <h3 className="text-lg font-semibold mb-2">Transaction Details</h3>
//           <p className="text-sm text-gray-700">Transaction ID: {id}</p>
//           <p className="text-sm text-gray-700">Amount: €325</p>
//           <p className="text-sm text-gray-700">Currency: EUR</p>
//           <p className="text-sm text-gray-700">Product Category: Premium</p>
//         </div>

//         {/* Payment Details */}
//         <div className="bg-white rounded-xl shadow p-4 col-span-2">
//           <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
//           <p className="text-sm text-gray-700">BIN Bank: Bank 1</p>
//           <p className="text-sm text-gray-700">BIN Type: Credit</p>
//           <p className="text-sm text-gray-700">3DS: Y</p>
//           <p className="text-sm text-gray-700">CVV Response: Approved (Success)</p>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function TransactionDetails() {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [previousTransactions, setPreviousTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/transaction/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTransaction(data.selected_transaction);
        setPreviousTransactions(data.previous_transactions);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching transaction:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!transaction) return <div className="p-6 text-red-500">Transaction not found.</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-gray-500">Fraud Score</p>
          <p className="text-green-600 font-bold text-2xl">{transaction.fraud_score || "N/A"}</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-red-500 text-white px-4 py-2 rounded">Fraud</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded">Not Fraud</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Review Status</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Whitebox Explanations */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Whitebox Explanations</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            {transaction.explanation?.split(",").map((item, idx) => (
              <li key={idx}>• {item.trim()}</li>
            )) || <li>Not available</li>}
          </ul>
        </div>

        {/* Genome Graph Placeholder */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Genome</h3>
          <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400">
            [Genome Graph Visualization]
          </div>
        </div>

        {/* Processing */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Processing</h3>
          <p className="text-sm text-gray-700">Status: <span className="text-green-600">{transaction.status}</span></p>
          <p className="text-sm text-gray-700">Hour of Day: {transaction.hour_of_day}</p>
        </div>

        {/* Transaction Details */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Transaction Details</h3>
          <p className="text-sm text-gray-700">Transaction ID: {transaction.id}</p>
          <p className="text-sm text-gray-700">Amount: €{transaction.amount}</p>
          <p className="text-sm text-gray-700">Customer ID: {transaction.customer_id}</p>
          <p className="text-sm text-gray-700">Merchant: {transaction.merchant}</p>
          <p className="text-sm text-gray-700">Type: {transaction.transaction_type}</p>
        </div>

        {/* Payment & Risk Info */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Payment Info</h3>
          <p className="text-sm text-gray-700">Payment Method: {transaction.payment_method}</p>
          <p className="text-sm text-gray-700">Merchant Risk Score: {transaction.merchant_risk_score}</p>
          <p className="text-sm text-gray-700">Transaction Count: {transaction.customer_transaction_count}</p>
        </div>

        {/* Locations */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Location Info</h3>
          <p className="text-sm text-gray-700">From: {transaction.location_from}</p>
          <p className="text-sm text-gray-700">To: {transaction.location_to}</p>
          <p className="text-sm text-gray-700">Previous: {transaction.previous_location}</p>
        </div>
      </div>

      {/* Previous Transactions */}
      <div className="mt-8 bg-white rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold mb-2">Previous Transactions</h3>
        {previousTransactions.length === 0 ? (
          <p className="text-sm text-gray-500">No previous transactions.</p>
        ) : (
          <ul className="text-sm text-gray-700 space-y-1">
            {previousTransactions.map((tx) => (
              <li key={tx.id}>
                #{tx.id} – €{tx.amount} – {tx.transaction_type} – {tx.timestamp}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
