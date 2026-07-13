"use client";

import { useRef, useEffect, useState } from "react";

const VIDEO_SOURCES = [
  "/video/hero-run.mp4",
];

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1920&q=80";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setVideoLoaded(true);
      video.play().catch(() => {});
    };

    video.addEventListener("canplaythrough", handleCanPlay);
    return () => video.removeEventListener("canplaythrough", handleCanPlay);
  }, []);

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
        autoPlay
      >
        {VIDEO_SOURCES.map((src) => (
          <source key={src} src={src} type="video/mp4" />
        ))}
      </video>

      {/* Fallback image — always visible until video loads */}
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
