import requests
import pandas as pd

# API configuration
API_KEY = '73fu4VtnrMbmuLbGXcmKB9025YeS4x1ipEmqgjrt'
BASE_URL = 'https://api.nal.usda.gov/fdc/v1/foods/search'

PAKISTANI_ITEMS = [
    "Basmati Rice","Rice", "Wheat Flour", "Maida", "Barley", "Semolina", "Corn Flour",
    "Lentils", "Chana Dal", "Moong Dal", "Masoor Dal", "Urad Dal", "Chickpeas",
    "Black Eyed Peas", "Kidney Beans", "Pigeon Peas", "Spinach", "Okra", "Biryani",
    "Butter Chicken", "Chicken Tikka Masala", "Chapati", "Eggplant", "Potato",
    "Tomato", "Onion", "Garlic", "Ginger", "Cauliflower", "Cabbage", "Carrot", "Peas",
    "Bell Pepper", "Bottle Gourd", "Bitter Gourd", "Zucchini", "Radish", "Turnip",
    "Pumpkin", "Fenugreek Leaves", "Coriander Leaves", "Mint Leaves", "Green Chilies",
    "Banana", "Mango", "Papaya", "Guava", "Apple", "Pomegranate", "Dates", "Oranges",
    "Watermelon", "Melon", "Lychee", "Apricot", "Peach", "Mustard Oil", "Sunflower Oil",
    "Ghee", "Butter", "Coconut Oil", "Sesame Oil", "Mutton", "Beef", "Chicken", "Eggs",
    "Fish", "Shrimp", "Goat Liver", "Paneer", "Milk", "Yogurt", "Cream", "Cheese",
    "Buttermilk", "Cumin", "Coriander", "Turmeric", "Red Chili Powder", "Black Pepper",
    "Cloves", "Cinnamon", "Cardamom", "Fennel Seeds", "Fenugreek Seeds", "Mustard Seeds",
    "Tamarind", "Bay Leaves", "Carom Seeds", "Nigella Seeds", "Curry Leaves", "Almonds",
    "Cashews", "Peanuts", "Walnuts", "Pistachios", "Flax Seeds", "Chia Seeds",
    "Sesame Seeds", "Sugar", "Jaggery", "Jalebi", "Honey", "Green Tea", "Black Tea",
    "Pickles", "Salt", "Vinegar", "Sindhi Curry", "Sindhi Biryani", "Sai Bhaji",
    "Tandoori Roti", "Ajwa Dates", "Aseel Dates", "Lassi", "Sarson ka Saag",
    "Makki di Roti", "Gajrela", "Butter Naan", "Desi Ghee", "Sajji", "Kaak", "Landi",
    "Ash-e-dosh", "Chapli Kabab", "Shinwari Karahi", "Kabuli Pulao", "Mantu",
    "Namkeen Gosht", "Kashmiri Chai", "Rista", "Gushtaba", "Roghni Naan",
    "Balay", "Chapshuro", "Buckwheat Bread", "Mulberry Jam", "Apricot Oil", "Yak Milk",
    "Samosa", "Pakoras", "Gajar Halwa", "Kheer", "Ras Malai", "Gulab Jamun", "Barfi",
    "Falooda", "Seviyan", "Anardana", "Dry Mango Powder", "White Pepper", "Asafoetida",
    "Rooh Afza", "Thadal", "Shakar", "Rusk", "Fish Roe", "Khatti Daal", "Shinwari Gosht",
    "Shami Kabab", "Seekh Kabab", "Afghani Pulao", "Halwa Puri", "Murgh Cholay",
    "Almond Milk", "Panjiri", "Chicken Handi", "Haleem", "Nihari", "Qeema", "Paratha",
    "Aloo Bhujia", "Chicken Korma", "Karahi Gosht", "Chicken Karahi", "Lobia",
    "Koftay", "Shahi Tukray", "Sheer Khurma"
]

