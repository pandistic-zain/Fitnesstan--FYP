import os
import time
import pandas as pd
import numpy as np
from sklearn.experimental import enable_halving_search_cv  # noqa
from sklearn.model_selection import train_test_split, KFold, HalvingGridSearchCV
from sklearn.preprocessing import LabelEncoder, RobustScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report
from imblearn.over_sampling import BorderlineSMOTE
import xgboost as xgb
import joblib
from tqdm import tqdm
from tabulate import tabulate

# ------------------------------
# Define a custom overall progress bar.
overall = tqdm(total=100, desc="Overall Progress", bar_format="{l_bar}{bar:20}{r_bar} {n_fmt}%")
def update_overall_progress(percent):
    """Update overall progress bar in 1% increments for a given percent."""
    for _ in range(percent):
        overall.update(1)
        time.sleep(0.005)

# ===============================
# STEP 2: Set the File Path (Hardcoded)
# ===============================
file_path = "generated_synthetic_data.csv"
print(f"[DEBUG] Using hardcoded file path: {file_path}")
print(f"[DEBUG] Current working directory: {os.getcwd()}")
print(f"[DEBUG] Files in current directory: {os.listdir(os.getcwd())}")
update_overall_progress(7)

# ===============================
# STEP 3: Load Dataset
# ===============================
print("[DEBUG] Loading dataset...")
try:
    df = pd.read_csv(file_path)
    print(f"[DEBUG] Dataset loaded successfully. Rows: {df.shape[0]}, Columns: {df.shape[1]}")
except Exception as e:
    print(f"[ERROR] Failed to load dataset. Exception: {e}")
    exit(1)
update_overall_progress(7)

# ===============================
# STEP 4: Data Preprocessing
# ===============================
features = [
    'Age', 'Weight', 'Height_ft', 'Profession', 'Religion',
    'Sleeping_Hours', 'Gender', 'Exercise_Level_days_per_week', 'Medical_History'
]
missing_features = [feat for feat in features if feat not in df.columns]
if missing_features:
    print(f"[ERROR] Missing expected features: {missing_features}")
    exit(1)
else:
    print("[DEBUG] All expected features found in the dataset.")

print("[DEBUG] Encoding categorical features...")
label_encoders = {}
for col in ['Profession', 'Religion', 'Gender', 'Medical_History']:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le
print("[DEBUG] Categorical encoding complete.")

print("[DEBUG] Scaling features using RobustScaler...")
scaler = RobustScaler()
df[features] = scaler.fit_transform(df[features])
print("[DEBUG] Feature scaling complete.")
update_overall_progress(7)

# ===============================
# STEP 5: Prepare tuning utilities
# ===============================
rf_param_grid = {
    'n_estimators': [300, 500, 1000],
    'max_depth': [15, 25, 35],
    'min_samples_split': [2, 5],
    'min_samples_leaf': [1, 2]
}
xgb_param_grid = {
    'n_estimators': [300, 500, 1000],
    'max_depth': [15, 25, 35],
    'learning_rate': [0.001, 0.0005],
    'subsample': [0.8, 1.0],
    'colsample_bytree': [0.8, 1.0]
}

