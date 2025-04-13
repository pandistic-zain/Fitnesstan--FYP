from flask import Flask, request, jsonify
from datetime import date, timedelta

app = Flask(__name__)

# Dummy trained model function
def trained_model(user_attributes):
    print("[DEBUG] Inside trained_model function")
    print(f"[DEBUG] User attributes received: {user_attributes}")
    bmi = user_attributes.get("bmi", 0)
    if bmi < 18.5:
        return {"health_status": "Underweight"}
    elif 18.5 <= bmi < 25:
        return {"health_status": "Normal weight"}
    elif 25 <= bmi < 30:
        return {"health_status": "Overweight"}
    else:
        return {"health_status": "Obese"}

# Dummy diet plan generator
def dummy_diet_plan():
    meal_plan = {}
    for day in range(1, 15):
        # Create two meals per day with detailed meal items
        meal1 = [
            {"name": "Oatmeal", "protein": 5.0, "carbs": 27.0, "fats": 3.0, "calories": 150.0, "weight": 40.0},
            {"name": "Fruit Salad", "protein": 1.0, "carbs": 15.0, "fats": 0.5, "calories": 70.0, "weight": 150.0},
            {"name": "Green Tea", "protein": 0.0, "carbs": 0.0, "fats": 0.0, "calories": 0.0, "weight": 250.0}
        ]
        meal2 = [
            {"name": "Grilled Chicken", "protein": 30.0, "carbs": 0.0, "fats": 5.0, "calories": 200.0, "weight": 100.0},
            {"name": "Brown Rice", "protein": 3.0, "carbs": 45.0, "fats": 1.0, "calories": 210.0, "weight": 150.0},
            {"name": "Steamed Vegetables", "protein": 2.0, "carbs": 10.0, "fats": 0.5, "calories": 50.0, "weight": 100.0}
        ]
        # The keys are strings so that Spring Boot can later parse them as integers.
        meal_plan[str(day)] = {"meal1": meal1, "meal2": meal2}
    return meal_plan

@app.route('/user', methods=['POST'])
def process_user():
    print("[DEBUG] Inside process_user endpoint")
    user_data = request.json
    if not user_data:
        print("[DEBUG] No data provided in the request")
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
            "age": user_data.get("dob"),  # You can calculate age if needed
        }
        print(f"[DEBUG] Extracted user attributes: {user_attributes}")

        # Get dummy response from the trained model function
        model_response = trained_model(user_attributes)
        print(f"[DEBUG] Model response: {model_response}")

        # Generate dummy diet plan
        diet_plan = dummy_diet_plan()
        start_date = date.today().isoformat()
        end_date = (date.today() + timedelta(days=14)).isoformat()

        # Create combined response
        response = {
            "model_response": model_response,
            "mealPlan": diet_plan,
            "startDate": start_date,
            "endDate": end_date
        }
        print(f"[DEBUG] Response prepared: {response}")
        return jsonify(response), 200

    except Exception as e:
        print(f"[DEBUG] Error occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("[DEBUG] Starting Flask server on port 5000")
    app.run(debug=True, port=5000)
