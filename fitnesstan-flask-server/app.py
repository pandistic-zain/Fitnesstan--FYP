# app.py

from flask import Flask, jsonify, request
from datetime import datetime, date, timedelta
import logging, warnings, os, joblib, random, pandas as pd
from sklearn.exceptions import InconsistentVersionWarning

# ------------------------------
# suppress sklearn version‐mismatch noise
warnings.filterwarnings("ignore", category=InconsistentVersionWarning)

app = Flask(__name__)
app.logger.setLevel(logging.DEBUG)    # enable debug logging

# --- Configuration ---
PRIMARY_MODEL_PATH   = './Classification/ensemble_rf_xgb_tuned_primary_cluster.joblib'
SECONDARY_MODEL_PATH = './Classification/ensemble_rf_xgb_tuned_secondary_cluster.joblib'
ITEMS_CSV_PATH       = './Clustered_Nutrition.csv'

# --- Load item catalog ---
items_df = pd.read_csv(ITEMS_CSV_PATH)
items_df = items_df.loc[:, ~items_df.columns.str.contains(r'^Unnamed')]
app.logger.debug(f"Loaded items catalog with {len(items_df)} rows and {items_df.shape[1]} columns")

# --- Utility to load an ensemble package ---
def load_ensemble(path):
    if not os.path.exists(path):
        raise FileNotFoundError(f"Model file not found: {path}")
    try:
        pkg = joblib.load(path, mmap_mode='r')  # memory‐map for large files
        app.logger.debug(f"Loaded ensemble package keys={list(pkg.keys())} from {path}")
    except EOFError:
        raise RuntimeError(f"Model file appears truncated or corrupted: {path}")
    except Exception as e:
        raise RuntimeError(f"Failed to load model: {e}")

    expected = {'meta_learner','scaler','label_mapping','label_encoders','base_model_rf','base_model_xgb'}
    missing = expected - set(pkg.keys())
    if missing:
        raise RuntimeError(f"{path} is missing keys: {missing}")
    # Return in the same order we saved them:
    return (
        pkg['meta_learner'],
        pkg['scaler'],
        pkg['label_mapping'],
        pkg['label_encoders'],
        pkg['base_model_rf'],
        pkg['base_model_xgb']
    )

# --- Load primary ensemble ---
try:
    (primary_clf,
     primary_scaler,
     primary_label_mapping,
     primary_label_encoders,
     primary_rf,
     primary_xgb) = load_ensemble(PRIMARY_MODEL_PATH)
    app.logger.debug("Primary model loaded successfully")
except Exception as e:
    app.logger.error(f"Primary model load failed: {e}")
    primary_clf = primary_scaler = primary_label_mapping = primary_label_encoders = primary_rf = primary_xgb = None

# --- Load secondary ensemble ---
try:
    (secondary_clf,
     secondary_scaler,
     secondary_label_mapping,
     secondary_label_encoders,
     secondary_rf,
     secondary_xgb) = load_ensemble(SECONDARY_MODEL_PATH)
    app.logger.debug("Secondary model loaded successfully")
except Exception as e:
    app.logger.error(f"Secondary model load failed: {e}")
    secondary_clf = secondary_scaler = secondary_label_mapping = secondary_label_encoders = secondary_rf = secondary_xgb = None

# --- Feature order (must match training) ---
FEATURE_ORDER = [
    'Age','Weight','Height_ft','Profession','Religion',
    'Sleeping_Hours','Gender','Exercise_Level_days_per_week','Medical_History'
]

@app.route('/user', methods=['POST'])
def process_user():
    # --- Demo override: replace with request.json in prod ---
    user_data = {
        'dob'            : '2004-01-18',
        'weightKg'       : 68,
        'heightFt'       : 5.6,
        'profession'     : 'Student',
        'religion'       : 'Muslim',
        'sleepHours'     : 7,
        'gender'         : 'Male',
        'exerciseLevel'  : 6,
        'medicalHistory' : 'None'
    }
    app.logger.debug(f"Received user_data: {user_data}")

    try:
        # 1) Compute age
        dob = datetime.fromisoformat(user_data['dob'])
        age = (datetime.today() - dob).days // 365

        # 2) Build raw feature dict
        row = {
            'Age'                          : age,
            'Weight'                       : user_data['weightKg'],
            'Height_ft'                    : user_data['heightFt'],
            'Profession'                   : user_data['profession'],
            'Religion'                     : user_data['religion'],
            'Sleeping_Hours'               : user_data['sleepHours'],
            'Gender'                       : user_data['gender'],
            'Exercise_Level_days_per_week' : user_data['exerciseLevel'],
            'Medical_History'              : user_data['medicalHistory']
        }
        app.logger.debug(f"Raw features dict: {row}")

        # 3) Encode & assemble input vector
        input_vec = []
        for feat in FEATURE_ORDER:
            if feat in primary_label_encoders:
                code = primary_label_encoders[feat].transform([row[feat]])[0]
                input_vec.append(code)
            else:
                input_vec.append(row[feat])
        app.logger.debug(f"Encoded input vector: {input_vec}")

        # 4) Predict Primary cluster
        Xp = primary_scaler.transform([input_vec])
        primary_pred = primary_clf.predict(Xp)[0]
        app.logger.debug(f"Primary cluster prediction: {primary_pred}")

        # 5) Predict Secondary cluster
        Xs = secondary_scaler.transform([input_vec])
        secondary_pred = secondary_clf.predict(Xs)[0]
        app.logger.debug(f"Secondary cluster prediction: {secondary_pred}")

        # 6) Lookup items in each cluster & log top 5
        prim_items = items_df[items_df['KMeans_Cluster_14'] == primary_pred]
        sec_items  = items_df[items_df['KMeans_Cluster_14'] == secondary_pred]

        app.logger.debug(
            f"Primary cluster has {len(prim_items)} items; top 5:\n"
            + prim_items.head(5).to_string(index=False)
        )
        app.logger.debug(
            f"Secondary cluster has {len(sec_items)} items; top 5:\n"
            + sec_items.head(5).to_string(index=False)
        )

        # 7) Build 14-day meal plan
        meal_plan = {}
        for day in range(1, 15):
            m1 = prim_items.sample(1).to_dict('records')[0] if not prim_items.empty else {}
            m2 = sec_items.sample(1).to_dict('records')[0]  if not sec_items.empty  else {}
            meal_plan[str(day)] = {'meal1': m1, 'meal2': m2}

        response = {
            'primary_cluster'   : primary_pred,
            'secondary_cluster' : secondary_pred,
            'startDate'         : date.today().isoformat(),
            'endDate'           : (date.today()+timedelta(days=13)).isoformat(),
            'mealPlan'          : meal_plan
        }
        app.logger.debug(f"Response JSON: {response}")
        return jsonify(response), 200

    except Exception as e:
        app.logger.exception("Error in /user")
        return jsonify({'error': str(e)}), 500

if __name__=='__main__':
    app.run(debug=True, port=5000)