# ===============================
# STEP 6: Define ensemble pipeline function
# ===============================
def run_ensemble_pipeline(target_col):
    print("\n" + "="*50)
    print(f"[INFO] Running ensemble pipeline for target: {target_col}")
    print("="*50)

    if target_col not in df.columns:
        print(f"[ERROR] '{target_col}' column is missing.")
        exit(1)
    y = LabelEncoder().fit_transform(df[target_col])
    print(f"[DEBUG] Encoded target '{target_col}' with classes: {np.unique(y)}")

    print("[DEBUG] Applying BorderlineSMOTE...")
    smote = BorderlineSMOTE(random_state=42)
    X_bal, y_bal = smote.fit_resample(df[features], y)
    print(f"[DEBUG] Post-SMOTE shape {X_bal.shape}, class counts {np.bincount(y_bal)}")

    X_train, X_test, y_train, y_test = train_test_split(
        X_bal, y_bal, test_size=0.2, random_state=42)
    print(f"[DEBUG] Train: {X_train.shape}, Test: {X_test.shape}")
    update_overall_progress(7)

    X_train_tune, X_val_tune, y_train_tune, y_val_tune = train_test_split(
        X_train, y_train, test_size=0.2, random_state=42)

    print("[DEBUG] Tuning RF with HalvingGridSearchCV...")
    rf = RandomForestClassifier(class_weight='balanced', random_state=42, n_jobs=4)
    rf_cv = HalvingGridSearchCV(
        rf, rf_param_grid,
        cv=3, scoring='accuracy',
        factor=2,
        n_jobs=4, verbose=1
    )
    rf_cv.fit(X_train, y_train)
    best_rf = rf_cv.best_estimator_
    print(f"[DEBUG] Best RF params: {rf_cv.best_params_}")

    print("[DEBUG] Tuning XGB with HalvingGridSearchCV...")
    xgb_base = xgb.XGBClassifier(
        objective='multi:softmax', num_class=len(np.unique(y)),
        eval_metric='mlogloss',
        random_state=42, n_jobs=4
    )
    xgb_cv = HalvingGridSearchCV(
        xgb_base, xgb_param_grid,
        cv=3, scoring='accuracy',
        factor=2,
        n_jobs=4, verbose=1
    )
    xgb_cv.fit(X_train_tune, y_train_tune)
    best_xgb = xgb_cv.best_estimator_
    print(f"[DEBUG] Best XGB params: {xgb_cv.best_params_}")
    update_overall_progress(7)

    print("[DEBUG] Generating stacking meta-features...")
    kf = KFold(n_splits=5, shuffle=True, random_state=42)
    n_classes = len(np.unique(y))
    meta_train = np.zeros((X_train.shape[0], n_classes*2))
    meta_test  = np.zeros((X_test.shape[0],  n_classes*2))
    
    # ===============================
    # Generating stacking meta-features
    # ===============================
    for tr, va in kf.split(X_train):
        best_rf.fit(X_train.iloc[tr], y_train.iloc[tr])  # Use iloc to index rows
        best_xgb.fit(
            X_train.iloc[tr], y_train.iloc[tr],  # Use iloc to index rows
            eval_set=[(X_train.iloc[va], y_train.iloc[va])],  # Use iloc to index validation rows
            early_stopping_rounds=20, verbose=False
        )

        meta_train[va,:n_classes]    = best_rf.predict_proba(X_train.iloc[va])  # Use iloc
        meta_train[va,n_classes:]    = best_xgb.predict_proba(X_train.iloc[va])  # Use iloc
        meta_test[:,:n_classes]     += best_rf.predict_proba(X_test)  / 5
        meta_test[:,n_classes:]     += best_xgb.predict_proba(X_test) / 5
        update_overall_progress(7)

    print("[DEBUG] Training meta-learner...")
    meta_learner = GradientBoostingClassifier(random_state=42)
    meta_learner.fit(meta_train, y_train)

    y_pred = meta_learner.predict(meta_test)
    scores = [
        ["Accuracy (%)", accuracy_score(y_test,y_pred)*100],
        ["Precision (%)", precision_score(y_test,y_pred,average='weighted')*100],
        ["Recall (%)", recall_score(y_test,y_pred,average='weighted')*100],
        ["F1 Score (%)", f1_score(y_test,y_pred,average='weighted')*100]
    ]
    print(tabulate(scores, headers=["Metric","Score"], tablefmt="pretty"))
    print(classification_report(y_test,y_pred))
    update_overall_progress(7)

    ensemble_pkg = {
        "meta_learner": meta_learner,
        "scaler": scaler,
        "label_encoders": label_encoders,
        "rf": best_rf,
        "xgb": best_xgb
    }
    out_file = f"ensemble_{target_col.lower()}.joblib"
    joblib.dump(ensemble_pkg, out_file)
    print(f"[DEBUG] Ensemble package saved to {out_file}")
    print("\n" + "="*50 + "\n")

# ===============================
# STEP 12: Run pipelines
# ===============================
for target_col in ["Primary_Cluster","Secondary_Cluster"]:
    run_ensemble_pipeline(target_col)

print("[INFO] All ensemble pipelines completed.")
update_overall_progress(23)
overall.close()
