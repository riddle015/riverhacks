from serp_api_service.serp_api_handler import SerpApiService

class ContextualVerificationService:
    def __init__(self):
        self.service = SerpApiService()

    def fetch_context_for_report(self, incident_type, location="Austin, Texas"):
        """Fetch relevant news, web results, and related concerns for a given incident type and location."""
        query = f"{incident_type} {location} safety issue"

        results = self.service.search(query=query, location=location, num_results=10)

        if not results:
            return None

        return {
            "news": results.get("news_results", [])[:3],  # Top 3 news articles
            "web_results": results.get("organic_results", [])[:5],  # Top 5 web results
            "related_concerns": results.get("related_questions", [])  # Related questions
        }
