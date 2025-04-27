# 📚 SerpApi Service Functions - AustinAlertHub

## Overview

The `serpapi_service/` module provides backend services that connect to [SerpApi](https://serpapi.com/), retrieve real-time data, process it intelligently, and prepare structured outputs for the frontend application.

These services enhance citizen reports by providing live context, news verification, and proactive community safety alerts.

---

## 📦 Files and Their Purpose

| File | Description |
|:-----|:------------|
| `serp_api_handler.py` | Core handler to manage all SerpApi requests. Provides a generic `search()` function that other services use. |
| `news_fetcher.py` | Utility class to fetch general news articles based on a given query and location. |
| `alert_system.py` | Community Engagement Alert System. Monitors Austin-area incidents, detects major events (e.g., fatal crashes, fires), and categorizes alerts by severity (Red, Yellow, Green). |
| `context_verification.py` | Contextual Verification Service. Fetches related news articles, organic web results, and public questions for user-submitted reports, helping validate and enrich incident reports. |

---

## 🔍 Services in Detail

### 1. `SerpApiService` (Core Engine)
- Located in: `serp_api_handler.py`
- Provides a reusable method `search(query, location, num_results)` to call SerpApi.
- Handles loading the API key from `.env`.

### 2. `NewsFetcher`
- Located in: `news_fetcher.py`
- Fetches general news articles related to safety incidents.
- Prepares top headlines, URLs, and brief snippets.

### 3. `CommunityAlertSystem`
- Located in: `alert_system.py`
- Searches for serious incidents (e.g., "Austin crash", "Austin flooding") every scheduled interval.
- Detects critical keywords like "fatal", "evacuation", "shutdown", "fire", "explosion", etc.
- Categorizes detected incidents into:
  - 🔴 Red Alert (Critical)
  - 🟡 Yellow Alert (Important)
  - 🟢 Green Alert (Minor)
- Simulates sending push alerts (currently printed to console; future connection to Firebase planned).

### 4. `ContextualVerificationService`
- Located in: `context_verification.py`
- On new citizen reports (e.g., "traffic accident in Downtown Austin"), searches for:
  - 📰 Top 3 Related News Articles
  - 🌐 Top 5 Related Web Pages
  - ❓ Common Public Questions
- Provides structured context back to the app to boost credibility, context, and validation for safety reports.

---

## 🛠 How to Use Locally

1. Create a `.env` file in the `/server` directory:
