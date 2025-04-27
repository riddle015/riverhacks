// src/lib/serpApiClient.ts

// Fetch News from backend
export async function fetchSerpApiNews(query: string) {
    const response = await fetch(`http://localhost:4000/api/v1/serpapi/news?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch news from server.');
    }
    const data = await response.json();
    return data;
  }
  
  // Fetch Events from backend
  export const fetchSerpApiEvents = async () => {
    const response = await fetch("http://localhost:4000/api/v1/serpapi/events");
    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }
    return response.json();
  };

  export const fetchSerpApiVolunteerEvents = async () => {
    const response = await fetch("http://localhost:4000/api/v1/serpapi/volunteer-events");
    if (!response.ok) {
      throw new Error("Failed to fetch volunteer events");
    }
    return response.json();
  };
  
  