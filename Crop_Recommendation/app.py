from flask import Flask, request, jsonify
import joblib
import numpy as np
import os
import sys

app = Flask(__name__)

# Global model components
models = None
scaler = None
label_encoder = None

def load_model_components():
    global models, scaler, label_encoder
    
    try:
        # Load individual components instead of the main class
        models = joblib.load('models/trained_models.joblib')
        scaler = joblib.load('models/scaler.joblib') 
        label_encoder = joblib.load('models/label_encoder.joblib')
        
        print("[SUCCESS] Model components loaded successfully!")
        return True
    except Exception as e:
        print(f"[ERROR] Error loading components: {e}")
        return False

def predict_crop(soil_data):
    """Make crop prediction using loaded components"""
    # Prepare input
    input_array = np.array([[
        soil_data["N"], soil_data["P"], soil_data["K"],
        soil_data["temperature"], soil_data["humidity"],
        soil_data["ph"], soil_data["rainfall"]
    ]])
    
    input_scaled = scaler.transform(input_array)
    
    # Get predictions from all models
    predictions = {}
    
    for name, model in models.items():
        pred_class = model.predict(input_scaled)[0]
        pred_proba = np.max(model.predict_proba(input_scaled))
        pred_crop = label_encoder.inverse_transform([pred_class])[0]
        
        predictions[name] = {
            "crop": pred_crop,
            "confidence": float(pred_proba)
        }
    
    return predictions

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'python_version': '3.13.7',
        'model_loaded': models is not None,
        'message': 'Crop Recommendation API is running!'
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # Validate input
        required_fields = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400
        
        # Make prediction
        predictions = predict_crop(data)
        
        return jsonify({
            'predictions': predictions,
            'python_version': '3.13.7',
            'input': data,
            'status': 'success'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/sample-test', methods=['GET'])
def sample_test():
    """Test with cotton sample data"""
    sample_data = {
        "N": 118, "P": 46, "K": 20,
        "temperature": 24, "humidity": 80,
        "ph": 6.9, "rainfall": 80
    }
    
    try:
        predictions = predict_crop(sample_data)
        return jsonify({
            'predictions': predictions,
            'sample_data': sample_data,
            'expected': 'cotton',
            'status': 'success'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print(f"[INFO] Starting with Python {sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}")
    
    if load_model_components():
        print("[SUCCESS] Flask app ready with Python 3.13.7")
        print("[READY] Your 99.32% accuracy crop recommendation model is loaded!")
        print("[INFO] API available at http://localhost:5000")
        print("[TEST] Try: http://localhost:5000/sample-test")
        app.run(debug=True, host='0.0.0.0', port=5000)
    else:
        print("[ERROR] Cannot start - model components not loaded")
        print("[SOLUTION] Make sure all .joblib files are in the 'models/' folder")