NON_PAKISTANI_ITEMS = [
    # East Asian (Chinese, Japanese, Korean)
    "Sushi", "Ramen", "Chow Mein", "Spring Rolls", "Kimchi", "Dim Sum", "Bibimbap",
    "Dumplings", "Tempura", "Peking Duck", "Kung Pao Chicken", "Teriyaki Chicken",
    "Bulgogi", "Miso Soup", "Tofu Stir Fry",

    # Middle Eastern and Mediterranean
    "Falafel", "Hummus", "Shawarma", "Pita Bread", "Tabbouleh", "Baklava",
    "Fattoush", "Kebab", "Dolma", "Moussaka", "Greek Salad", "Baba Ganoush",
    "Hummus with Tahini", "Labneh", "Shakshuka",

    # Southeast Asian (Thai, Vietnamese)
    "Pad Thai", "Pho", "Curry Puffs", "Laksa", "Som Tam", "Nasi Goreng",
    "Satay", "Banh Mi", "Tom Yum", "Rendang", "Chicken Satay", "Beef Rendang",
    "Green Curry", "Red Curry", "Yellow Curry",

    # South Asian (Indian but non-Pakistani)
    "Dosa", "Idli", "Vindaloo", "Saag Paneer","Biryani"
    , "Rogan Josh",
    "Naan Bread", "Pav Bhaji", "Chole Bhature", "Palak Paneer",

    # Additional Miscellaneous International Items
    "Tacos", "Pizza", "Lasagna", "Ratatouille", "Sauerbraten", "Paella",
    "Sushi", "Quiche", "Risotto", "Goulash", "Ceviche", "Empanadas",
    "Crepes", "Macaroni and Cheese", "Fish and Chips",

    # African Dishes
    "Jollof Rice", "Couscous", "Piri Piri Chicken", "Egusi Soup", "Suya",
    "Maafe", "Bobotie", "Biltong", "Injera", "Tagine",

    # Latin American Dishes
    "Feijoada", "Arepa", "Pupusa", "Tamales", "Moqueca", "Pozole",
    "Asado", "Chimichurri", "Carnitas", "Churros",

    # European Dishes
    "Pierogi", "Schnitzel", "Coq au Vin", "Borscht", "Fish and Chips",
    "Haggis", "Stroopwafel", "Paella", "Ratatouille", "Bouillabaisse"
]

