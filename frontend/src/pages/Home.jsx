import { useState, useEffect } from "react";
import { Card, CardContent, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import ForceGraph3D from "react-force-graph-3d";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/transactions")
      .then((res) => res.json())
      .then((data) => {
        const transformedData = data.transactions.map((tx) => ({
          id: `T${tx.transaction_id}`,
          fraud_score: tx.fraud_score !== undefined ? tx.fraud_score : Math.random() * 100,
          timestamp: tx.timestamp,
          amount: tx.amount,
          customer_id: tx.customer_id,
          transaction_type: tx.transaction_type,
          location_from: tx.location_from,
          location_to: tx.location_to,
        }));
        setTransactions(transformedData);
      })
      .catch((err) => console.error("Error fetching transactions:", err));
  }, []);

  const handleRowClick = (transactionId) => {
    navigate(`/transaction/${transactionId}`);
  };

  const fraudData = transactions.filter((tx) => tx.fraud_score > 50);
  const fraudChartData = {
    labels: fraudData.map((tx) => tx.id),
    datasets: [
      {
        label: "Fraud Scores",
        data: fraudData.map((tx) => tx.fraud_score),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const graphData = {
    nodes: transactions.map((tx) => ({ id: tx.id, fraud_score: tx.fraud_score })),
    links: transactions.map((tx, i) =>
      i > 0 ? { source: transactions[i - 1].id, target: tx.id } : null
    ).filter((link) => link !== null),
  };

  return (
    <div style={{ backgroundColor: "#FFF7F7", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
        <NavBar />
      </div>

      <div style={{ marginTop: "100px", display: "grid", gap: "24px", maxWidth: "1400px", margin: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1fr", gap: "24px" }}>
          <Card style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0px 4px 8px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#333" }}>Transaction History</h2>
              <Table>
                <TableHead>
                  <TableRow style={{ backgroundColor: "#F87171" }}>
                    <TableCell style={{ fontWeight: "bold", color: "#FFF" }}>Time-Stamp</TableCell>
                    <TableCell style={{ fontWeight: "bold", color: "#FFF" }}>Transaction ID</TableCell>
                    <TableCell style={{ fontWeight: "bold", color: "#FFF" }}>Amount</TableCell>
                    <TableCell style={{ fontWeight: "bold", color: "#FFF" }}>Customer ID</TableCell>
                    <TableCell style={{ fontWeight: "bold", color: "#FFF" }}>Transaction Type</TableCell>
                    <TableCell style={{ fontWeight: "bold", color: "#FFF" }}>Fraud Score</TableCell>
                    <TableCell style={{ fontWeight: "bold", color: "#FFF" }}>Location From</TableCell>
                    <TableCell style={{ fontWeight: "bold", color: "#FFF" }}>Location To</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id} style={{ cursor: "pointer" }} onClick={() => handleRowClick(tx.customer_id)}>
                      <TableCell>{tx.timestamp}</TableCell>
                      <TableCell>{tx.id}</TableCell>
                      <TableCell>{tx.amount} rs</TableCell>
                      <TableCell>{tx.customer_id}</TableCell>
                      <TableCell>{tx.transaction_type}</TableCell>
                      <TableCell>{tx.fraud_score.toFixed(2)}</TableCell>
                      <TableCell>{tx.location_from}</TableCell>
                      <TableCell>{tx.location_to}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: "white", borderRadius: "16px", padding: "16px", textAlign: "center", boxShadow: "0px 4px 8px rgba(0,0,0,0.08)", height: "500px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#333" }}>Fraud Statistics (3D)</h2>
            <ForceGraph3D graphData={graphData} nodeAutoColorBy="fraud_score" linkDirectionalParticles={2} linkDirectionalParticleSpeed={0.01} nodeLabel={(node) => `Transaction ${node.id}\nFraud Score: ${node.fraud_score.toFixed(2)}`} width={400} height={400} />
          </Card>

          <Card style={{ backgroundColor: "white", borderRadius: "16px", padding: "16px", textAlign: "center", boxShadow: "0px 4px 8px rgba(0,0,0,0.08)", height: "500px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#333" }}>Fraud Score Distribution</h2>
            <Bar data={fraudChartData} />
          </Card>
        </div>
      </div>
    </div>
  );
}