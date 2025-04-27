import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

class SerpApiService:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv('SERPAPI_API_KEY')
        self.base_url = "https://serpapi.com/search"

    def search(self, query, location="Austin, Texas", lat=None, lon=None, num_results=10):
        """Perform a search query using SerpApi."""
        params = {
            "q": query,
            "location": location,
            "num": num_results,
            "api_key": self.api_key
        }

        if lat is not None and lon is not None:
            # If lat/lon provided, use that as the location
            params["location"] = f"{lat},{lon}"

        try:
            response = requests.get(self.base_url, params=params)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error while making SerpApi request: {e}")
            return None
