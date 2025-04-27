from math import radians, cos, sin, sqrt, atan2
from serp_api_service.serp_api_handler import SerpApiService

class LocalInfoFetcher:
    def __init__(self):
        self.service = SerpApiService()

    def fetch_places(self, search_term, location="Austin, Texas"):
        # (same fetch_places method you already have)
        ...

    def calculate_distance_miles(self, lat1, lon1, lat2, lon2):
        """
        Calculate distance between two GPS coordinates in miles.
        """
        R = 3958.8  # Radius of Earth in miles
        lat1_rad, lon1_rad = radians(lat1), radians(lon1)
        lat2_rad, lon2_rad = radians(lat2), radians(lon2)

        dlon = lon2_rad - lon1_rad
        dlat = lat2_rad - lat1_rad
        a = sin(dlat/2)**2 + cos(lat1_rad) * cos(lat2_rad) * sin(dlon/2)**2
        c = 2 * atan2(sqrt(a), sqrt(1 - a))
        distance = R * c

        return round(distance, 2)

    def find_nearest_safe_places(self, user_latitude, user_longitude):
        """
        Find nearest safe places during emergencies based on user's geolocation (latitude, longitude).
        Includes distance calculation to each safe place.
        """
        print(f"\n[LocalInfoFetcher] Finding nearest safe places near ({user_latitude}, {user_longitude})...")

        search_categories = [
            "Emergency shelters",
            "Police stations",
            "Fire stations",
            "Disaster relief centers"
        ]

        all_safe_places = []

        for term in search_categories:
            params = {
                "engine": "google_maps",
                "q": term,
                "ll": f"@{user_latitude},{user_longitude},14z",
                "hl": "en",
                "gl": "us"
            }

            results = self.service.search(params=params)
            if results and 'local_results' in results:
                for item in results['local_results']:
                    name = item.get('title', 'Unknown')
                    address = item.get('address', 'Unknown Address')
                    rating = item.get('rating', 'No Rating')
                    place_id = item.get('place_id', '')

                    # GPS coordinates for this place
                    gps = item.get('gps_coordinates', {})
                    lat2 = gps.get('latitude')
                    lon2 = gps.get('longitude')

                    # Calculate distance if GPS available
                    distance = None
                    if lat2 and lon2:
                        distance = self.calculate_distance_miles(user_latitude, user_longitude, lat2, lon2)

                    # Build place link
                    link = item.get('link')
                    if not link and place_id:
                        link = f"https://www.google.com/maps/place/?q=place_id:{place_id}"
                    elif not link:
                        link = "Link not available"

                    # Build directions link
                    directions_link = f"https://www.google.com/maps/dir/?api=1&destination={name.replace(' ', '+')}&destination_place_id={place_id}"

                    all_safe_places.append({
                        "name": name,
                        "address": address,
                        "rating": rating,
                        "link": link,
                        "directions_link": directions_link,
                        "distance_miles": distance
                    })

        # Sort by distance first (closer first)
        sorted_safe_places = sorted(all_safe_places, key=lambda x: (x['distance_miles'] if x['distance_miles'] else 9999))

        return sorted_safe_places
