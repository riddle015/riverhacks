from serp_api_service.alert_system import CommunityAlertSystem
from serp_api_service.context_verification import ContextualVerificationService
from serp_api_service.duplicate_detection import DuplicateDetectionService
from serp_api_service.news_fetcher import NewsFetcher

# ============================
# Test Community Alert System
# ============================
print("\n============================")
print("🚨 Testing CommunityAlertSystem")
print("============================")
community_alert_system = CommunityAlertSystem()
community_alert_system.search_and_detect_incidents()

# ============================
# Test Contextual Verification
# ============================
print("\n============================")
print("🧠 Testing ContextualVerificationService")
print("============================")
context_verification_service = ContextualVerificationService()
context_results = context_verification_service.fetch_context_for_report(
    "Car accident near Downtown Austin",
    "Austin, Texas"
)

print("\n🔍 Contextual Verification Results:")
if context_results:
    if context_results["news"]:
        print("\n📰 Related News:")
        for news in context_results["news"]:
            print(f"- {news['title']} ({news['link']})")
    else:
        print("No related news found.")

    if context_results["web_results"]:
        print("\n🌐 Related Web Results:")
        for result in context_results["web_results"]:
            print(f"- {result['title']} ({result['link']})")
    else:
        print("No related web results found.")

    if context_results["related_concerns"]:
        print("\n❓ Related Concerns:")
        for concern in context_results["related_concerns"]:
            print(f"- {concern['question']}")
    else:
        print("No related concerns found.")
else:
    print("No context data retrieved.")

# ============================
# Test Duplicate Detection
# ============================
print("\n============================")
print("📋 Testing DuplicateDetectionService")
print("============================")
duplicate_detection_service = DuplicateDetectionService()
duplicates = duplicate_detection_service.search_similar_reports(
    "Crash I-35 Downtown Austin",
    "Austin, Texas"
)

print("\n🔍 Duplicate Detection Results:")
if duplicates:
    for duplicate in duplicates:
        print(f"- {duplicate['title']}")
        print(f"  {duplicate['link']}")
        print(f"  {duplicate['snippet']}\n")
else:
    print("No potential duplicates found.")

# ============================
# Test NewsFetcher
# ============================
print("\n============================")
print("📰 Testing NewsFetcher - General News")
print("============================")
news_fetcher = NewsFetcher()
general_news = news_fetcher.fetch_general_news(query="Austin traffic")

if general_news:
    print("\n🌎 General News Results:")
    for article in general_news:
        print(f"- {article['title']}")
        print(f"  {article['link']}")
else:
    print("No general news found.")

print("\n============================")
print("🏡 Testing NewsFetcher - Neighborhood News")
print("============================")
neighborhood_news = news_fetcher.fetch_neighborhood_news(neighborhood_name="Zilker")

if neighborhood_news:
    print("\n🏘️ Neighborhood News Results:")
    for article in neighborhood_news:
        print(f"- {article['title']}")
        print(f"  {article['link']}")
else:
    print("No neighborhood news found.")
