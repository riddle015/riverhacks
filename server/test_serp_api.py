from serp_api_service.alert_system import CommunityAlertSystem
from serp_api_service.context_verification import ContextualVerificationService
from serp_api_service.duplicate_detection import DuplicateDetectionService
from serp_api_service.news_fetcher import NewsFetcher
from serp_api_service.events_fetcher import EventsFetcher
from serp_api_service.weather_fetcher import WeatherFetcher
from serp_api_service.volunteer_events_fetcher import VolunteerEventsFetcher
from serp_api_service.local_info_fetcher import LocalInfoFetcher
from datetime import datetime

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

# ============================
# Test EventsFetcher
# ============================
print("\n============================")
print("🎉 Testing EventsFetcher")
print("============================")
events_fetcher = EventsFetcher()
local_events = events_fetcher.fetch_events_for_location()

if local_events:
    print("\n📅 Local Events Results:")
    for event in local_events:
        print(f"- {event['title']}")
        print(f"  Date: {event['date']}")
        print(f"  Address: {event['address']}")
        print(f"  Link: {event['link']}\n")
else:
    print("No local events found.")

# ============================
# Test WeatherFetcher
# ============================
print("\n============================")
print("🌦️ Testing WeatherFetcher")
print("============================")
weather_fetcher = WeatherFetcher()
weather = weather_fetcher.fetch_weather_for_location()

if weather:
    print("\n☀️ Weather Info:")
    print(f"Temperature: {weather['temperature']}{weather['unit']}")
    print(f"Description: {weather['description']}")
    print(f"Precipitation: {weather['precipitation']}")
    print(f"Humidity: {weather['humidity']}")
    print(f"Wind: {weather['wind']}")

    # Now print the current date and time on a new line
    print(f"\n🕒 Report generated at: {datetime.now().strftime('%B %d, %Y %I:%M %p')}")
else:
    print("No weather data found.")

# ============================
# Test VolunteerEventsFetcher
# ============================
print("\n============================")
print("🤝 Testing VolunteerEventsFetcher - Keep Austin Kind")
print("============================")
volunteer_events_fetcher = VolunteerEventsFetcher()
volunteer_events = volunteer_events_fetcher.fetch_volunteer_events()

if volunteer_events:
    print("\n❤️ Volunteer Events Results:")
    for event in volunteer_events:
        print(f"- {event['title']}")
        print(f"  Date: {event['date']}")
        print(f"  Address: {event['address']}")
        print(f"  Link: {event['link']}\n")
else:
    print("No volunteer events found.")

# ============================
# Test LocalInfoFetcher - Community Assistance
# ============================
print("\n============================")
print("🏥 Testing LocalInfoFetcher - Community Assistance Hub")
print("============================")
local_info_fetcher = LocalInfoFetcher()

shelters = local_info_fetcher.fetch_places("Emergency shelters Austin")
hospitals = local_info_fetcher.fetch_places("Hospitals near me")
libraries = local_info_fetcher.fetch_places("Public libraries Austin")
food_pantries = local_info_fetcher.fetch_places("Food pantries Austin")
disability_services = local_info_fetcher.fetch_places("Disability services Austin")
family_services = local_info_fetcher.fetch_places("Family services centers Austin")

def print_places(category_name, places):
    print(f"\n🏢 {category_name}:")
    if places:
        for place in places:
            print(f"- {place['name']}")
            print(f"  Address: {place['address']}")
            print(f"  Rating: {place['rating']}")
            print(f"  Link: {place['link']}\n")
    else:
        print("No locations found.")

print_places("Emergency Shelters", shelters)
print_places("Hospitals / Clinics", hospitals)
print_places("Public Libraries", libraries)
print_places("Food Pantries", food_pantries)
print_places("Disability Services", disability_services)
print_places("Family Services Centers", family_services)

# ============================
# Test LocalInfoFetcher - Find Nearest Safe Places
# ============================
print("\n============================")
print("🛟 Testing Find Nearest Safe Places (Geolocation)")
print("============================")

# Sample coordinates for Downtown Austin (adjust in real app)
sample_lat = 30.2672
sample_lng = -97.7431

nearest_safe_places = local_info_fetcher.find_nearest_safe_places(user_latitude=sample_lat, user_longitude=sample_lng)

if nearest_safe_places:
    print("\n🛟 Nearest Safe Places:")
    for place in nearest_safe_places[:5]:  # Limit to top 5 results
        print(f"- {place['name']}")
        print(f"  Address: {place['address']}")
        print(f"  Rating: {place['rating']}")
        if place['distance_miles'] is not None:
            print(f"  Distance: {place['distance_miles']} miles")
        else:
            print("  Distance: Not Available")
        print(f"  Link: {place['link']}")
        print(f"  Directions: {place['directions_link']}\n")
else:
    print("No safe places found.")