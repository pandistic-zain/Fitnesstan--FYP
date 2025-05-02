# app.py

from flask import Flask, jsonify, request
from datetime import datetime, date, timedelta
import logging, warnings, os, joblib, random, pandas as pd, numpy as np, re
from sklearn.exceptions import InconsistentVersionWarning

# ------------------------------
# suppress sklearn version‐mismatch noise
warnings.filterwarnings("ignore", category=InconsistentVersionWarning)

app = Flask(__name__)
app.logger.setLevel(logging.DEBUG)

# --- Configuration ---
PRIMARY_MODEL_PATH   = './Classification/ensemble_rf_xgb_tuned_primary_cluster.joblib'
SECONDARY_MODEL_PATH = './Classification/ensemble_rf_xgb_tuned_secondary_cluster.joblib'
ITEMS_CSV_PATH       = './Clustered_Nutrition.csv'
HGB_MODEL_PATH       = './Regression/hgb.pkl'
RIDGE_MODEL_PATH     = './Regression/ridge_poly.pkl'

# --- Nutrition regressor feature sets ---
MANDATORY_NUM = ["protein", "carbohydrate", "total_fat", "serving_weight"]
OPTIONAL_NUM  = ["saturated_fat", "fiber", "sugar", "sodium"]
CATEGORY_COL  = "category"

# --- Load item catalog ---
items_df = pd.read_csv(ITEMS_CSV_PATH)
items_df = items_df.loc[:, ~items_df.columns.str.contains(r'^Unnamed')]
app.logger.debug(f"Loaded items catalog: {len(items_df)} rows, {items_df.shape[1]} cols")

# --- Load calorie regressors ---
hgb_model   = joblib.load(HGB_MODEL_PATH)
ridge_model = joblib.load(RIDGE_MODEL_PATH)
app.logger.debug("Loaded HGB and Ridge calorie regressors")

# --- Ensemble loader ---
def load_ensemble(path):
    if not os.path.exists(path):
        raise FileNotFoundError(f"Missing model file: {path}")
    pkg = joblib.load(path, mmap_mode='r')
    app.logger.debug(f"Loaded ensemble keys={list(pkg.keys())} from {path}")
    expected = {'meta_learner','scaler','label_mapping','label_encoders','base_model_rf','base_model_xgb'}
    missing = expected - set(pkg.keys())
    if missing:
        raise RuntimeError(f"{path} is missing keys: {missing}")
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
    (primary_meta,
     primary_scaler,
     primary_label_map,
     primary_label_encs,
     primary_rf,
     primary_xgb) = load_ensemble(PRIMARY_MODEL_PATH)
    app.logger.debug("Primary ensemble loaded")
except Exception as e:
    app.logger.error(f"Primary load failed: {e}")
    primary_meta = primary_scaler = primary_label_map = primary_label_encs = primary_rf = primary_xgb = None

# --- Load secondary ensemble ---
try:
    (secondary_meta,
     secondary_scaler,
     secondary_label_map,
     secondary_label_encs,
     secondary_rf,
     secondary_xgb) = load_ensemble(SECONDARY_MODEL_PATH)
    app.logger.debug("Secondary ensemble loaded")
except Exception as e:
    app.logger.error(f"Secondary load failed: {e}")
    secondary_meta = secondary_scaler = secondary_label_map = secondary_label_encs = secondary_rf = secondary_xgb = None

# --- Feature order for clustering input ---
FEATURE_ORDER = [
    'Age','Weight','Height_ft','Profession','Religion',
    'Sleeping_Hours','Gender','Exercise_Level_days_per_week','Medical_History'
]

