"use client";

import React, { useMemo } from "react";

interface SpotifyPlayerProps {
  spotifyUrl: string;
}

export const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({ spotifyUrl }) => {
  const iframeSrc = useMemo(() => {
    try {
      const urlObj = new URL(spotifyUrl);
      if (urlObj.hostname === "open.spotify.com") {
        const pathParts = urlObj.pathname.split("/").filter(Boolean);

        // If it's already an embed URL
        if (pathParts[0] === "embed") {
          return spotifyUrl;
        }

        // If it's a standard URL: /track/123 -> /embed/track/123
        if (pathParts.length >= 2) {
          const type = pathParts[0];
          const id = pathParts[1];
          return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator`;
        }
      }
    } catch (e) {
      console.error("Invalid Spotify URL", e);
    }
    return null;
  }, [spotifyUrl]);

  if (!iframeSrc) {
    return (
      <div className="bg-white p-4 shadow-md rounded-lg w-[300px] h-[152px] flex items-center justify-center text-red-500 text-sm text-center">
        Invalid Spotify URL. Please paste a valid track, album, or playlist link.
      </div>
    );
  }

  return (
    <div className="bg-white p-4 shadow-md rounded-lg transform-gpu">
      <iframe
        src={iframeSrc}
        height="152"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        className="pointer-events-auto"
      />
    </div>
  );
};