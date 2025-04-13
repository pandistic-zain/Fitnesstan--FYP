"""
File: ensemble_rf_xgb_tuned.py

Description:
    This script demonstrates an ensemble of tuned Random Forest and XGBoost classifiers using stacking,
    handling two target variables: "Primary_Cluster" and "Secondary_Cluster". It performs:
      - Data preprocessing with RobustScaler and Label Encoding,
      - Applies a refined SMOTE variant (BorderlineSMOTE) for class balancing,
      - Hyperparameter tuning via RandomizedSearchCV for Random Forest and XGBoost (using the full parameter grid, n_jobs=2=22, and StratifiedKFold),
      - Stacking with 5-fold StratifiedCV (without early stopping) to generate meta-features,
      - Training of a meta-learner (Gradient Boosting Classifier) on the meta-features,
      - Evaluation (Accuracy, Precision, Recall, F1 Score) displayed in a formatted table,
      - Saving of the ensemble package to a pickle file.
      
    An overall progress bar (custom-designed) is updated in 1% increments through 13 major steps.
    
Usage:
    1. Ensure your CSV file (e.g., generated_synthetic_data.csv) is in the same directory.
    2. Run:
           python ensemble_rf_xgb_tuned_multi_target_with_custom_progress.py
"""

# ===============================
# STEP 1: Import Libraries
# ===============================
import os
import time
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split, StratifiedKFold, RandomizedSearchCV
from sklearn.preprocessing import LabelEncoder, RobustScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report
import xgboost as xgb
from imblearn.over_sampling import BorderlineSMOTE
import pickle
from tqdm import tqdm
import matplotlib.pyplot as plt
from tabulate import tabulate

# ------------------------------
# Define a custom overall progress bar.
overall = tqdm(total=100, desc="Overall Progress", bar_format="{l_bar}{bar:20}{r_bar} {n_fmt}%")
def update_overall_progress(percent):
    """Update overall progress bar in 1% increments for a given percent."""
    for _ in range(percent):
        overall.update(1)
        time.sleep(0.01)  # Short delay for visualization

# ===============================
# STEP 2: Set the File Path (Hardcoded)
# ===============================
file_path = "generated_synthetic_data.csv"  # Ensure this file is in the same directory.
print(f"[DEBUG] Using hardcoded file path: {file_path}")
print(f"[DEBUG] Current working directory: {os.getcwd()}")
print(f"[DEBUG] Files in current directory: {os.listdir(os.getcwd())}")
update_overall_progress(7)  # ~7%

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
update_overall_progress(7)  # ~14%

