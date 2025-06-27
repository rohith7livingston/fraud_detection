# python_backend/prediction_service.py
import joblib
import pandas as pd
import numpy as np
import os
from pydantic import BaseModel, Field
from typing import List, Dict, Any

# ✨ NEW: Input validation model using Pydantic
class PredictionInput(BaseModel):
    customer_id: str
    amount: float
    merchant: str
    transaction_type: str
    location_from: str
    location_to: str
    customer_transaction_count: int
    payment_method: str
    merchant_risk_score: float = Field(..., ge=0, le=1) # Example: Add validation rules
    previous_location: str
    hour_of_day: int = Field(..., ge=0, le=23)

class PredictionService:
    def __init__(self, model_dir: str = 'model'):
        # ✨ Encapsulate model loading
        self.model = joblib.load(os.path.join(model_dir, 'fraud_detection_model.pkl'))
        self.label_encoders = joblib.load(os.path.join(model_dir, 'label_encoders.pkl'))
        training_data = np.load(os.path.join(model_dir, 'training_data.npy'))
        
        self.features = [
            "customer_id", "amount", "merchant", "transaction_type",
            "location_from", "location_to", "customer_transaction_count",
            "payment_method", "merchant_risk_score", "previous_location", "hour_of_day"
        ]

        # ✨ LIME explainer is part of the service now
        from lime.lime_tabular import LimeTabularExplainer # Import here to keep it contained
        self.explainer = LimeTabularExplainer(
            training_data=training_data,
            feature_names=self.features,
            class_names=['Not Fraud', 'Fraud'],
            discretize_continuous=True
        )
        print("✅ PredictionService initialized successfully.")

    def _preprocess(self, data: PredictionInput) -> pd.DataFrame:
        df = pd.DataFrame([data.dict()])
        
        # Safe label encoding
        categorical_cols = ["customer_id", "merchant", "transaction_type", "location_from", "location_to", "payment_method", "previous_location"]
        for col in categorical_cols:
            le = self.label_encoders.get(col)
            if le:
                df[col] = df[col].apply(lambda x: le.transform([x])[0] if x in le.classes_ else -1)

        return df[self.features] # Ensure correct feature order

    def _get_explanation(self, processed_df: pd.DataFrame) -> List[Dict[str, Any]]:
        exp = self.explainer.explain_instance(processed_df.iloc[0].values, self.model.predict_proba, num_features=5)
        
        # ✨ Return a structured explanation, not a raw string
        explanation_list = []
        for feature, weight in exp.as_list():
            explanation_list.append({"feature": feature, "weight": weight})
        return explanation_list

    def predict(self, data: PredictionInput) -> Dict[str, Any]:
        processed_df = self._preprocess(data)
        prediction = self.model.predict(processed_df)[0]
        explanation = self._get_explanation(processed_df)

        return {
            "fraud_flag": int(prediction),
            "explanation": explanation
        }