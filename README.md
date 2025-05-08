# Fraud Detection System API

This project implements a **Fraud Detection System** API that identifies potentially fraudulent transactions using an explainable anomaly detection model based on spending behavior and transaction history. The API integrates with a Node.js backend, allowing it to process transaction data and return fraud flags for each transaction.

## Features

- **Transaction Analysis:** Receives transaction data and flags fraudulent transactions.
- **Explainable Model:** Uses Random Forest for anomaly detection and provides white-box explanations for the results.
- **Fraud Detection Score:** Each transaction is assigned a fraud score based on historical behavior and transaction details.
- **Data Storage:** Stores transaction data along with fraud flags in a MySQL database.
- **Team Review Interface:** Facilitates fraud review by providing detailed reports of flagged transactions.

## Project Structure

fraud_detection_system/
│
├── backend/
│ ├── nodejs_backend/
│ │ ├── app.js # Node.js application entry point
│ │ ├── controllers/ # Controllers handling API requests
│ │ └── models/ # Database models
│ │
│ ├── python_backend/
│ │ ├── app.py # Flask application entry point
│ │ ├── fraud_model.py # Model for fraud detection (Random Forest)
│ │ ├── requirements.txt # Python dependencies
│ │ └── utils.py # Helper functions
│ │
└── README.md


## Getting Started

### Prerequisites

- Node.js (for Node.js backend)
- Python (for Flask backend)
- MySQL (for database storage)
- `pip` (for Python dependencies)
- `npm` (for Node.js dependencies)

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/yourusername/fraud_detection_system.git
cd fraud_detection_system
2. Set up the Node.js backend
Navigate to the nodejs_backend directory:

bash
Copy
Edit
cd backend/nodejs_backend
Install dependencies:

bash
Copy
Edit
npm install
Set up the .env file with your database credentials and any other necessary configurations.

Start the Node.js server:

bash
Copy
Edit
npm start
3. Set up the Python backend
Navigate to the python_backend directory:

bash
Copy
Edit
cd backend/python_backend
Create a virtual environment (optional but recommended):

bash
Copy
Edit
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
Install Python dependencies:

bash
Copy
Edit
pip install -r requirements.txt
Start the Flask server:

bash
Copy
Edit
python app.py
API Endpoints
1. /api/v1/detect_fraud
Method: POST

Description: Receives transaction data and returns a fraud flag.

Request Body:

json
Copy
Edit
{
  "transaction_id": "12345",
  "amount": 1000,
  "merchant": "XYZ Corp",
  "timestamp": "2025-05-08T12:00:00",
  "customer_id": "54321"
}
Response:

json
Copy
Edit
{
  "transaction_id": "12345",
  "fraud_flag": true,
  "fraud_score": 0.95,
  "message": "Transaction flagged as fraudulent."
}
2. /api/v1/assign_transaction
Method: POST

Description: Assigns a transaction to a reviewer.

Request Body:

json
Copy
Edit
{
  "transaction_id": "12345",
  "assignee_name": "John Doe"
}
Response:

json
Copy
Edit
{
  "status": "success",
  "message": "Transaction assigned successfully."
}
Database Setup
Create a MySQL database and configure it to store transaction data.

Set up tables for storing transaction details and fraud flags.

Contributing
Contributions are welcome! If you'd like to contribute, please fork the repository and create a pull request with your changes. Be sure to follow the coding conventions used in the project.

License
This project is licensed under the MIT License - see the LICENSE file for details.

yaml
Copy
Edit

---

This `README.md` structure should give a clear, detailed overview of your project, including setup instructions, API endpoints, and other important details. Make sure to replace placeholders like `https://github.com/yourusername/fraud_detection_system.git` with the correct URL to your repository.

Let me know if you need any adjustments or additional sections

