# ===============================
# STEP 1: Import Libraries
# ===============================
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, KFold
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier, AdaBoostClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score
import xgboost as xgb
from imblearn.over_sampling import SMOTE
import matplotlib.pyplot as plt
import pickle
from tqdm import tqdm

# ===============================
# STEP 2: Load Dataset (Local File)
# ===============================
# Ensure "generated_synthetic_data.csv" is in the same directory as this script,
# or update the file_path to the full path.
file_path = "generated_synthetic_data.csv"
df = pd.read_csv(file_path)

# ===============================
# STEP 3: Preprocessing
# ===============================
# Define features based on your dataset
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

# Encode categorical features using LabelEncoder
label_encoders = {}
for col in ['Profession', 'Religion', 'Gender', 'Medical_History']:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le

# Standard scale the features
scaler = StandardScaler()
df[features] = scaler.fit_transform(df[features])

# ===============================
# STEP 4: Target Encoding
# ===============================
# We use 'Primary_Cluster' as our classification target.
target = 'Primary_Cluster'
unique_labels = sorted(df[target].unique())
label_mapping = {label: idx for idx, label in enumerate(unique_labels)}
reverse_mapping = {idx: label for label, idx in label_mapping.items()}
df['Target_Encoded'] = df[target].map(label_mapping)

# Define X (features) and y (target)
X = df[features].values
y = df['Target_Encoded'].values

# ===============================
# STEP 5: Apply SMOTE for Class Balance
# ===============================
smote = SMOTE(random_state=42)
X_bal, y_bal = smote.fit_resample(X, y)

# ===============================
# STEP 6: Setup 5-Fold Cross-Validation
# ===============================
kf = KFold(n_splits=5, shuffle=True, random_state=42)
results = {}  # To store mean accuracy for each model
models = {}   # To store the final model from each training loop

# ===============================
# STEP 7: Train Random Forest with Progress Bar
# ===============================
print("\n🌲 Training Random Forest...")
rf_scores = []
for train_index, val_index in tqdm(kf.split(X_bal), total=5, desc="RF Folds"):
    X_train, X_val = X_bal[train_index], X_bal[val_index]
    y_train, y_val = y_bal[train_index], y_bal[val_index]
    rf = RandomForestClassifier(n_estimators=1000, max_depth=35, class_weight='balanced', random_state=42)
    rf.fit(X_train, y_train)
    rf_scores.append(accuracy_score(y_val, rf.predict(X_val)))
results["Random Forest"] = np.mean(rf_scores)
models["Random Forest"] = rf  # Stores the last trained model

# ===============================
# STEP 8: Train XGBoost with Native Progress Bar and CV Loop
# ===============================
print("\n⚡ Training XGBoost...")
# Initialize XGBoost model (its training shows a native progress bar)
xgb_model = xgb.XGBClassifier(
    n_estimators=1000,
    max_depth=35,
    learning_rate=0.0005,
    objective='multi:softmax',
    num_class=len(unique_labels),
    eval_metric='mlogloss',
    verbosity=1,
    use_label_encoder=False,
    random_state=42
)
# Fit on the entire balanced dataset first (to display native progress)
xgb_model.fit(X_bal, y_bal)
xgb_scores = []
for train_index, val_index in tqdm(kf.split(X_bal), total=5, desc="XGB Folds"):
    X_train, X_val = X_bal[train_index], X_bal[val_index]
    y_train, y_val = y_bal[train_index], y_bal[val_index]
    xgb_model.fit(X_train, y_train, verbose=False)
    xgb_scores.append(accuracy_score(y_val, xgb_model.predict(X_val)))
results["XGBoost"] = np.mean(xgb_scores)
models["XGBoost"] = xgb_model

# ===============================
# STEP 9: Train AdaBoost with Progress Bar
# ===============================
print("\n🌟 Training AdaBoost...")
ada_scores = []
for train_index, val_index in tqdm(kf.split(X_bal), total=5, desc="AdaBoost Folds"):
    X_train, X_val = X_bal[train_index], X_bal[val_index]
    y_train, y_val = y_bal[train_index], y_bal[val_index]
    ada = AdaBoostClassifier(
        estimator=DecisionTreeClassifier(max_depth=3),
        n_estimators=1000,
        learning_rate=0.0001,
        random_state=42
    )
    ada.fit(X_train, y_train)
    ada_scores.append(accuracy_score(y_val, ada.predict(X_val)))
results["AdaBoost"] = np.mean(ada_scores)
models["AdaBoost"] = ada

# ===============================
# STEP 10: Train SVM with Progress Bar
# ===============================
print("\n📈 Training SVM...")
svm_scores = []
for train_index, val_index in tqdm(kf.split(X_bal), total=5, desc="SVM Folds"):
    X_train, X_val = X_bal[train_index], X_bal[val_index]
    y_train, y_val = y_bal[train_index], y_bal[val_index]
    svm = SVC(kernel='linear', class_weight='balanced', probability=True, random_state=42)
    svm.fit(X_train, y_train)
    svm_scores.append(accuracy_score(y_val, svm.predict(X_val)))
results["SVM"] = np.mean(svm_scores)
models["SVM"] = svm

# ===============================
# STEP 11: Accuracy Comparison and Visualization
# ===============================
print("\n📊 5-Fold CV Mean Accuracy:")
for name, acc in results.items():
    print(f"{name}: {acc:.4f}")

plt.figure(figsize=(10, 5))
plt.bar(results.keys(), results.values(), color=['blue', 'green', 'orange', 'purple'])
plt.title("5-Fold CV Accuracy Comparison with Progress Bars")
plt.ylabel("Accuracy")
for i, v in enumerate(results.values()):
    plt.text(i, v + 0.005, f"{v:.4f}", ha='center')
plt.ylim(0, 1)
plt.tight_layout()
plt.show()

# ===============================
# STEP 12: Save the Best Model Locally
# ===============================
best_model_name = max(results, key=results.get)
best_model = models[best_model_name]
model_path = f"best_model_{best_model_name}.pkl"
with open(model_path, "wb") as f:
    pickle.dump(best_model, f)

print(f"\n✅ Best Model: {best_model_name} with accuracy {results[best_model_name]:.4f}")
print(f"📁 Model saved locally as: {model_path}")