@app.route('/user', methods=['POST'])
def process_user():
    # in production, grab the JSON body directly
    user_data = request.get_json(force=True, silent=True)
    if not user_data:
        app.logger.error("No JSON body provided")
        return jsonify({'error': 'No user data provided'}), 400

    app.logger.debug(f"Received user_data from Spring Boot: {user_data}")

    # user_data = {
    #     'dob'            : '2004-01-18',
    #     'weightKg'       : 68,
    #     'heightFt'       : 5.6,
    #     'profession'     : 'student',
    #     'religion'       : 'muslim',
    #     'sleepHours'     : 7,
    #     'gender'         : 'male',
    #     'exerciseLevel'  : 6,
    #     'medicalHistory' : 'NON',
    #     'tdee'           : 2400
    # }
    app.logger.debug(f"Received user_data: {user_data}")

    # — clamp any negative TDEE/REE coming from the client —
    # if 'tdee' in user_data:
    #     user_data['tdee'] = abs(user_data['tdee'])
    # if 'ree' in user_data:
    #     user_data['ree'] = abs(user_data['ree'])

    raw_dob = user_data.get('dob')
    if isinstance(raw_dob, list) and len(raw_dob) == 3:
        # raw_dob: [year, month, day]
        user_data['dob'] = f"{raw_dob[0]:04d}-{raw_dob[1]:02d}-{raw_dob[2]:02d}"


    # exerciseLevel may be "6 days a week" -> extract integer
    ex = user_data.get('exerciseLevel')
    if isinstance(ex, str):
        m = re.search(r"(\d+)", ex)
        user_data['exerciseLevel'] = int(m.group(1)) if m else 0

    # sleepHours may come as "9 hours" -> extract integer
    sl = user_data.get('sleepHours')
    if isinstance(sl, str):
        n = re.search(r"(\d+)", sl)
        user_data['sleepHours'] = int(n.group(1)) if n else 0

    # medicalHistory may come as a single-element list
    mh = user_data.get('medicalHistory')
    if isinstance(mh, list) and len(mh) == 1:
        mh = mh[0]
    # normalize any “none”-like value → 'NON'
    if isinstance(mh, str) and mh.strip().lower() in ('', 'none'):
        normalized_mh = 'NON'
    else:
        # match against LabelEncoder classes if possible
        le = primary_label_encs.get('Medical_History') if primary_label_encs else None
        normalized_mh = mh
        if le is not None:
            for cls in le.classes_:
                if cls.lower() == str(mh).strip().lower():
                    normalized_mh = cls
                    break
    user_data['medicalHistory'] = normalized_mh

    # ensure categorical fields are lowercase for model compatibility
    for cat in ['profession', 'religion', 'gender']:
        if cat in user_data and isinstance(user_data[cat], str):
            user_data[cat] = user_data[cat].lower()
    app.logger.debug(
        f"Lowercased categorical fields: "
        f"{{'profession': {user_data.get('profession')}, "
        f"'religion': {user_data.get('religion')}, "
        f"'gender': {user_data.get('gender')}, "
        f"'medicalHistory': {user_data['medicalHistory']}}}"
    )

    app.logger.debug(f"Normalized user_data: {user_data}")

    try:
        # 1) Compute age
        dob = datetime.fromisoformat(user_data['dob'])
        age = (datetime.today() - dob).days // 365

        # 2) Raw feature dict
        # — fall back empty profession/religion to the first encoder class —
        prof = user_data.get('profession', '')
        le_prof = primary_label_encs.get('Profession') if primary_label_encs else None
        if le_prof and prof not in le_prof.classes_:
            prof = le_prof.classes_[0]

        relig = user_data.get('religion', '')
        le_relig = primary_label_encs.get('Religion') if primary_label_encs else None
        if le_relig and relig not in le_relig.classes_:
            relig = le_relig.classes_[0]

        row = {
            'Age'                          : age,
            'Weight'                       : user_data['weightKg'],
            'Height_ft'                    : user_data['heightFt'],
            'Profession'                   : prof,
            'Religion'                     : relig,
            'Sleeping_Hours'               : user_data['sleepHours'],
            'Gender'                       : user_data['gender'],
            'Exercise_Level_days_per_week' : user_data['exerciseLevel'],
            'Medical_History'              : user_data['medicalHistory']
        }
        app.logger.debug(f"Raw features: {row}")

        # 3) Encode & assemble clustering input
        X_raw = []
        for feat in FEATURE_ORDER:
            if feat in primary_label_encs:
                code = primary_label_encs[feat].transform([row[feat]])[0]
                X_raw.append(code)
            else:
                X_raw.append(row[feat])
        app.logger.debug(f"Encoded raw: {X_raw}")

        # 4) Scale & predict primary cluster
        X_scaled    = primary_scaler.transform([X_raw])
        rf_p, xgb_p = primary_rf.predict_proba(X_scaled), primary_xgb.predict_proba(X_scaled)
        meta_p      = np.hstack([rf_p, xgb_p])
        primary_pred= primary_meta.predict(meta_p)[0]
        app.logger.debug(f"Primary cluster: {primary_pred}")

        # 5) Scale & predict secondary cluster
        X_scaled_s     = secondary_scaler.transform([X_raw])
        rf_s, xgb_s    = secondary_rf.predict_proba(X_scaled_s), secondary_xgb.predict_proba(X_scaled_s)
        meta_s         = np.hstack([rf_s, xgb_s])
        secondary_pred = secondary_meta.predict(meta_s)[0]
        app.logger.debug(f"Secondary cluster: {secondary_pred}")

        # 6) Select item pools
        prim_items = items_df[items_df['KMeans_Cluster_14'] == primary_pred]
        sec_items  = items_df[items_df['KMeans_Cluster_14'] == secondary_pred]
        app.logger.debug(f"Primary pool size={len(prim_items)}, Secondary pool size={len(sec_items)}")

        # 7) Compute per-item calorie target
        tdee         = float(user_data['tdee'])
        half         = tdee / 2
        per_item_cal = half / 3
        app.logger.debug(f"TDEE={tdee}, half={half}, per_item_cal={per_item_cal}")

        # 8) Annotate helper: apply regressors & proportional scaling per item
        #    Assumes you’ve captured the exact list of regressor input columns in REG_FEATURES.
        REG_FEATURES = [
            *MANDATORY_NUM,
            *OPTIONAL_NUM,
            # then all of your one-hot category columns, e.g.:
            # "category_main_course", "category_snack", ...
        ]

        def annotate(sub):
            out = []
            for _, r in sub.iterrows():
                # --- 1) parse raw numeric features ---
                rec = {}
                for k in MANDATORY_NUM + OPTIONAL_NUM:
                    val = r.get(k, 0.0)
                    rec[k] = float(re.sub(r"[^\d.]", "", str(val)) or 0.0)

                # --- 2) required calories target ---
                rec['required_calories'] = round(per_item_cal, 2)

                # --- 3) build regressor DataFrame ---
                df_reg = pd.DataFrame([{
                    **{k: rec[k] for k in MANDATORY_NUM + OPTIONAL_NUM},
                    CATEGORY_COL: r.get(CATEGORY_COL, "main_course")
                }])
                Xr = pd.get_dummies(df_reg, columns=[CATEGORY_COL], drop_first=True)

                # --- 4) align columns to training ---
                for c in REG_FEATURES:
                    if c not in Xr.columns:
                        Xr[c] = 0
                Xr = Xr[REG_FEATURES]

                # --- 5) blended calorie prediction ---
                h  = hgb_model.predict(Xr)[0]
                ri = ridge_model.predict(Xr)[0]
                blend = 0.5 * (h + ri) or 1.0

                # --- 6) compute scaling ratio ---
                ratio = per_item_cal / blend

                # --- 7) scale macronutrients & serving_weight ---
                for nutr in MANDATORY_NUM + OPTIONAL_NUM:
                    rec[nutr] = round(rec[nutr] * ratio, 2)

                # serving_weight is mandatory too
                rec['serving_weight'] = rec['serving_weight']  # already scaled

                out.append(rec)

            return out

        # 9) Build 14-day plan
        full_plan = {}
        for day in range(1, 15):
            bf_items = prim_items.sample(min(3, len(prim_items)), replace=False)
            dn_items = sec_items.sample(min(3, len(sec_items)), replace=False)
            full_plan[str(day)] = {
                'meal1': annotate(bf_items),
                'meal2': annotate(dn_items)
            }

        # 10) Log each day’s selection
        for d, meals in full_plan.items():
            app.logger.debug(f"Day {d} meal1: {meals['meal1']}")
            app.logger.debug(f"Day {d} meal2: {meals['meal2']}")

        resp = {
            'primary_cluster'   : int(primary_pred),
            'secondary_cluster' : int(secondary_pred),
            'startDate'         : date.today().isoformat(),
            'endDate'           : (date.today()+timedelta(days=13)).isoformat(),
            'mealPlan'          : full_plan
        }
        # --- add this line ---
        resp['user'] = user_data

        app.logger.debug("Returning full response")
        return jsonify(resp), 200

    except Exception:
        app.logger.exception("Error in /user")
        return jsonify({'error':'server error'}), 500


if __name__=='__main__':
    app.run(debug=True, port=5000)
