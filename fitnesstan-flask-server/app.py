from flask import Flask, request, jsonify

app = Flask(__name__)

# Placeholder for the trained model (to be implemented later)
def trained_model(user_attributes):
    """
    Placeholder function for the trained model.
    This will process the user attributes and return a result.
    """
    print("[DEBUG] Inside trained_model function")  # Debug line
    print(f"[DEBUG] User attributes received: {user_attributes}")  # Debug line

    # Example: Return a dummy response based on BMI
    bmi = user_attributes.get("bmi", 0)
    if bmi < 18.5:
        return {"health_status": "Underweight"}
    elif 18.5 <= bmi < 25:
        return {"health_status": "Normal weight"}
    elif 25 <= bmi < 30:
        return {"health_status": "Overweight"}
    else:
        return {"health_status": "Obese"}

@app.route('/user', methods=['POST'])
def process_user():
    """
    Accepts user data from Spring Boot, extracts attributes,
    passes them to the trained model, and returns the result.
    """
    print("[DEBUG] Inside process_user endpoint")  # Debug line

    user_data = request.json
    if not user_data:
        print("[DEBUG] No data provided in the request")  # Debug line
        return jsonify({"error": "No data provided"}), 400

    try:
        # Extract relevant attributes from the user data
        user_attributes = {
            "height_ft": user_data.get("heightFt"),
            "weight_kg": user_data.get("weightKg"),
            "bmi": user_data.get("bmi"),
            "ree": user_data.get("ree"),
            "tdee": user_data.get("tdee"),
            "exercise_level": user_data.get("exerciseLevel"),
            "sleep_hours": user_data.get("sleepHours"),
            "medical_history": user_data.get("medicalHistory"),
            "gender": user_data.get("gender"),
            "age": user_data.get("dob"),  # Calculate age if needed
        }

        print(f"[DEBUG] Extracted user attributes: {user_attributes}")  # Debug line

        # Pass the attributes to the trained model
        model_response = trained_model(user_attributes)

        print(f"[DEBUG] Model response: {model_response}")  # Debug line

        # Return the model's response to Spring Boot
        return jsonify(model_response), 200

    except Exception as e:
        print(f"[DEBUG] Error occurred: {str(e)}")  # Debug line
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("[DEBUG] Starting Flask server on port 5000")  # Debug line
    app.run(debug=True, port=5000)