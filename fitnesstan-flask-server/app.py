from flask import Flask, request, jsonify
from datetime import datetime, date, timedelta
import warnings
import pickle
import os
import joblib
import random
import pandas as pd
from sklearn.exceptions import InconsistentVersionWarning

# Suppress sklearn version mismatch warnings
warnings.filterwarnings("ignore", category=InconsistentVersionWarning)

app = Flask(__name__)

# --- Configuration ---
PRIMARY_MODEL_PATH = './Classification/ensemble_rf_xgb_tuned_primary_cluster.joblib'
SECONDARY_MODEL_PATH = './Classification/ensemble_rf_xgb_tuned_secondary_cluster.joblib'
ITEMS_CSV_PATH = './Clustered_Nutrition.csv'

# --- Load item catalog ---
items_df = pd.read_csv(ITEMS_CSV_PATH)
items_df = items_df.loc[:, ~items_df.columns.str.contains(r'^Unnamed')]



# --- Utility to load ensemble packages ---
def load_ensemble(path):
    if not os.path.exists(path):
        raise FileNotFoundError(f"Model file not found: {path}")
    try:
        # Load the model with joblib and compress the file
        pkg = joblib.load(path)  # joblib will handle compression automatically
    except EOFError as e:
        raise RuntimeError(f"Model file appears truncated or corrupted: {path}. Re-generate with joblib.dump.")
    except Exception as e:
        raise RuntimeError(f"Failed to load model: {e}")
    
    # Validate if the loaded object is a valid ensemble package
    expected_keys = {'meta_learner', 'scaler', 'label_mapping', 'base_model_rf', 'base_model_xgb'}
    if not isinstance(pkg, dict) or not expected_keys.issubset(pkg):
        raise RuntimeError(f"Loaded object from {path} is not a valid ensemble package. Expected keys: {expected_keys}")
    
    # Return the components of the ensemble package
    return pkg['meta_learner'], pkg['scaler'], pkg['label_mapping'], pkg['base_model_rf'], pkg['base_model_xgb']
# Attempt to load primary ensemble
try:
    primary_clf, primary_scaler, primary_label_mapping, primary_rf, primary_xgb = load_ensemble(PRIMARY_MODEL_PATH)
except Exception as e:
    app.logger.error(f"Primary model load failed: {e}")
    primary_clf = primary_scaler = primary_label_mapping = primary_rf = primary_xgb = None

# Attempt to load secondary ensemble
try:
    secondary_clf, secondary_scaler, secondary_label_mapping, secondary_rf, secondary_xgb = load_ensemble(SECONDARY_MODEL_PATH)
except Exception as e:
    app.logger.error(f"Secondary model load failed: {e}")
    secondary_clf = secondary_scaler = secondary_label_mapping = secondary_rf = secondary_xgb = None

# Expected feature order
FEATURE_ORDER = [
    'Age', 'Weight', 'Height_ft', 'Profession', 'Religion',
    'Sleeping_Hours', 'Gender', 'Exercise_Level_days_per_week', 'Medical_History'
]

@app.route('/user', methods=['POST'])
def process_user():
    # --- Manual testing override (comment out for Spring Boot) ---
    user_data = {
        'dob': '2004-01-18',  # YYYY-MM-DD
        'weightKg': 68,
        'heightFt': 5.6,
        'profession': 'Student',
        'religion': 'Muslim',
        'sleepHours': 7,
        'gender': 'Male',
        'exerciseLevel': 6,
        'medicalHistory': 'None'
    }
    # --- For Spring Boot, uncomment below ---
    # user_data = request.json or {}
    # if not user_data:
    #     return jsonify({'error':'No data provided'}),400

    try:
        # Compute age
        dob = datetime.fromisoformat(user_data['dob'])
        age = (datetime.today() - dob).days // 365
        # Build raw features
        row = {
            'Age': age,
            'Weight': user_data['weightKg'],
            'Height_ft': user_data['heightFt'],
            'Profession': user_data['profession'],
            'Religion': user_data['religion'],
            'Sleeping_Hours': user_data['sleepHours'],
            'Gender': user_data['gender'],
            'Exercise_Level_days_per_week': user_data['exerciseLevel'],
            'Medical_History': user_data['medicalHistory']
        }
        # Encode + assemble input vector
        input_vec = []
        for feat in FEATURE_ORDER:
            if feat in primary_label_mapping:
                input_vec.append(primary_label_mapping[feat].transform([row[feat]])[0])
            else:
                input_vec.append(row[feat])

        # Predict clusters
        Xp = primary_scaler.transform([input_vec])
        primary_pred = primary_clf.predict(Xp)[0]
        print(f"[DEBUG] Primary cluster: {primary_pred}")
        Xs = secondary_scaler.transform([input_vec])
        secondary_pred = secondary_clf.predict(Xs)[0]
        print(f"[DEBUG] Secondary cluster: {secondary_pred}")

        # Build 14-day meal plan
        prim_items = items_df[items_df['KMeans_Cluster_14'] == primary_pred].to_dict('records')
        sec_items = items_df[items_df['KMeans_Cluster_14'] == secondary_pred].to_dict('records')
        meal_plan = {}
        for day in range(1, 15):
            m1 = random.choice(prim_items) if prim_items else {}
            m2 = random.choice(sec_items) if sec_items else {}
            meal_plan[str(day)] = {'meal1': m1, 'meal2': m2}

        start = date.today().isoformat()
        end = (date.today() + timedelta(days=13)).isoformat()
        return jsonify({
            'primary_cluster': primary_pred,
            'secondary_cluster': secondary_pred,
            'startDate': start,
            'endDate': end,
            'mealPlan': meal_plan
        }), 200
    except Exception as e:
        app.logger.exception('Error in /user')
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
