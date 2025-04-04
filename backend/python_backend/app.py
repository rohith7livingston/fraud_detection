from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np
import os

app = Flask(__name__)

# Load model, encoders, and feature names
model = joblib.load("model/fraud_detection_model.pkl")
label_encoders = joblib.load("model/label_encoders.pkl")
feature_names = np.load("model/feature_names.npy", allow_pickle=True).tolist()

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get request data
        data = request.json
        print("📩 Received Data:", data)

        # Convert input to DataFrame
        df = pd.DataFrame([data])

        # Convert numeric columns
        numeric_cols = ["amount", "customer_transaction_count", "hour_of_day", "merchant_risk_score"]
        for col in numeric_cols:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors="coerce")

        # Encode categorical variables
        categorical_columns = ["customer_id", "merchant", "transaction_type", "location_from", "location_to", "payment_method", "previous_location"]
        for column in categorical_columns:
            if column in label_encoders:
                df[column] = df[column].map(lambda x: label_encoders[column].transform([x])[0] if x in label_encoders[column].classes_ else -1)

        # Ensure all features exist
        missing_features = [col for col in feature_names if col not in df.columns]
        for col in missing_features:
            print(f"⚠️ Missing feature {col}. Adding default value.")
            df[col] = 0  # Default for missing columns

        # Ensure column order matches model
        df = df[feature_names]

        print("📊 Final Encoded DataFrame:\n", df)

        # Make prediction
        prediction = model.predict(df)[0]
        print("🎯 Prediction:", prediction)

        # Generate risk score
        risk_score = 0
        explanation = []
        if df["amount"].iloc[0] > 50000:
            risk_score += 2
            explanation.append("High transaction amount detected")
        if df["location_from"].iloc[0] != "India" or df["location_to"].iloc[0] != "India":
            risk_score += 3
            explanation.append("Foreign transaction detected")

        explanation_str = ", ".join(explanation) if explanation else "No suspicious activity detected"

        print("📝 Explanation:", explanation_str)

        # Return response
        return jsonify({
            "fraud_flag": int(prediction),
            "risk_score": risk_score,
            "explanation": explanation_str
        })

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
