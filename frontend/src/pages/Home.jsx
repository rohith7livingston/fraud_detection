import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:3000/transactions");
        const data = await response.json();
        const transformedData = data.transactions.map((tx) => ({
          id: tx.transaction_id,
          displayId: `T${tx.transaction_id}`,
          fraud_score: tx.fraud_score ?? Math.random() * 100,
          timestamp: tx.timestamp,
          amount: tx.amount,
          customer_id: tx.customer_id,
          transaction_type: tx.transaction_type,
          location_to: tx.location_to,
          status: tx.status ?? "Pending",
        }));
        setTransactions(transformedData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const handleRowClick = (transactionId) => {
    navigate(`/transaction/T${transactionId}`);
  };

  const chartData = {
    labels: transactions.map((tx) => tx.displayId),
    datasets: [
      {
        label: "Transaction Amount",
        data: transactions.map((tx) => tx.amount),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const statusColors = {
    Flagged: "#ffcccc",
    "Under Review": "#fffacd",
    Escalated: "#ff9999",
    default: "#d9f7be",
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#ffe9e9",
        minHeight: "100vh",
        fontSize: "0.92rem",
      }}
    >
      <NavBar />
      <div
        style={{
          marginTop: "60px",
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Card
          style={{
            flex: 2.5,
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
            margin: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              marginBottom: "15px",
            }}
          >
            <div style={{ display: "flex", gap: "8px" }}>
              {["#ff0000", "#ffde59", "#7ed957"].map((color, index) => (
                <div
                  key={index}
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: color,
                  }}
                />
              ))}
            </div>
            <h3 style={{ margin: 0 }}>Transactions are being processed...</h3>
          </div>

          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  {[
                    "Time-Stamp",
                    "ID",
                    "Customer",
                    "Transaction Type",
                    "Amount",
                    "Location To",
                    "Status",
                  ].map((header, index) => (
                    <TableCell
                      key={index}
                      style={{
                        backgroundColor: "#ffd6d6",
                        fontWeight: "bold",
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow
                    key={tx.id}
                    onClick={() => handleRowClick(tx.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <TableCell>{tx.timestamp}</TableCell>
                    <TableCell>{tx.displayId}</TableCell>
                    <TableCell>{tx.customer_id}</TableCell>
                    <TableCell>{tx.transaction_type}</TableCell>
                    <TableCell>{tx.amount}</TableCell>
                    <TableCell>{tx.location_to}</TableCell>
                    <TableCell
                      style={{
                        backgroundColor:
                          statusColors[tx.status] || statusColors.default,
                        fontWeight: "bold",
                        textAlign: "center",
                        borderRadius: "8px",
                        padding: "4px 8px",
                      }}
                    >
                      {tx.status}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card
          style={{
            flex: 1,
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
            margin: "10px",
          }}
        >
          <CardContent>
            <h3>Transaction Summary</h3>
            <Bar data={chartData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
