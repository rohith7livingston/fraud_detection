export default function Dashboard() {
  return (
    <div className="flex h-screen bg-[#f3f8fb]">
      {/* Sidebar */}
      <aside className="w-16 bg-[#0c1d2f] flex flex-col items-center py-4 space-y-6 text-white text-xl">
        <span title="Search">🔍</span>
        <span title="Home">🏠</span>
        <span title="Reports">📄</span>
        <span title="Settings">⚙️</span>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between bg-white px-6 py-4 border-b shadow-sm">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-green-600 text-2xl font-bold">112</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">False</span>
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs">Fraud</span>
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">Reviewed</span>
            <span className="text-sm font-medium">Confirmed Fraud</span>
            <span className="text-sm">Analyst: <strong>Daniel Ek</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm">Fraud</button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm">Not Fraud</button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">Get Next</button>
            <img
              src="https://i.pravatar.cc/100?img=1"
              alt="Avatar"
              className="w-9 h-9 rounded-full border border-gray-300"
            />
          </div>
        </header>

        {/* Main Grid */}
        <main className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
          {/* Whitebox Explanations */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-lg mb-3">Whitebox Explanations</h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Risky US shipping address city</li>
              <li>• Age of user account</li>
              <li>• Numerical digits in billing email</li>
              <li>• Distinct devices in last 24h</li>
            </ul>
          </div>

          {/* Genome Graph */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-lg mb-3">Genome</h2>
            <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm">
              Graph Placeholder
            </div>
          </div>

          {/* Transaction Details */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-lg mb-3">Transaction Details</h2>
            <p className="text-sm text-gray-700">Amount: €325</p>
            <p className="text-sm text-gray-700">Category: Premium</p>
            <p className="text-sm text-gray-700">Currency: EUR</p>
            <p className="text-sm text-gray-700">Date: (blurred)</p>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-lg mb-3">Payment Details</h2>
            <p className="text-sm text-gray-700">BIN Bank: Bank 1</p>
            <p className="text-sm text-gray-700">BIN Type: Credit</p>
            <p className="text-sm text-gray-700">CVV Response: Approved</p>
          </div>
        </main>
      </div>
    </div>
  );
}
