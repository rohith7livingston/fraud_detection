import { useParams } from "react-router-dom";

export default function TransactionDetails() {
  const { id } = useParams();

  return (
    <div style={{ padding: "20px" }}>
      <h2>Transaction Details</h2>
      <p>Details for Transaction ID: {id}</p>
    </div>
  );
}