# ===============================
# STEP 4: Data Preprocessing
# ===============================
features = [
    'Age',
    'Weight',
    'Height_ft',
    'Profession',
    'Religion',
    'Sleeping_Hours',
    'Gender',
    'Exercise_Level_days_per_week',
    'Medical_History'
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
update_overall_progress(7)  # ~21%

# ===============================
# Define a function to run the ensemble pipeline for a given target.
def run_ensemble_pipeline(target_col):
    print("\n" + "="*50)
    print(f"[INFO] Running ensemble pipeline for target: {target_col}")
    print("="*50)
    
    # STEP A: Target Encoding for Current Target
    if target_col not in df.columns:
        print(f"[ERROR] '{target_col}' column is missing.")
        exit(1)
    print(f"[DEBUG] Encoding target column '{target_col}'...")
    unique_labels = sorted(df[target_col].unique())
    label_mapping = {label: idx for idx, label in enumerate(unique_labels)}
    reverse_mapping = {idx: label for label, idx in label_mapping.items()}
    df[f"Target_Encoded_{target_col}"] = df[target_col].map(label_mapping)
    print(f"[DEBUG] Unique labels for {target_col}: {unique_labels}")
    
    X_current = df[features].values
    y_current = df[f"Target_Encoded_{target_col}"].values

    # STEP B: Apply Refined SMOTE Variant (BorderlineSMOTE)
    print("[DEBUG] Applying BorderlineSMOTE for class balancing...")
    smote = BorderlineSMOTE(random_state=42)
    X_bal, y_bal = smote.fit_resample(X_current, y_current)
    print(f"[DEBUG] Post-SMOTE shape: {X_bal.shape} | Class distribution: {np.bincount(y_bal)}")
    
    # STEP C: Train-Test Split
    print("[DEBUG] Splitting data into training (80%) and test (20%) sets...")
    X_train, X_test, y_train, y_test = train_test_split(X_bal, y_bal, test_size=0.2, random_state=42, stratify=y_bal)
    print(f"[DEBUG] Training set: {X_train.shape}, Test set: {X_test.shape}")
    
    # STEP D: Hyperparameter Tuning for Base Models using RandomizedSearchCV with StratifiedKFold.
    print("[DEBUG] Tuning hyperparameters using RandomizedSearchCV...")
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
    
    strat_kfold = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    
    print("[DEBUG] Tuning Random Forest hyperparameters...")
    from sklearn.model_selection import RandomizedSearchCV
    rf_rs = RandomizedSearchCV(
        RandomForestClassifier(class_weight='balanced', random_state=42),
        rf_param_grid,
        n_iter=36,  # Full grid
        cv=strat_kfold,
        scoring='accuracy',
        n_jobs=2,
        verbose=1,
        random_state=42
    )
    rf_rs.fit(X_train, y_train)
    best_rf_params = rf_rs.best_params_
    print(f"[DEBUG] Best RF parameters for {target_col}: {best_rf_params}")
    
    print("[DEBUG] Tuning XGBoost hyperparameters...")
    xgb_rs = RandomizedSearchCV(
        xgb.XGBClassifier(objective='multi:softmax',
                          num_class=len(unique_labels),
                          eval_metric='mlogloss',
                          verbosity=1,
                          use_label_encoder=False,
                          random_state=42),
        xgb_param_grid,
        n_iter=36,  # Full grid
        cv=strat_kfold,
        scoring='accuracy',
        n_jobs=2,
        verbose=1,
        random_state=42
    )
    xgb_rs.fit(X_train, y_train)
    best_xgb_params = xgb_rs.best_params_
    print(f"[DEBUG] Best XGB parameters for {target_col}: {best_xgb_params}")
    
    # STEP E: Define Tuned Base Models for Stacking.
    print("[DEBUG] Defining tuned base models for stacking...")
    tuned_rf = RandomForestClassifier(
        n_estimators=best_rf_params['n_estimators'],
        max_depth=best_rf_params['max_depth'],
        min_samples_split=best_rf_params['min_samples_split'],
        min_samples_leaf=best_rf_params['min_samples_leaf'],
        class_weight='balanced',
        random_state=42,
        n_jobs=2
    )
    tuned_xgb = xgb.XGBClassifier(
        n_estimators=best_xgb_params['n_estimators'],
        max_depth=best_xgb_params['max_depth'],
        learning_rate=best_xgb_params['learning_rate'],
        subsample=best_xgb_params['subsample'],
        colsample_bytree=best_xgb_params['colsample_bytree'],
        objective='multi:softmax',
        num_class=len(unique_labels),
        eval_metric='mlogloss',
        verbosity=1,
        use_label_encoder=False,
        random_state=42,
        n_jobs=2
    )
    
    # STEP F: Generate Meta-Features via Stacking (5-Fold Stratified CV)
    print("[DEBUG] Generating meta-features for stacking using 5-Fold Stratified CV...")
    strat_kf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    meta_train_rf = np.zeros((X_train.shape[0], len(unique_labels)))
    meta_train_xgb = np.zeros((X_train.shape[0], len(unique_labels)))
    meta_test_rf = np.zeros((X_test.shape[0], len(unique_labels)))
    meta_test_xgb = np.zeros((X_test.shape[0], len(unique_labels)))
    
    for train_index, val_index in tqdm(strat_kf.split(X_train, y_train), total=5, desc="Stacking Folds"):
        X_fold_train, X_fold_val = X_train[train_index], X_train[val_index]
        y_fold_train, y_fold_val = y_train[train_index], y_train[val_index]
        
        # Train tuned Random Forest on current fold.
        rf_fold = tuned_rf
        rf_fold.fit(X_fold_train, y_fold_train)
        meta_train_rf[val_index] = rf_fold.predict_proba(X_fold_val)
        meta_test_rf += rf_fold.predict_proba(X_test) / 5
        
        # Train tuned XGBoost on current fold without early stopping.
        xgb_fold = tuned_xgb
        xgb_fold.fit(X_fold_train, y_fold_train, eval_set=[(X_fold_val, y_fold_val)], verbose=False)
        meta_train_xgb[val_index] = xgb_fold.predict_proba(X_fold_val)
        meta_test_xgb += xgb_fold.predict_proba(X_test) / 5

    meta_train = np.concatenate([meta_train_rf, meta_train_xgb], axis=1)
    meta_test = np.concatenate([meta_test_rf, meta_test_xgb], axis=1)
    print(f"[DEBUG] Meta-features generated for {target_col}. Meta_train shape: {meta_train.shape}")
    
    # STEP G: Train Meta-Learner (Gradient Boosting Classifier)
    print(f"[DEBUG] Training meta-learner (Gradient Boosting Classifier) for {target_col}...")
    from sklearn.ensemble import GradientBoostingClassifier
    meta_learner = GradientBoostingClassifier(random_state=42)
    meta_learner.fit(meta_train, y_train)
    
    ensemble_pred = meta_learner.predict(meta_test)
    ensemble_accuracy = accuracy_score(y_test, ensemble_pred)
    ensemble_precision = precision_score(y_test, ensemble_pred, average='weighted')
    ensemble_recall = recall_score(y_test, ensemble_pred, average='weighted')
    ensemble_f1 = f1_score(y_test, ensemble_pred, average='weighted')
    
    # STEP H: Display Evaluation Metrics in a Formatted Table
    metrics_table = [
        ["Accuracy (%)", f"{ensemble_accuracy*100:.2f}"],
        ["Precision (%)", f"{ensemble_precision*100:.2f}"],
        ["Recall (%)", f"{ensemble_recall*100:.2f}"],
        ["F1 Score (%)", f"{ensemble_f1*100:.2f}"]
    ]
    print("\n" + "="*50)
    print(f"Ensemble Model Evaluation Metrics for {target_col} (Weighted Averages)")
    print("="*50)
    print(tabulate(metrics_table, headers=["Metric", "Score"], tablefmt="pretty"))
    print("\n")  # Extra spacing for clarity
    print("Full Classification Report:")
    print(classification_report(y_test, ensemble_pred, target_names=[str(l) for l in unique_labels]))
    
    # STEP I: Save the Ensemble Package for Current Target
    ensemble_package = {
        "meta_learner": meta_learner,
        "label_mapping": label_mapping,
        "scaler": scaler,
        "base_model_rf": tuned_rf,
        "base_model_xgb": tuned_xgb
    }
    file_name = f"ensemble_rf_xgb_tuned_{target_col.lower()}.pkl"
    with open(file_name, "wb") as f:
        pickle.dump(ensemble_package, f)
    print(f"\n[DEBUG] Ensemble model package for {target_col} saved as {file_name}")
    print("\n" + "="*50 + "\n")
    # End of pipeline for current target.

# End of run_ensemble_pipeline function.

# ===============================
# STEP 12: Main Execution: Run pipeline for both targets.
# ===============================
for target_col in ["Primary_Cluster", "Secondary_Cluster"]:
    run_ensemble_pipeline(target_col)
    
print("[INFO] All ensemble pipelines completed.")
update_overall_progress(23)  # Final update to reach 100%
overall.close()
