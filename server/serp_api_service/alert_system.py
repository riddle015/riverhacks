from serp_api_service.serp_api_handler import SerpApiService

class CommunityAlertSystem:
    def __init__(self):
        self.service = SerpApiService()
        self.serious_keywords = {
            "fatal": "Red",
            "shutdown": "Red",
            "evacuation": "Red",
            "fire": "Red",
            "shooting": "Red",
            "explosion": "Red",
            "major crash": "Red",
            "power outage": "Yellow",
            "highway closed": "Yellow",
            "road closure": "Yellow",
            "severe weather": "Red",
            "flooding": "Red",
            "water main break": "Yellow",
            "missing person": "Red",
            "emergency services": "Red",
            "traffic jam": "Green",
            "minor accident": "Green",
        }

    def search_and_detect_incidents(self):
        """Search for major incidents in Austin and detect serious events."""
        print("\n[Community Alert] Checking for major incidents...")

        results = self.service.search(
            params={
                "engine": "google",
                "q": "Austin crash OR Austin flood OR Austin fire OR Austin shooting OR Austin accident OR Austin emergency",
                "location": "Austin, Texas",
                "num": 10
            }
        )

        if not results or 'organic_results' not in results:
            print("No results found or error occurred.")
            return

        for item in results['organic_results']:
            title = item.get('title', '').lower()
            snippet = item.get('snippet', '').lower()

            severity = None

            for keyword, level in self.serious_keywords.items():
                if keyword in title or keyword in snippet:
                    severity = level
                    break  # Stop checking after the first match

            if severity:
                self.send_alert(item['title'], item['link'], severity)

    def send_alert(self, title, link, severity):
        """Simulate sending a push notification."""
        print(f"\n🚨 [{severity} ALERT] {title}")
        print(f"🔗 {link}\n")
