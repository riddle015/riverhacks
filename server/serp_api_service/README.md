📚 SerpApi Service Functions - AustinAlertHub
Table of Contents
Overview

📦 Files and Their Purpose

🔍 Services in Detail

🛠️ How to Use Locally

🌟 Future Improvements (Planned)

Overview
The serpapi_service/ module provides backend services that connect to SerpApi, retrieve real-time and localized data, process it intelligently, and prepare structured outputs for the frontend application.

These services enhance citizen reports by providing live context, duplicate detection, proactive community safety alerts, weather conditions, volunteer opportunities, local resources, and neighborhood-focused news streams.

📦 Files and Their Purpose

File	Description
serp_api_handler.py	Core handler to manage all SerpApi requests. Supports Web Search, Google News, Google Events, and Google Maps API searches.
news_fetcher.py	News fetching service. Fetches both general news across Austin and localized neighborhood news based on Google News API.
alert_system.py	Community Engagement Alert System. Monitors Austin-area incidents, detects major events (e.g., fatal crashes, fires), and categorizes alerts by severity (Red, Yellow, Green).
context_verification.py	Contextual Verification Service. Fetches related news articles, organic web results, and public questions for user-submitted reports, helping validate and enrich incident reports.
duplicate_detection.py	Duplicate Detection Service. Checks live SerpApi results to find similar existing incidents when a new citizen report is submitted, reducing duplicate submissions.
events_fetcher.py	Event Listing Service. Fetches local upcoming events in Austin using Google Events API for community awareness.
weather_fetcher.py	Weather Service. Fetches real-time local weather data including temperature, precipitation, humidity, and conditions.
volunteer_events_fetcher.py	Volunteer Opportunities Service. Fetches local volunteer events for promoting community engagement ("Keep Austin Kind" page).
local_info_fetcher.py	Community Resources Service. Fetches shelters, hospitals, libraries, food banks, disability services, and nearby safe places based on geolocation.
🔍 Services in Detail
1. SerpApiService (Core Engine)
Located in: serp_api_handler.py

Provides a reusable method search(params) to call SerpApi.

Supports multiple search types:

"search" for web results

"news" for Google News

"events" for Google Events

"maps" for Google Maps local search

Loads API key securely from .env.

2. NewsFetcher
Located in: news_fetcher.py

Two major functions:

fetch_general_news(query, location): General news fetcher (e.g., "Austin traffic").

fetch_neighborhood_news(neighborhood_name): Neighborhood-specific news (e.g., "Zilker Park incidents").

Uses Google News API when needed for better precision.

Supports pulling larger result sets (up to 20 articles).

3. CommunityAlertSystem
Located in: alert_system.py

Periodically searches for serious incidents (e.g., "Austin crash", "Austin flooding", "Austin shooting").

Detects critical keywords like:

"fatal", "evacuation", "shutdown", "fire", "explosion", "shooting", "power outage", etc.

Categorizes detected incidents:

🔴 Red Alert (Critical)

🟡 Yellow Alert (Important)

🟢 Green Alert (Minor)

Currently simulates sending alerts (prints to console); ready for future Firebase integration.

4. ContextualVerificationService
Located in: context_verification.py

For a new citizen report (like "car crash downtown"), fetches:

📰 Related News Articles (top 3)

🌐 Related Web Results (top 5)

❓ Related Public Questions (FAQs)

Returns structured data for the frontend to verify and enrich user-submitted reports.

5. DuplicateDetectionService
Located in: duplicate_detection.py

When a new report is submitted, quickly checks if similar incidents are already happening or reported online.

Searches titles and snippets for keyword overlaps.

Flags incidents that share 2+ keywords as possible duplicates.

Improves data quality and prevents spamming city systems.

6. EventsFetcher
Located in: events_fetcher.py

Fetches local event listings happening in the next days.

Pulls concerts, festivals, and city events for community engagement.

7. WeatherFetcher
Located in: weather_fetcher.py

Fetches current weather conditions:

Temperature

Description

Humidity

Precipitation

Wind speed

Useful for emergency notifications during storms, heatwaves, or floods.

8. VolunteerEventsFetcher
Located in: volunteer_events_fetcher.py

Fetches upcoming volunteer events around Austin.

Supports the "Keep Austin Kind" initiative promoting resident engagement.

9. LocalInfoFetcher
Located in: local_info_fetcher.py

Fetches important local assistance resources:

🛟 Emergency Shelters

🏥 Hospitals and Clinics

📚 Public Libraries (Free Internet Access)

🥫 Food Pantries

🧑‍🦽 Disability Support Services

🏫 Family Services Centers

Includes Find Nearest Safe Places feature using geolocation coordinates to locate the closest emergency facilities and show directions.

🛠️ How to Use Locally
Create a .env file in the /server directory:

bash
Copy
Edit
SERPAPI_API_KEY=your_serpapi_key_here
Install required Python libraries:

bash
Copy
Edit
pip install requests python-dotenv
Run the system manually by executing the test file:

bash
Copy
Edit
python test_serp_api.py
This will run:

🚨 Major incident detection (alert_system.py)

🧬 Context verification (context_verification.py)

📋 Duplicate detection (duplicate_detection.py)

📰 General and neighborhood news fetching (news_fetcher.py)

🎉 Local events listing (events_fetcher.py)

🌦️ Real-time weather fetching (weather_fetcher.py)

🤝 Volunteer events listing (volunteer_events_fetcher.py)

🛟 Community assistance resource lookup and safe place finding (local_info_fetcher.py)

🌟 Future Improvements (Planned)

Feature	Idea
⏲️ Scheduled Automation	Integrate Celery Beat for automatic checks every 30 minutes.
🔥 Real Push Notifications	Connect Firebase Cloud Messaging (FCM) to send real mobile alerts to users.
🌍 Geofencing Alerts	Only alert users near the detected event.
🧬 Smarter Duplicate Detection	Implement fuzzy matching / NLP for even smarter report deduplication.
🚀 FastAPI Upgrade	Upgrade Flask to FastAPI for faster async API routes if needed.
🧰 Redis Caching	Cache common SerpApi results to reduce API calls and speed up dashboard loading.
🛟 Dynamic Safe Place Routing	Integrate real-time map routing to nearest shelters based on user location.