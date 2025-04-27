# volunteer_events_fetcher.py

from serp_api_service.serp_api_handler import SerpApiService

class VolunteerEventsFetcher:
    def __init__(self):
        self.service = SerpApiService()

    def fetch_volunteer_events(self, location="Austin, Texas"):
        """
        Fetch upcoming volunteer, charity, and community service events in Austin.
        """
        print(f"\n[VolunteerEventsFetcher] Fetching volunteer events in {location}...")

        params = {
            "engine": "google_events",
            "q": "Volunteer opportunities in Austin",
            "location": location,
            "hl": "en",
            "gl": "us",
            "htichips": "date:month"  # Pull events happening this month
        }

        results = self.service.search(params=params)
        if not results or 'events_results' not in results:
            print("No volunteer events found.")
            return []

        volunteer_events = []
        for item in results['events_results']:
            title = item.get('title', 'No Title')
            date = item.get('date', {}).get('when', 'Date Not Available')
            address = ", ".join(item.get('address', []))
            description = item.get('description', 'No Description')
            link = item.get('link', '')
            thumbnail = item.get('thumbnail', '')

            volunteer_events.append({
                "title": title,
                "date": date,
                "address": address,
                "description": description,
                "link": link,
                "thumbnail": thumbnail
            })

        return volunteer_events
