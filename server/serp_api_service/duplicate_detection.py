from serp_api_service.serp_api_handler import SerpApiService

class DuplicateDetectionService:
    def __init__(self):
        self.service = SerpApiService()

    def search_similar_reports(self, incident_description, location="Austin, Texas"):
        """
        Search SerpApi to find possible duplicates of the given incident description.
        """
        print(f"\n[Duplicate Detection] Checking for similar reports to: '{incident_description}'...")

        results = self.service.search(
            query=incident_description,
            location=location,
            num_results=10
        )

        if not results:
            print("No search results found.")
            return None

        possible_duplicates = []

        # Search through titles and snippets
        organic_results = results.get('organic_results', [])
        for item in organic_results:
            title = item.get('title', '').lower()
            snippet = item.get('snippet', '').lower()
            description = incident_description.lower()

            # Simple match if 2 or more keywords are found
            match_count = sum(keyword in title or keyword in snippet for keyword in description.split())

            if match_count >= 2:  # Adjust threshold if needed
                possible_duplicates.append({
                    "title": item.get('title'),
                    "link": item.get('link'),
                    "snippet": item.get('snippet')
                })

        return possible_duplicates if possible_duplicates else None
