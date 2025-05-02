import { useParams } from "react-router-dom";

export default function TransactionDetails() {
  const { id } = useParams();

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-gray-500">Score</p>
          <p className="text-green-600 font-bold text-2xl">112</p>
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
            <li>• Risky US shipping address city</li>
            <li>• Age of user account</li>
            <li>• Number of numerical digits in the billing email</li>
            <li>• Number of distinct device info and device ID over last 24h</li>
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
          <p className="text-sm text-gray-700">Acquirer Response: <span className="text-green-600">Approved (Success)</span></p>
          <p className="text-sm text-gray-700">Raw Acquirer Response: N/A</p>
        </div>

        {/* Transaction Details */}
        <div className="bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-2">Transaction Details</h3>
          <p className="text-sm text-gray-700">Transaction ID: {id}</p>
          <p className="text-sm text-gray-700">Amount: €325</p>
          <p className="text-sm text-gray-700">Currency: EUR</p>
          <p className="text-sm text-gray-700">Product Category: Premium</p>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-xl shadow p-4 col-span-2">
          <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
          <p className="text-sm text-gray-700">BIN Bank: Bank 1</p>
          <p className="text-sm text-gray-700">BIN Type: Credit</p>
          <p className="text-sm text-gray-700">3DS: Y</p>
          <p className="text-sm text-gray-700">CVV Response: Approved (Success)</p>
        </div>
      </div>
    </div>
  );
}
