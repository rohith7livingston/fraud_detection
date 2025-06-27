import pandas as pd
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import numpy as np

# Load dataset
data = pd.read_csv('transactions.csv')

# Define column names
data.columns = [
    'timestamp', 'customer_id', 'amount', 'merchant', 'transaction_type', 
    'location_from', 'location_to', 'fraud_flag', 'customer_transaction_count', 
    'payment_method', 'merchant_risk_score', 'previous_location', 'hour_of_day'
]

# Convert numerical columns
data[['amount', 'fraud_flag', 'customer_transaction_count', 'merchant_risk_score', 'hour_of_day']] = data[['amount', 'fraud_flag', 'customer_transaction_count', 'merchant_risk_score', 'hour_of_day']].apply(pd.to_numeric)

# Encode categorical variables
label_encoders = {}
categorical_columns = ['customer_id', 'merchant', 'transaction_type', 'location_from', 'location_to', 'payment_method', 'previous_location']

for column in categorical_columns:
    le = LabelEncoder()
    data[column] = le.fit_transform(data[column])
    label_encoders[column] = le  # Store the encoder

# Define features and target
features_list = [
    "customer_id", "amount", "merchant", "transaction_type",
    "location_from", "location_to", "customer_transaction_count",
    "payment_method", "merchant_risk_score", "previous_location", "hour_of_day"
]
X = data[features_list]
y = data['fraud_flag']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced')
model.fit(X_train, y_train)

# Save model, encoders, and training data
os.makedirs("model", exist_ok=True)
joblib.dump(model, 'model/fraud_detection_model.pkl')
joblib.dump(label_encoders, 'model/label_encoders.pkl')
np.save('model/training_data.npy', X_train.values)  # Store training data for LIME

print("✅ Model, encoders, and training data saved successfully!")