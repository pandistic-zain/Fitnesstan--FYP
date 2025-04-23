import joblib
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

# Load the trained models
hgb_model = joblib.load('./hgb.pkl')
ridge_model = joblib.load('./ridge_poly.pkl')

# Define the column names based on the original training set
MANDATORY_NUM = ["protein", "carbohydrate", "total_fat", "serving_weight"]
OPTIONAL_NUM  = ["saturated_fat", "fiber", "sugar", "sodium"]

# Sample real-world like input for a meal (values represent a real-world food item)
test_meal = {
    "protein": 20.0,  # Example: grilled chicken breast
    "carbohydrate": 35.0,  # Example: rice (1/2 cup)
    "total_fat": 10.0,  # Example: olive oil in cooking
    "serving_weight": 150.0,  # 150 grams of the food
    "saturated_fat": 2.5,  # Example: from cooking oil or butter
    "fiber": 4.0,  # Example: fiber from vegetables
    "sugar": 5.0,  # Example: added sugars in sauce or dressing
    "sodium": 300.0,  # Example: sodium from salt or sauce
    "category": "main_course"  # Real-world category (could be "main_course", "snack", "dessert")
}

# Convert the test data into a DataFrame
test_data = pd.DataFrame([test_meal])

# Preprocess the data: apply scaling and one-hot encoding as done during training
X_test = pd.get_dummies(test_data[MANDATORY_NUM + OPTIONAL_NUM + ["category"]],
                        columns=["category"], drop_first=True)

# Ensure the correct order of columns (same as training data)
feature_names = X_test.columns.tolist()

# Make predictions with both models
hgb_prediction = hgb_model.predict(X_test)
ridge_prediction = ridge_model.predict(X_test)

# Blend the predictions (average of both models' predictions)
blend_prediction = 0.5 * (hgb_prediction + ridge_prediction)

# Output predictions
print(f"HGB Model Prediction: {hgb_prediction[0]:.2f} calories")
print(f"Ridge Model Prediction: {ridge_prediction[0]:.2f} calories")
print(f"Blend Model Prediction (Average): {blend_prediction[0]:.2f} calories")

# Compare predictions to see if both models are consistent or varying
