import pandas as pd
import random

# Define all 14 clusters with their labels.
clusters = {
    1: "High in Carbs - Fibers, High Fiber_to_Carbs Ratio",
    2: "High in Calories, High in Fats, High in Fiber",
    3: "High in Vitamins, Vegetarian, Halal",
    4: "High in Carbs - Fibers - Sugar, High in Vitamins",
    5: "Rich in Fats, High in Protein, Non-Veg, Halal",
    6: "High in Carbs, High in Sugar, Vegetarian, Halal",
    7: "High Protien, High Fiber-to-Carbs Ratio, NON-Vegetarian",
    8: "High in Carbs - Fiber - Sugar - Fats, Vegetarian",
    9: "High in Vitamins - Minerals, High in Fiber, Vegetarian",
    10: "Balanced Diet, Vegetarian, Halal",
    11: "Low Carbs, Low Protein, Rich In Vitamins/Minerals",
    12: "High Fiber, Moderate Carbs, High Fats, Vegetarian",
    13: "High Cholesterol, Moderate Protein, High Vitamins",
    14: "High Vitamin-b, High Minerals, Moderate Protein"
}

# Current primary clusters used in the synthetic dataset.
used_primary = {1, 3, 7, 9, 10, 14}
missing_primary = set(clusters.keys()) - used_primary  # Missing in Primary

# Current secondary clusters used in the synthetic dataset.
used_secondary = {3, 7, 9, 11, 10, 14}  # (order doesn't matter)
missing_secondary = set(clusters.keys()) - used_secondary  # Missing in Secondary

# Function to generate a synthetic entry.
def generate_entry(primary=None, secondary=None):
    entry = {
        "Age": random.randint(20, 70),
        "Weight": round(random.uniform(50, 100), 1),
        "Height_ft": round(random.uniform(4.5, 6.5), 1),
        "Profession": random.choice(["student", "teacher", "software engineer"]),
        "Religion": random.choice(["muslim", "non muslim"]),
        "Sleeping_Hours": round(random.uniform(5, 9), 1),
        "Gender": random.choice(["male", "female", "other"]),
        "Exercise_Level_days_per_week": random.randint(1, 7),
        "Medical_History": random.choice(["NON", "Diabetic", "heart disease"])
    }
    if primary:
        entry["Primary_Cluster"] = clusters[primary]
    else:
        entry["Primary_Cluster"] = random.choice(list(clusters.values()))
    if secondary:
        entry["Secondary_Cluster"] = clusters[secondary]
    else:
        entry["Secondary_Cluster"] = random.choice(list(clusters.values()))
    return entry

# Generate entries for missing primary clusters.
new_entries_primary = [generate_entry(primary=cl) for cl in missing_primary]

# Generate entries for missing secondary clusters.
new_entries_secondary = [generate_entry(secondary=cl) for cl in missing_secondary]

# Combine new entries.
new_entries = new_entries_primary + new_entries_secondary
new_df = pd.DataFrame(new_entries)

# Remove duplicates if the same combination (primary & secondary) appears.
unique_new_df = new_df.drop_duplicates(subset=["Primary_Cluster", "Secondary_Cluster"])

unique_new_df
