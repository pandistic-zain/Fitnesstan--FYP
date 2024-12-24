import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sklearn.cluster import KMeans
from sklearn.ensemble import VotingClassifier
from sklearn.preprocessing import OneHotEncoder
from sklearn.impute import SimpleImputer
import pickle
from fastapi.middleware.cors import CORSMiddleware
# FastAPI App
app = FastAPI(title="Diet Recommendation API", version="1.1")



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Load Saved Models and Artifacts
with open("backend/voting_classifier_model.pkl", "rb") as model_file:
    voting_clf = pickle.load(model_file)

with open("backend/kmeans_model.pkl", "rb") as kmeans_file:
    kmeans = pickle.load(kmeans_file)

with open("backend/scaler.pkl", "rb") as scaler_file:
    scaler = pickle.load(scaler_file)

with open("backend/pca_model.pkl", "rb") as pca_file:
    pca = pickle.load(pca_file)

with open("backend/onehot_encoder.pkl", "rb") as encoder_file:
    onehot_encoder = pickle.load(encoder_file)

with open("backend/numeric_imputer.pkl", "rb") as num_imputer_file:
    numeric_imputer = pickle.load(num_imputer_file)

with open("backend/categorical_imputer.pkl", "rb") as cat_imputer_file:
    categorical_imputer = pickle.load(cat_imputer_file)

# Map Cluster Labels to Nutritional Diets
cluster_tags = {
    0: "High Protein, Low Fat",
    1: "Low Carb, High Fiber",
    2: "Balanced Diet",
    3: "High Sugar, Low Fiber",
    4: "Low Cholesterol",
    5: "Rich in Vitamins",
    6: "High Calorie Snacks",
    7: "Low Sodium",
    8: "High Iron Content",
    9: "Rich in Calcium",
    10: "Low Calorie, Low Fat",
    11: "High Potassium Foods",
    12: "Vitamin C Rich",
    13: "Low Fatty Acids"
}

# Exercise and Sleep Mapping
exercise_mapping = {'Sedentary': 1, '2 days a week': 2, '4 days a week': 4, '6 days a week': 6, 'Daily': 7}
sleep_mapping = {'4-5 hours': 4.5, '5-6 hours': 5.5, '6-7 hours': 6.5, '7-8 hours': 7.5}

# Input Model for User Data Validation
class UserInput(BaseModel):
    height_ft: float
    weight_kg: float
    gender: str
    occupation: str
    religion: str
    medical_history: str
    exercise_level: str
    sleep_hours: str
    dob: str

# API Endpoints
@app.post("/predict/")
def predict(user_data: UserInput):
    try:
        # Parse and preprocess user input
        dob = pd.to_datetime(user_data.dob)
        current_year = pd.Timestamp.now().year
        age = current_year - dob.year

        # Feature engineering
        height_m = user_data.height_ft * 0.3048
        bmi = user_data.weight_kg / (height_m ** 2)
        exercise_hours = exercise_mapping.get(user_data.exercise_level, 1)
        sleep_hours_num = sleep_mapping.get(user_data.sleep_hours, 4.5)
        exercise_to_sleep_ratio = exercise_hours / sleep_hours_num

        # Prepare DataFrame for preprocessing
        user_df = pd.DataFrame({
            'Height (m)': [height_m],
            'Weight (kg)': [user_data.weight_kg],
            'Gender': [user_data.gender],
            'Occupation': [user_data.occupation],
            'Religion': ['Muslim' if user_data.religion == 'Muslim' else 'Non-Muslim'],
            'Medical History': [user_data.medical_history],
            'Exercise Hours': [exercise_hours],
            'Sleep Hours Num': [sleep_hours_num],
            'Exercise-to-Sleep Ratio': [exercise_to_sleep_ratio],
            'BMI': [bmi],
            'Age': [age],
            'Cluster_Labels': [0]  # Placeholder for prediction if needed
        })

        # Impute and encode
        X_numeric = numeric_imputer.transform(user_df[['Height (m)', 'Weight (kg)', 'Exercise Hours',
                                                       'Sleep Hours Num', 'Exercise-to-Sleep Ratio',
                                                       'BMI', 'Age', 'Cluster_Labels']])
        X_categorical = categorical_imputer.transform(user_df[['Gender', 'Occupation', 'Religion', 'Medical History']])
        X_categorical_encoded = onehot_encoder.transform(X_categorical)

        # Combine features
        X_user_preprocessed = np.hstack([X_numeric, X_categorical_encoded.toarray()])

        # Predict probabilities for clusters
        cluster_probabilities = voting_clf.predict_proba(X_user_preprocessed)[0]
        sorted_clusters = np.argsort(cluster_probabilities)[::-1]

        # Top 2 predicted clusters
        primary_cluster = sorted_clusters[0]
        secondary_cluster = sorted_clusters[1]

        # Diet recommendations for both clusters
        primary_diet = cluster_tags.get(primary_cluster, "No specific diet recommendation available.")
        secondary_diet = cluster_tags.get(secondary_cluster, "No specific diet recommendation available.")

        return {
            "primary_cluster": int(primary_cluster),
            "primary_diet": primary_diet,
            "secondary_cluster": int(secondary_cluster),
            "secondary_diet": secondary_diet
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# Root Endpoint
@app.get("/")
def root():
    return {"message": "Welcome to the Diet Recommendation API!"}
