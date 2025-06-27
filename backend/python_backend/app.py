# python_backend/app.py
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from pydantic import ValidationError
from prediction_service import PredictionService, PredictionInput
import os

load_dotenv() # Load environment variables from .env

app = Flask(__name__)

# ✨ Instantiate the service once on startup
try:
    prediction_service = PredictionService()
except Exception as e:
    # If the service fails to load, the app is useless.
    print(f"❌ FATAL: Could not initialize PredictionService: {e}")
    prediction_service = None

@app.route('/predict', methods=['POST'])
def predict():
    if not prediction_service:
        return jsonify({"success": False, "error": {"message": "Prediction service is not available."}}), 503

    try:
        # ✨ Validate input data using the Pydantic model
        input_data = PredictionInput(**request.json)
        
        # Delegate the core logic to the service
        result = prediction_service.predict(input_data)
        
        # ✨ Use standardized success response
        return jsonify({"success": True, "data": result})

    except ValidationError as e:
        # Return a structured validation error
        return jsonify({"success": False, "error": {"message": "Invalid input data", "details": e.errors()}}), 400
    except Exception as e:
        print(f"❌ Error in /predict: {str(e)}")
        return jsonify({"success": False, "error": {"message": "An unexpected error occurred."}}), 500

if __name__ == '__main__':
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(host='0.0.0.0', port=5000, debug=debug_mode)