def classify_meal_type(item_name):
    # Define meal type categories with inclusive item lists
    breakfast_items = [
    "egg", "milk", "cereal", "bread", "butter", "yogurt", "oatmeal", "pancake", "paratha", "chai", "toast",
    "porridge", "muesli", "cheese", "smoothie", "lassi", "honey", "ajwa dates", "aseel dates", "green tea", "black tea",
    "lassi", "Sarson ka Saag", "Makki di Roti", "Roghni Naan", "nihari", "Ghee", "Butter", "Coconut Oil", "Sesame Oil",
    "Goat Liver", "Cinnamon", "Cardamom", "Butter Naan", "Desi Ghee", "Almond Milk", "Panjiri", "Haleem", "Kashmiri Chai",
    "Almonds","Chia Seeds","Cashews","Pistachios","Dates","Chopped Dates","Mango","Papaya Chunks","Raisins","Litchis, raw","Litchis, dried",
    "Peaches, canned, light syrup pack","Peach nectar, canned, with sucralose","Peaches, canned, extra heavy syrup pack","Peaches, canned, extra light syrup",
    "MAPLE CINNAMON GHEE","Pie","Pie, banana cream, prepared from recipe"
    ]

    lunch_items = [
    "rice", "dal", "vegetable", "curry", "paneer", "soup", "stew", "salad", "sandwich", "burger", "pasta", "pizza",
    "tacos", "noodles", "kebab", "dosa", "idli", "falafel", "shawarma", "pita", "biryani", "sindhi biryani", "sai bhaji",
    "tandoori roti", "chapati", "karahi", "korma", "qorma", "thali", "moussaka", "paella", "rogan josh", "palak paneer",
    "chole bhature", "pav bhaji", "tagine", "couscous", "Chana Dal", "Moong Dal", "Masoor Dal", "Tomato", "Onion", "Garlic",
    "Ginger", "Cauliflower", "Cabbage", "Carrot", "Pumpkin", "Fenugreek Leaves", "Coriander Leaves", "Mint Leaves",
    "Green Chilies", "Mustard Oil", "Sunflower Oil", "Mutton", "Beef", "Chicken", "Kashmiri Chai", "Rista", "Gushtaba",
    "Shinwari Gosht", "Shami Kabab", "Seekh Kabab", "Afghani Pulao", "Halwa Puri", "Murgh Cholay","haddock","Cut Okra","Spinach",
    "Green Pigeon Peas","Kidney Beans","Fish","Vinegar","cider","POLLO ASADO COOKING SAUCE","BROCCOLI CHEDDAR QUICHE","DI PARMA PROSCIUTTO",
    "CUMIN & CORIANDER POWDER"
    ]

    dinner_items = lunch_items + [
    "steak", "roast", "grill", "tikka", "masala", "lasagna", "sushi", "ramen", "jalfrezi", "handi", "haleem",
    "pulao", "sajji", "shinwari karahi", "kabuli pulao", "mandu", "gushtaba", "chicken karahi", "koftay", "chicken handi",
    "chapli kabab", "afghani pulao", "chicken korma", "karahi gosht", "Fish and Chips", "Biryani", "Kidney Beans",
    "Butter Chicken", "Chicken Tikka Masala", "Chapati", "Fish", "Shrimp", "Sajji", "Kaak", "Landi", "Ash-e-dosh",
    "Au Jus Gravy Mix","Oil, canola","Oil, coconut","Bay Leaves","Balsamic Vinegar","Oil, industrial, coconut (hydrogenated)",
    "PURITY FARMS GHEE","Oil, sunflower, linoleic (less than 60%)","Oil, sunflower, high oleic (70% and over)","Oil, sunflower, linoleic, (partially hydrogenated)",
    "Oil, sunflower, linoleic, (approx. 65%)","Oil, industrial, mid-oleic, sunflower","Oil, industrial, canola (partially hydrogenated)","Oil, wheat germ","Oil, soybean lecithin",
    "Oil, cupu assu","Oil, corn and canola","Mustard greens, cooked, boiled","BOUILLABAISSE","BAY LEAVES TURKISH","BEEF BULGOGI MARINADE",
    "KOREAN BBQ SAUCE","BEEF PHO BEEF FLAVOR NOODLE DISH WITH SOY","GARLIC & GINGER","RUSTIC RATATOUILLE COOKING SAUCE","MOTHER INDIA ORGANICS",
    "ALOO MATAR","THREE LAYER DIP","CARDAMOM PLANT-BASED GELATO"
    ]

    snack_items = [
    "fruit", "nuts", "chaat","panjiri", "shami kabab", "seekh kabab", "macaroni and cheese", "Banana", "Mango", "Papaya", "Guava", "Apple",
    "Pomegranate", "Dates", "Oranges", "Watermelon", "Melon", "Apricot", "Peach", "Fennel Seeds", "Fenugreek Seeds",
    "Mustard Seeds", "Tamarind", "Bay Leaves", "Carom Seeds", "Nigella Seeds", "Almonds", "Cashews",
    "Peanuts", "Walnuts", "Pistachios", "Flax Seeds", "Chia Seeds", "Sesame Seeds",
    "Hummus","Guava Nectar","Pomegranate Juice","LYCHEES IN HEAVY SYRUP","JANS, LYCHEE NECTAR","SOUR LYCHEE LI HING GUMMIES",
    "RASPBERRY ROSE LYCHEE GELATO","LYCHEE MINT SPARKLING BOTANICAL WATER","LYCHEE GINGER TEA INFUSION BAGS","LYCHEE FLAVORED PURE PREMIUM ALOE DRINK",
    "LYCHEE FLAVORED ALOE VERA DRINK WITH PULP","GOLDEN NEST, SWALLOW NEST BEVERAGE, LYCHEE","CALPICO, NON CARBONATED SOFT DRINK, LYCHEE",
    "MANGO LYCHEE ANTIOXIDANT DRINK","LYCHEE","MINI CHURROS","HERBAL BEVERAGE","MULBERRIES & GOJI BERRIES SUN-DRIED",
    " DRIED POWER BERRIES","TAM TAMS ONION","JAPANESE CRISPY SEAWEED","TOM YUM GOONG","STRAWBERRY","MELON","SUN DRIED TOMATO & BASIL HUMMUS",
    "WATERMELON RINGS, WATERMELON","DE MI PAIS, PLANTAIN STRIPS","SESAME SEEDS","canned","PAPAYA"
    ]

    unhealthy_items = [
    "fried", "sugar", "soda", "candy", "chocolate", "sweet", "dessert", "jalebi", "gulab jamun", "barfi", "falooda",
    "seviyan", "MIGHTY MICRO SUNFLOWER, PEA & RADISH MICROS MIX", "rooh afza", "thadal", "shakar", "ice cream", "donut", "cake", "pastry", "creme", "mousse","PURE MAPLE SYRUP",
    "Fast foods","chicken tenders","Corned beef loaf","jellied","DATE SYRUP","POMEGRANATE CALAMANSI-ADE", "chips", "biscuit", "cookie", "pakoras", "samosa", "popcorn", "pretzel", "dumpling",
    "puff", "roll", "ice cream", "cake", "donut", "pastry", "barfi", "gajar halwa", "kheer", "ras malai", "gulab jamun","falooda", "seviyan", "aloo bhujia", "jalebi",
    "sheer khurma", "shahi tukray","dolma", "baklava", "empanadas", "crepes"

    ]


        # Convert the item name to lowercase to facilitate case-insensitive matching
    item_name_lower = item_name.lower()

    # Check each category
    if any(food in item_name_lower for food in breakfast_items):
        return "Breakfast"
    elif any(food in item_name_lower for food in lunch_items):
        return "Lunch"
    elif any(food in item_name_lower for food in dinner_items):
        return "Dinner"
    elif any(food in item_name_lower for food in snack_items):
        return "Snack"
    elif any(food in item_name_lower for food in unhealthy_items):
        return "Unhealthy"

    # If no category is matched, return 'Unspecified'
    return "Unknown"



