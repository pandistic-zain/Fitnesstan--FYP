import requests

# API Configuration
API_KEY = '73fu4VtnrMbmuLbGXcmKB9025YeS4x1ipEmqgjrt'
BASE_URL = 'https://api.nal.usda.gov/fdc/v1/foods/search'

def fetch_data(query):
    """Fetch data from USDA API for a given query and print the response."""
    print(f"Fetching data for: {query}")
    params = {
        'api_key': API_KEY,
        'query': query,
        'dataType': ['Foundation', 'SR Legacy', 'Branded'],
        'pageSize': 2  # Reduced for simplicity to show just a couple of examples
    }
    response = requests.get(BASE_URL, params=params)
    if response.status_code == 200:
        return response.json()  # Return the full JSON response
    else:
        print(f"Failed to fetch data for {query}: {response.status_code}")
        return None

# Test the function with a specific food item
food_item = "Basmati Rice"
response_data = fetch_data(food_item)

if response_data:
    # Print the JSON response to see the structure and data
    import json
    print(json.dumps(response_data, indent=2))  # Pretty print the JSON data
