import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Graph from '../components/Graph'; // Adjust path if in a different folder

export default function TransactionDetails() {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [previousTransactions, setPreviousTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Define random explanations inside useEffect
    const randomExplanations = [
      "Unusual transaction amount.",
      "Transaction location mismatch.",
      "Customer frequently changes merchant.",
      "Large withdrawal compared to average activity.",
      "Transaction occurred outside regular hours.",
      "Merchant risk score exceeds threshold.",
      "Customer IP address geolocation mismatch.",
      "Suspicious transaction frequency pattern.",
      "Payment method change detected.",
      "Large number of recent failed transactions.",
    ];

    fetch(`http://localhost:3000/transaction/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched transaction data:', data); // Log the response data

        // Assign a random fraud score between 50 and 100
        const randomFraudScore = Math.floor(Math.random() * 51) + 50;
        data.selected_transaction.fraud_score = randomFraudScore;

        // Select random explanations
        const numExplanations = 3;
        const selectedExplanations = [];
        while (selectedExplanations.length < numExplanations) {
          const randomExplanation = randomExplanations[Math.floor(Math.random() * randomExplanations.length)];
          if (!selectedExplanations.includes(randomExplanation)) {
            selectedExplanations.push(randomExplanation);
          }
        }

        // Join explanations and add them to the data object
        data.selected_transaction.explanation = selectedExplanations.join(', ');

        // Set transaction and previous transactions data
        setTransaction(data.selected_transaction);
        setPreviousTransactions(data.previous_transactions);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching transaction:', err);
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
          <p className="text-green-600 font-bold text-2xl">{transaction.fraud_score || 'N/A'}</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-red-500 text-white px-4 py-2 rounded">Fraud</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded">Not Fraud</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Review Status</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Whitebox Explanations</h3>
          <ul className="text-base text-gray-700 space-y-1">
            {transaction.explanation
              ? transaction.explanation.split(',').map((item, idx) => (
                  <li key={idx}>• {item.trim()}</li>
                ))
              : <li>Not available</li>}
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Genome</h3>
          <Graph previousTransactions={previousTransactions} />
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Processing</h3>
          <p className="text-sm text-gray-700">Status: <span className="text-green-600">{transaction.status}</span></p>
          <p className="text-sm text-gray-700">Hour of Day: {transaction.hour_of_day}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Transaction Details</h3>
          <p className="text-sm text-gray-700">Transaction ID: {transaction.id}</p>
          <p className="text-sm text-gray-700">Amount: ₹{transaction.amount}</p>
          <p className="text-sm text-gray-700">Customer ID: {transaction.customer_id}</p>
          <p className="text-sm text-gray-700">Merchant: {transaction.merchant}</p>
          <p className="text-sm text-gray-700">Type: {transaction.transaction_type}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Payment Info</h3>
          <p className="text-sm text-gray-700">Payment Method: {transaction.payment_method}</p>
          <p className="text-sm text-gray-700">Merchant Risk Score: {transaction.merchant_risk_score}</p>
          <p className="text-sm text-gray-700">Transaction Count: {transaction.customer_transaction_count}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Location Info</h3>
          <p className="text-sm text-gray-700">From: {transaction.location_from}</p>
          <p className="text-sm text-gray-700">To: {transaction.location_to}</p>
          <p className="text-sm text-gray-700">Previous: {transaction.previous_location}</p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold mb-2">Previous Transactions</h3>
        {previousTransactions.length === 0 ? (
          <p className="text-sm text-gray-500">No previous transactions.</p>
        ) : (
          <ul className="text-sm text-gray-700 space-y-1">
            {previousTransactions.map((tx) => (
              <li key={tx.id}>
                #{tx.id} – ₹{tx.amount} – {tx.transaction_type} – {new Date(tx.timestamp).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
