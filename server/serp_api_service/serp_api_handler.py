import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class SerpApiService:
    def __init__(self):
        self.api_key = os.getenv("SERPAPI_API_KEY")
        self.base_url = "https://serpapi.com/search.json"

    def search(self, query=None, params=None):
        """
        Perform a search using SerpApi.

        Args:
            query (str, optional): Basic search query. Used if params not provided.
            params (dict, optional): Full params dictionary for advanced searches.

        Returns:
            dict: JSON response from SerpApi, or None if an error occurs.
        """
        if not self.api_key:
            raise ValueError("SerpApi API key is missing. Please check your .env file.")

        # Build request parameters
        if params is None:
            if not query:
                raise ValueError("Either 'query' or 'params' must be provided for a search.")
            params = {
                "engine": "google",  # Default search engine
                "q": query,
            }

        params["api_key"] = self.api_key

        try:
            response = requests.get(self.base_url, params=params)
            response.raise_for_status()  # Raise exception for bad HTTP responses
            return response.json()
        except requests.RequestException as e:
            print(f"Error contacting SerpApi: {e}")
            return None
