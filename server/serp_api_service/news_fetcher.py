from serp_api_service.serp_api_handler import SerpApiService

class NewsFetcher:
    def __init__(self):
        self.service = SerpApiService()

    def fetch_general_news(self, query, location="Austin, Texas"):
        """
        Fetch general news articles related to a search query and location using Google News API.
        """
        print(f"\n[NewsFetcher] Searching general news for '{query}' in {location}...")
        results = self.service.search(
            params={
                "engine": "google_news",  # 👈 Force Google News engine
                "q": query,
                "location": location,
                "num": 10
            }
        )

        if not results or 'news_results' not in results:
            print("No general news results found.")
            return None

        general_news = []
        for article in results['news_results']:
            title = article.get('title', '')
            link = article.get('link', '')
            snippet = article.get('snippet', '')
            thumbnail = article.get('thumbnail', '')

            general_news.append({
                "title": title,
                "link": link,
                "snippet": snippet,
                "thumbnail": thumbnail
            })

        return general_news if general_news else None

    def fetch_neighborhood_news(self, neighborhood_name):
        """
        Fetch localized news articles related to a specific Austin neighborhood using Google News API.
        """
        print(f"\n[Neighborhood NewsFetcher] Searching news for neighborhood: '{neighborhood_name}'...")
        query = f"{neighborhood_name} Austin news"

        results = self.service.search(
            params={
                "engine": "google_news",  # 👈 Force Google News engine
                "q": query,
                "location": "Austin, Texas",
                "num": 15  # ⬅️ Pull broader for neighborhoods
            }
        )

        if not results or 'news_results' not in results:
            print("No neighborhood news results found.")
            return None

        neighborhood_news = []
        for article in results['news_results']:
            title = article.get('title', '')
            link = article.get('link', '')
            snippet = article.get('snippet', '')
            thumbnail = article.get('thumbnail', '')

            neighborhood_news.append({
                "title": title,
                "link": link,
                "snippet": snippet,
                "thumbnail": thumbnail
            })

        return neighborhood_news if neighborhood_news else None