def fetch_data(query):
    print(f"Fetching data for: {query}")  # Progress feedback
    params = {
        'api_key': API_KEY,
        'query': query,
        'dataType': ['Foundation', 'SR Legacy', 'Branded'],
        'pageSize': 50
    }
    response = requests.get(BASE_URL, params=params)
    if response.status_code == 200:
        return response.json().get('foods', [])
    else:
        print(f"Failed to fetch data for {query}: {response.status_code}")
        return []

def extract_nutrients(foods, is_pakistani):
    food_list = []
    for food in foods:
        nutrients = {nutrient['nutrientName']: nutrient.get('value', 0) for nutrient in food.get('foodNutrients', [])}
        serving_size = food.get('servingSize', 'Not specified')
        serving_size_unit = food.get('servingSizeUnit', 'g')
        meal_type = classify_meal_type(food.get('description', 'No description'))
        household_serving = food.get('householdServingFullText', 'Not specified')
        calories = nutrients.get('Energy', 0)

        food_data = {
            'Item Name': food.get('description', 'No description'),
            'Serving Size': f"{serving_size} {serving_size_unit}" if serving_size != 'Not specified' else 'Not specified',
            'Household Serving': household_serving,  # Include household serving text
            'Brand Name': food.get('brandName', 'Not specified'),  # Assuming 'brandOwner' maps to 'brandName'
            'Ingredients': food.get('ingredients', 'Not specified'),
            'Market Country': food.get('marketCountry', 'Pakistan'),  # Assuming default as 'United States'
            'Calories (kcal)': calories,
            'Protein (g)': nutrients.get('Protein', 0),
            'Total Fat (g)': nutrients.get('Total lipid (fat)', 0),
            'Carbohydrates (g)': nutrients.get('Carbohydrate, by difference', 0),
            'Sugar (g)': nutrients.get('Total Sugars', 0),
            'Fiber (g)': nutrients.get('Fiber, total dietary', 0),
            'Sodium (mg)': nutrients.get('Sodium, Na', 0),
            'Cholesterol (mg)': nutrients.get('Cholesterol', 0),
            'Pakistani': is_pakistani,
            'Meal Type': meal_type
        }
        food_list.append(food_data)
    return food_list

all_foods = []

# Process items with progress feedback
total_items = len(PAKISTANI_ITEMS + NON_PAKISTANI_ITEMS)
current_item = 1
for item in PAKISTANI_ITEMS + NON_PAKISTANI_ITEMS:
    print(f"Processing {current_item}/{total_items}: {item}")  # Progress feedback
    item_foods = fetch_data(item)
    all_foods.extend(extract_nutrients(item_foods, item in PAKISTANI_ITEMS))
    current_item += 1

# Create DataFrame and save to CSV
df = pd.DataFrame(all_foods)
csv_file_path = './Pakistani_Cuisine_Nutritional_Data_with_Flags_and_Meal_Types.csv'
df.to_csv(csv_file_path, index=False)

print(f"Dataset saved to {csv_file_path}")
print(df.head())