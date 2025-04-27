from serp_api_service.serp_api_handler import SerpApiService
from serp_api_service.news_fetcher import NewsFetcher

# Test direct search
serpapi = SerpApiService()
search_query = "Austin traffic"
results = serpapi.search(query=search_query, location="Austin, Texas", num_results=5)

if results and 'organic_results' in results:
    print(f"\nTop search results for '{search_query}':\n")
    for item in results['organic_results']:
        title = item.get('title', 'No Title')
        link = item.get('link', 'No Link')
        print(f"- {title}\n  {link}\n")
else:
    print("Failed to fetch search results.")

# Test news fetcher
news_fetcher = NewsFetcher()
articles = news_fetcher.fetch_news_for_location("traffic", location="Austin, Texas")

print("\nFetched articles near Downtown Austin:")
for article in articles:
    print(f"- {article['title']}")
    print(f"  {article['link']}")
    print(f"  {article['snippet']}\n")
