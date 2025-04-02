from flask import Flask, request, jsonify
import joblib
import pandas as pd
import lime.lime_tabular
import numpy as np
import os

app = Flask(__name__)

# Load model and encoders
model = joblib.load('model/fraud_detection_model.pkl')
label_encoders = joblib.load('model/label_encoders.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get request data
        data = request.json
        print("📩 Received Data:", data)

        # Expected features
        features = [
            "customer_id", "amount", "merchant", "transaction_type",
            "location_from", "location_to", "customer_transaction_count",
            "payment_method", "merchant_risk_score", "previous_location", "hour_of_day"
        ]

        # Convert input to DataFrame
        df = pd.DataFrame([data])

        # Convert numeric columns
        numeric_cols = ['amount', 'merchant_risk_score', 'customer_transaction_count', 'hour_of_day']
        df[numeric_cols] = df[numeric_cols].apply(pd.to_numeric, errors='coerce')

        # Encode categorical variables safely
        categorical_columns = ["customer_id", "merchant", "transaction_type", "location_from", "location_to", "payment_method", "previous_location"]
        for column in categorical_columns:
            if column in label_encoders:
                # If the category is not in the classes, we map it to a default value like -1
                df[column] = df[column].map(lambda x: label_encoders[column].transform([x])[0] if x in label_encoders[column].classes_ else -1)

        print("📊 Encoded DataFrame:", df)

        # Make prediction
        prediction = model.predict(df[features])[0]  # Ensure it's using the correct feature set
        print("🎯 Prediction:", prediction)

        # Explain the prediction using LIME
        explainer = lime.lime_tabular.LimeTabularExplainer(
            training_data=np.load('model/training_data.npy'),  # Ensure this file exists and has correct format
            feature_names=features,
            class_names=['Not Fraud', 'Fraud'],
            discretize_continuous=True
        )
        exp = explainer.explain_instance(df.iloc[0].values, model.predict_proba)
        explanation = exp.as_list()
        explanation_str = ' '.join([f"{feat}: {weight}" for feat, weight in explanation])

        print("📝 Explanation:", explanation_str)

        # Return response
        return jsonify({"fraud_flag": int(prediction), "explanation": explanation_str})

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
