from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle  # Use this if your model is saved as a .pkl file
import numpy as np

app = Flask(__name__)
CORS(app)

# Load your trained model
model = pickle.load(open('trained_model.pkl', 'rb'))  # Replace with your model's file name

@app.route('/calculate-diet', methods=['POST'])
def calculate_diet():
    try:
        # Get user data and TDEE from the request
        data = request.json
        tdee = data['tdee']
        user_info = data['user_data']  # Adjust based on the expected input format

        # Process data for the model
        input_data = np.array([user_info + [tdee]])  # Adjust based on your model's input format
        
        # Get predictions from the model
        diet_plan = model.predict(input_data)

        # Convert the prediction to a JSON response
        response = {
            'diet_plan': diet_plan.tolist()  # Ensure it's serializable
        }
        return jsonify(response)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Port 5000 for Flask
