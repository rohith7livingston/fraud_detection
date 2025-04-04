import { useState, useEffect } from "react";
import { Card, CardContent, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import ForceGraph3D from "react-force-graph-3d";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

export default function Transactions() {
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
    <div>
      <NavBar />
      <div style={{ marginTop: "100px", display: "flex", gap: "20px" }}>
        <Card style={{ flex: 1, padding: "20px" }}>
          <CardContent>
            <h3>Transaction History</h3>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Time-Stamp</TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Transaction Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Location From</TableCell>
                  <TableCell>Location To</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id} onClick={() => handleRowClick(tx.id)} style={{ cursor: "pointer" }}>
                    <TableCell>{tx.timestamp}</TableCell>
                    <TableCell>{tx.id}</TableCell>
                    <TableCell>{tx.customer_id}</TableCell>
                    <TableCell>{tx.transaction_type}</TableCell>
                    <TableCell>{tx.amount}</TableCell>
                    <TableCell>{tx.location_from}</TableCell>
                    <TableCell>{tx.location_to}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card style={{ flex: 1, padding: "20px" }}>
          <CardContent>
            <h3>Transaction Network</h3>
            <ForceGraph3D graphData={graphData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
