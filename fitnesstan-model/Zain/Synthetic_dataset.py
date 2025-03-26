
import pandas as pd
import numpy as np
import random

# Set random seed for reproducibility
random.seed(42)
np.random.seed(42)

# Define number of synthetic samples (adjust as needed)
n_samples = 100

# Define possible values for the categorical features
professions = ["student", "teacher", "software engineer", "athlete"]
religions = ["muslim", "non muslim"]
genders = ["male", "female", "other"]
exercise_levels = list(range(1, 8))  # Represents number of exercise days per week (1 to 7)
medical_histories = ["NON", "Diabetic", "heart disease"]

# Define cluster labels (based on your clustering output)
# Note: The order here follows the provided cluster indices.
cluster_labels = [
    "High in Carbs - Fibers, High Fiber_to_Carbs Ratio",      # from cluster 12
    "High in Calories, High in Fats, High in Fiber",           # from cluster 3
    "High in Vitamins, Vegitarian, Halal",                     # from cluster 0
    "High in Carbs - Fibers - Suger, High in Vitamins",        # from cluster 13
    "Rich in Fats, High in Protien, Non-Veg, Halal",            # from cluster 9
    "High in Carbs, High in Suger, Vegitarian, Halal",          # from cluster 6
    "High Protien, High Fiber-to-Carbs Ratio, NON-Vegetarian",  # from cluster 1
    "High in Carbs - Fiber - Suger - Fats, Vegitari",           # from cluster 10
    "High in Vitamins - Minerals, High in Fiber, Vegetarian",   # from cluster 11
    "Balanced Diet, Vegetarian, Halal",                        # from cluster 4
    "Low Carbs, Low Protien, Rich In Vitamins/Minerals",        # from cluster 8
    "High Fiber, Moderate Carbs, High Fats, Vegetarian",         # from cluster 2
    "High Cholesterol, Moderate Protien, High Vitamins",         # from cluster 7
    "High Vitamin-b, High Minerals, Moderate Protein"           # from cluster 5
]

# Function to assign two distinct clusters randomly
def assign_clusters():
    primary, secondary = random.sample(cluster_labels, 2)
    return primary, secondary

# Generate the synthetic dataset
data = []
for _ in range(n_samples):
    age = random.randint(18, 80)
    weight = round(random.uniform(50, 100), 1)      # weight in kg (adjust range as needed)
    height = round(random.uniform(4.5, 6.5), 1)       # height in ft (e.g., 5.6)
    profession = random.choice(professions)
    religion = random.choice(religions)
    sleeping_hours = round(random.uniform(5, 9), 1)   # sleeping hours per night
    gender = random.choice(genders)
    exercise_level = random.choice(exercise_levels)
    medical_history = random.choice(medical_histories)
    primary_cluster, secondary_cluster = assign_clusters()
    
    data.append({
        "Age": age,
        "Weight": weight,
        "Height_ft": height,
        "Profession": profession,
        "Religion": religion,
        "Sleeping_Hours": sleeping_hours,
        "Gender": gender,
        "Exercise_Level_days_per_week": exercise_level,
        "Medical_History": medical_history,
        "Primary_Cluster": primary_cluster,
        "Secondary_Cluster": secondary_cluster
    })

# Create a DataFrame
df = pd.DataFrame(data)

# Save the dataset to a CSV file on your local PC
df.to_csv("synthetic_dataset.csv", index=False)
print("Synthetic dataset created and saved as 'synthetic_dataset.csv'")
