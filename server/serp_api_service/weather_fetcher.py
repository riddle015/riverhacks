from serp_api_service.serp_api_handler import SerpApiService

class WeatherFetcher:
    def __init__(self):
        self.service = SerpApiService()

    def fetch_weather_for_location(self, location="Austin, Texas"):
        """
        Fetch current weather information for a specified location.
        """
        print(f"\n[WeatherFetcher] Fetching weather for {location}...")

        params = {
            "engine": "google",
            "q": f"{location} weather",
            "hl": "en",
            "gl": "us",
            "num": 1  # Only need top result
        }

        results = self.service.search(params=params)
        if not results:
            return None

        # Google's weather card usually appears in the 'answer_box' section
        weather_info = results.get("answer_box", {})

        if not weather_info:
            print("No weather information found.")
            return None

        return {
            "temperature": weather_info.get("temperature", "Unknown"),
            "unit": weather_info.get("units", "°F"),
            "description": weather_info.get("weather", "Unknown"),
            "precipitation": weather_info.get("precipitation", "Unknown"),
            "humidity": weather_info.get("humidity", "Unknown"),
            "wind": weather_info.get("wind", "Unknown")
        }
