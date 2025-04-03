import Home from "../pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TransactionDetails from "../pages/TransactionDetails";
function App() {
  return (
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/transaction/:id" element={<TransactionDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
