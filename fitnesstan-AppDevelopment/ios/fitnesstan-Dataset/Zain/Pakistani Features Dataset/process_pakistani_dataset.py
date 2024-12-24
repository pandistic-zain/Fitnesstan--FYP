import requests
import pandas as pd
import time
# Your USDA API key
API_KEY = "73fu4VtnrMbmuLbGXcmKB9025YeS4x1ipEmqgjrt"

# Base URL for the USDA FoodData Central API
BASE_URL = "https://api.nal.usda.gov/fdc/v1/"

# Expanded list of ingredients and dishes commonly used in Pakistan and South Asia
ITEMS_TO_SEARCH = [
    # Grains and Cereals
    "Basmati Rice", "Wheat Flour", "Maida", "Barley", "Semolina", "Corn Flour",

    # Legumes and Pulses
    "Lentils", "Chana Dal", "Moong Dal", "Masoor Dal", "Urad Dal", "Chickpeas", "Black Eyed Peas", 
    "Kidney Beans", "Pigeon Peas",

    # Vegetables
    "Spinach", "Okra", "Eggplant", "Potato", "Tomato", "Onion", "Garlic", "Ginger", "Cauliflower", 
    "Cabbage", "Carrot", "Peas", "Bell Pepper", "Bottle Gourd", "Bitter Gourd", "Zucchini", "Radish",
    "Turnip", "Pumpkin", "Fenugreek Leaves", "Coriander Leaves", "Mint Leaves", "Green Chilies",

    # Fruits
    "Banana", "Mango", "Papaya", "Guava", "Apple", "Pomegranate", "Dates", "Oranges", 
    "Watermelon", "Melon", "Lychee", "Apricot", "Peach",

    # Oils and Fats
    "Mustard Oil", "Sunflower Oil", "Ghee", "Butter", "Coconut Oil", "Sesame Oil",

    # Proteins (Meat, Eggs, and Fish)
    "Mutton", "Beef", "Chicken", "Eggs", "Fish", "Shrimp", "Goat Liver",

    # Dairy
    "Paneer", "Milk", "Yogurt", "Cream", "Cheese", "Buttermilk",

    # Spices and Condiments
    "Cumin", "Coriander", "Turmeric", "Red Chili Powder", "Black Pepper", "Cloves", 
    "Cinnamon", "Cardamom", "Fennel Seeds", "Fenugreek Seeds", "Mustard Seeds", 
    "Tamarind", "Bay Leaves", "Carom Seeds", "Nigella Seeds", "Curry Leaves",

    # Nuts and Seeds
    "Almonds", "Cashews", "Peanuts", "Walnuts", "Pistachios", "Flax Seeds", "Chia Seeds", "Sesame Seeds",

    # Sweeteners
    "Sugar", "Jaggery", "Honey",

    # Miscellaneous
    "Green Tea", "Black Tea", "Pickles", "Salt", "Vinegar"
]

# Columns for the dataset
COLUMNS = [
    "Item Name", "Serving Size (g)", "Calories (kcal)", "Protein (g)", "Fat (g)",
    "Carbohydrates (g)", "Fiber (g)", "Iron (mg)", "Calcium (mg)", "Magnesium (mg)",
    "Vitamin D (µg)", "Potassium (mg)", "Sodium (mg)", "Zinc (mg)", "Vegetarian",
    "Pakistani", "Diabetic-Friendly"
]

# Function to search for foods with retry logic
def search_foods(query, page_size=50, page_number=1, retries=3, delay=5):
    endpoint = f"{BASE_URL}foods/search"
    params = {
        "api_key": API_KEY,
        "query": query,
        "pageSize": page_size,
        "pageNumber": page_number
    }
    for attempt in range(retries):
        try:
            response = requests.get(endpoint, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error searching for {query}: {e}")
            if attempt < retries - 1:
                print(f"Retrying in {delay} seconds...")
                time.sleep(delay)
            else:
                print(f"Failed to fetch search results for {query} after {retries} attempts.")
                return {}

# Function to get food details by FDC ID with retry logic
def get_food_details(fdc_id, retries=3, delay=5):
    endpoint = f"{BASE_URL}food/{fdc_id}"
    params = {"api_key": API_KEY}
    for attempt in range(retries):
        try:
            response = requests.get(endpoint, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching details for FDC ID {fdc_id}: {e}")
            if attempt < retries - 1:
                print(f"Retrying in {delay} seconds...")
                time.sleep(delay)
            else:
                print(f"Failed to fetch details for FDC ID {fdc_id} after {retries} attempts.")
                return {}

# Initialize an empty list to store data
data = []

# Iterate over each item and fetch details
for item in ITEMS_TO_SEARCH:
    print(f"Searching for {item}...")
    search_results = search_foods(item)
    for food in search_results.get("foods", []):
        fdc_id = food["fdcId"]
        details = get_food_details(fdc_id)
        if not details:
            continue
        try:
            # Safely process nutrient data
            nutrients = {}
            for nutrient in details.get("foodNutrients", []):
                nutrient_name = nutrient.get("nutrientName")
                amount = nutrient.get("amount")
                if nutrient_name and amount is not None:
                    nutrients[nutrient_name] = amount

            # Process foodAttributes safely
            food_attributes = details.get("foodAttributes", [])
            vegetarian = "True" if any(
                "vegetarian" in str(attr).lower() for attr in food_attributes
            ) else "False"

            # Extract relevant information
            item_data = {
                "Item Name": details.get("description", ""),
                "Serving Size (g)": 100,
                "Calories (kcal)": nutrients.get("Energy", None),
                "Protein (g)": nutrients.get("Protein", None),
                "Fat (g)": nutrients.get("Total lipid (fat)", None),
                "Carbohydrates (g)": nutrients.get("Carbohydrate, by difference", None),
                "Fiber (g)": nutrients.get("Fiber, total dietary", None),
                "Iron (mg)": nutrients.get("Iron, Fe", None),
                "Calcium (mg)": nutrients.get("Calcium, Ca", None),
                "Magnesium (mg)": nutrients.get("Magnesium, Mg", None),
                "Vitamin D (µg)": nutrients.get("Vitamin D (D2 + D3)", None),
                "Potassium (mg)": nutrients.get("Potassium, K", None),
                "Sodium (mg)": nutrients.get("Sodium, Na", None),
                "Zinc (mg)": nutrients.get("Zinc, Zn", None),
                "Vegetarian": vegetarian,
                "Pakistani": "True" if item.lower() in ["lentils", "chapati", "spinach", "mutton", "ghee"] else "False",
                "Diabetic-Friendly": "True" if nutrients.get("Carbohydrate, by difference", 0) < 20 and nutrients.get("Fiber, total dietary", 0) > 5 else "False"
            }
            data.append(item_data)

        except Exception as e:
            print(f"Error processing {item}: {e}")

# Create a DataFrame from the collected data
df = pd.DataFrame(data, columns=COLUMNS)

# Save the dataset to a CSV file
output_file = "./South_Asian_and_Pakistani_Cuisine_Dataset.csv"
df.to_csv(output_file, index=False)

print(f"Dataset saved as {output_file}")