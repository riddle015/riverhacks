import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSerpApiEvents, fetchSerpApiVolunteerEvents } from "@/lib/serpApiClient";
import { Card } from "@/components/ui/card";

interface Event {
  title: string;
  date: string;
  address: string;
  description: string;
  link: string;
  thumbnail?: string;
}

const EventsFeed = () => {
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["serpapiEvents"],
    queryFn: fetchSerpApiEvents,
  });

  const { data: volunteerEvents = [], isLoading: volunteerLoading } = useQuery({
    queryKey: ["serpapiVolunteerEvents"],
    queryFn: fetchSerpApiVolunteerEvents,
  });

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Austin Events</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left side: Regular Events */}
        <div>
          <h2 className="text-xl font-semibold mb-4">🎉 Upcoming Events</h2>
          {eventsLoading ? (
            <div className="text-center">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="text-center text-muted-foreground">No events found.</div>
          ) : (
            <div className="space-y-4">
              {events
                .filter((event: Event) => event.thumbnail && event.thumbnail.trim() !== "")
                .map((event: Event, idx: number) => (
                  <a
                    key={idx}
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Card className="flex items-center gap-4 p-4 hover:shadow-md transition">
                      <img
                        src={event.thumbnail}
                        alt="Event thumbnail"
                        className="h-24 w-24 object-cover rounded"
                      />
                      <div className="flex flex-col">
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.date}</p>
                        <p className="text-xs text-muted-foreground">{event.address}</p>
                      </div>
                    </Card>
                  </a>
                ))}
            </div>
          )}
        </div>

        {/* Right side: Volunteer Events */}
        <div>
          <h2 className="text-xl font-semibold mb-4">🤝 Volunteer Opportunities</h2>
          {volunteerLoading ? (
            <div className="text-center">Loading volunteer events...</div>
          ) : volunteerEvents.length === 0 ? (
            <div className="text-center text-muted-foreground">No volunteer events found.</div>
          ) : (
            <div className="space-y-4">
              {volunteerEvents
                .filter((event: Event) => event.thumbnail && event.thumbnail.trim() !== "")
                .map((event: Event, idx: number) => (
                  <a
                    key={idx}
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Card className="flex items-center gap-4 p-4 hover:shadow-md transition">
                      <img
                        src={event.thumbnail}
                        alt="Volunteer event thumbnail"
                        className="h-24 w-24 object-cover rounded"
                      />
                      <div className="flex flex-col">
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.date}</p>
                        <p className="text-xs text-muted-foreground">{event.address}</p>
                      </div>
                    </Card>
                  </a>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsFeed;
