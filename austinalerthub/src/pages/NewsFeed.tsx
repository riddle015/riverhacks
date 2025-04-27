import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSerpApiNews } from "@/lib/serpApiClient";
import { Card } from "@/components/ui/card";

interface NewsArticle {
  title: string;
  link: string;
  snippet: string;
  thumbnail?: string;
}

const NewsFeed = () => {
  const { data: newsResults = [], isLoading: loading } = useQuery({
    queryKey: ["serpapiNews", "Austin"],
    queryFn: () => fetchSerpApiNews("Austin"),
  });

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Top Austin Stories</h1>

      {loading ? (
        <div className="text-center py-8">Loading news...</div>
      ) : newsResults.length === 0 ? (
        <div className="text-muted-foreground text-center py-8">
          No news articles found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {newsResults
            .filter((article: NewsArticle) => article.thumbnail && article.thumbnail.trim() !== "")
            .map((article: NewsArticle, idx: number) => (
              <a
                key={idx}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Card className="flex items-center gap-4 p-4 hover:shadow-md transition">
                  {/* Thumbnail */}
                  <img
                    src={article.thumbnail}
                    alt="News thumbnail"
                    className="h-24 w-24 object-cover rounded"
                  />

                  {/* Title and snippet */}
                  <div className="flex flex-col">
                    <h2 className="text-md font-semibold leading-tight line-clamp-2">
                      {article.title}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {article.snippet}
                    </p>
                  </div>
                </Card>
              </a>
            ))}
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
