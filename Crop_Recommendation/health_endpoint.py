# Add health check endpoint to Crop Recommendation
@app.route('/health', methods=['GET'])
def health():
    try:
        # Check if models are loaded
        if models is not None and scaler is not None and label_encoder is not None:
            return jsonify({
                'status': 'healthy',
                'service': 'crop-recommendation',
                'models_loaded': True,
                'version': '1.0.0'
            }), 200
        else:
            return jsonify({
                'status': 'unhealthy',
                'service': 'crop-recommendation',
                'models_loaded': False,
                'error': 'Models not loaded'
            }), 503
    except Exception as e:
        return jsonify({
            'status': 'error',
            'service': 'crop-recommendation',
            'error': str(e)
        }), 500
