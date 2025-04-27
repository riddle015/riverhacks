from serp_api_service.serp_api_handler import SerpApiService

class EventsFetcher:
    def __init__(self):
        self.service = SerpApiService()

    def fetch_events_for_location(self, query="Events in Austin, TX", location="Austin, Texas"):
        """Fetch upcoming events based on location and query."""
        params = {
            "engine": "google_events",
            "q": query,
            "location": location,
            "hl": "en",
            "gl": "us",
            "htichips": "date:week"  # ⬅️ New: Only pull events for this week ; can change date:? (today/tomorrow/weekend/month/next_week/week)
        }
        results = self.service.search(params=params)
        if not results or 'events_results' not in results:
            return []
        
        events = []
        for item in results['events_results']:
            title = item.get('title', 'No Title')
            date = item.get('date', {}).get('when', 'Date Not Available')
            address = ", ".join(item.get('address', []))
            description = item.get('description', 'No Description')
            link = item.get('link', '')
            thumbnail = item.get('thumbnail', '')

            events.append({
                "title": title,
                "date": date,
                "address": address,
                "description": description,
                "link": link,
                "thumbnail": thumbnail
            })
        return events
