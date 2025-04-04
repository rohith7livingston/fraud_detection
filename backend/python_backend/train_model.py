import pandas as pd
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import numpy as np

# Load dataset
file_path = "transactions_refine.csv"
data = pd.read_csv(file_path)

# Define required columns
columns_to_keep = [
    "customer_id", "amount", "merchant", "transaction_type",
    "location_from", "location_to", "customer_transaction_count",
    "hour_of_day", "merchant_risk_score", "payment_method", "previous_location", "fraud_flag"
]

# Print available columns
print("📊 Available Columns in CSV:", data.columns.tolist())

# Add missing columns with default values
default_values = {
    "customer_transaction_count": 0,
    "hour_of_day": 12,
    "merchant_risk_score": 1,
    "payment_method": "Unknown",
    "previous_location": "Unknown"
}

for column in columns_to_keep:
    if column not in data.columns:
        print(f"⚠️ Missing column: {column}. Adding default values.")
        data[column] = default_values.get(column, 0)

# Keep only relevant columns
data = data[columns_to_keep]

# Convert numerical columns
numeric_cols = ["amount", "fraud_flag", "customer_transaction_count", "hour_of_day", "merchant_risk_score"]
data[numeric_cols] = data[numeric_cols].apply(pd.to_numeric, errors="coerce")

# Encode categorical variables
label_encoders = {}
categorical_columns = ["customer_id", "merchant", "transaction_type", "location_from", "location_to", "payment_method", "previous_location"]

for column in categorical_columns:
    le = LabelEncoder()
    data[column] = le.fit_transform(data[column])
    label_encoders[column] = le  # Store the encoder

# Define features and target
X = data.drop(columns=["fraud_flag"])
y = data["fraud_flag"]

# Save feature names
feature_names = X.columns.tolist()
np.save("model/feature_names.npy", feature_names)

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

model_dir = "model"
os.makedirs(model_dir, exist_ok=True)
joblib.dump(model, os.path.join(model_dir, "fraud_detection_model.pkl"))
joblib.dump(label_encoders, os.path.join(model_dir, "label_encoders.pkl"))

print("✅ Model trained and saved successfully!")
