"use client";

import { useRef, useEffect, useState } from "react";

// Video sources — browser fetches these directly (CDN allows <video> src but blocks CLI curl)
// First source that loads wins. Drop a local file at /video/hero-run.mp4 to override.
const VIDEO_SOURCES = [
  "/video/hero-run.mp4",
  "https://videos.pexels.com/video-files/3209828/3209828-sd_640_360_25fps.mp4",
];

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1920&q=80";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [srcIndex, setSrcIndex] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setVideoLoaded(true);
      video.play().catch(() => setVideoLoaded(false));
    };

    const handleError = () => {
      // Try next source
      if (srcIndex < VIDEO_SOURCES.length - 1) {
        setSrcIndex((i) => i + 1);
      } else {
        setVideoLoaded(false);
      }
    };

    video.addEventListener("canplaythrough", handleCanPlay);
    video.addEventListener("error", handleError);

    // Reset and load new source
    video.load();

    return () => {
      video.removeEventListener("canplaythrough", handleCanPlay);
      video.removeEventListener("error", handleError);
    };
  }, [srcIndex]);

  return (
    <>
      {/* Video background */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover blur-[3px] scale-110 transition-opacity duration-1000 ${
          videoLoaded ? "opacity-40" : "opacity-0"
        }`}
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={VIDEO_SOURCES[srcIndex]} type="video/mp4" />
      </video>

      {/* Fallback image */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          videoLoaded ? "opacity-0" : "opacity-30"
        }`}
        style={{
          background: `url('${FALLBACK_IMAGE}') center/cover no-repeat`,
          filter: "blur(2px)",
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-charcoal/65" />

      {/* Bottom gradient fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/20" />
    </>
  );
}
