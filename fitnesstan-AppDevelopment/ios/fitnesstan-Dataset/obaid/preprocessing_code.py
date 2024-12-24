import pandas as pd

# Load the dataset
file_path = 'C:\\Users\\hp\\Desktop\\data\\nutrition.csv'  # Replace with the path to your dataset
data = pd.read_csv(file_path)

# Rename and map columns as needed
# Specify the columns you need
desired_columns = {
    'name': 'name',
    'serving_size': 'serving_size',
    'protein': 'protein',
    'carbohydrate': 'carbohydrates',
    'sugars': 'sugar',
    'fiber': 'fiber',
    'water': 'water',
    'calories': 'calories',
    'total_fat': 'total_fat'
}

# Standardize the column names in the dataset
data.columns = data.columns.str.lower().str.replace(' ', '_')

# Retain only the desired columns and rename them
cleaned_data = data[list(desired_columns.keys())].rename(columns=desired_columns)

# Replace missing values with 0
cleaned_data.fillna(0, inplace=True)

# Save the cleaned data to a new CSV file
output_path = 'C:\\Users\\hp\\Desktop\\data\\cleaned_nutrition.csv'
cleaned_data.to_csv(output_path, index=False)

print(f"Cleaned data has been saved to {output_path}")
