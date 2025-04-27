from serp_api_service.serp_api_handler import SerpApiService

class NewsFetcher:
    def __init__(self):
        self.service = SerpApiService()

    def fetch_news_for_location(self, query_keywords, location="Austin, Texas"):
        """Fetch relevant news articles based on keywords and optional location."""
        results = self.service.search(query=query_keywords, location=location, num_results=5)
        if not results or 'organic_results' not in results:
            return []
        
        articles = []
        for item in results['organic_results']:
            title = item.get('title', 'No Title')
            link = item.get('link', 'No Link')
            snippet = item.get('snippet', '')
            articles.append({
                'title': title,
                'link': link,
                'snippet': snippet
            })
        return articles
