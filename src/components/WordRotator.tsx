"use client";

import { useState, useEffect } from "react";

interface WordRotatorProps {
  words: string[];
  holdDuration?: number;
  typeSpeed?: number;
  deleteSpeed?: number;
  className?: string;
}

export function WordRotator({
  words,
  holdDuration = 2200,
  typeSpeed = 80,
  deleteSpeed = 50,
  className = "",
}: WordRotatorProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Find the longest word to reserve space
  const longestWord = words.reduce((a, b) => (a.length > b.length ? a : b), "");

  useEffect(() => {
    const word = words[wordIndex];

    if (!isDeleting) {
      // Typing forward
      if (displayed.length < word.length) {
        const timer = setTimeout(() => {
          setDisplayed(word.slice(0, displayed.length + 1));
        }, typeSpeed);
        return () => clearTimeout(timer);
      } else {
        // Word fully typed — hold, then start deleting
        const timer = setTimeout(() => setIsDeleting(true), holdDuration);
        return () => clearTimeout(timer);
      }
    } else {
      // Deleting
      if (displayed.length > 0) {
        const timer = setTimeout(() => {
          setDisplayed(word.slice(0, displayed.length - 1));
        }, deleteSpeed);
        return () => clearTimeout(timer);
      } else {
        // Fully deleted — move to next word
        setIsDeleting(false);
        setWordIndex((i) => (i + 1) % words.length);
      }
    }
  }, [displayed, isDeleting, wordIndex, words, holdDuration, typeSpeed, deleteSpeed]);

  return (
    <span className={`inline-grid ${className}`}>
      {/* Invisible longest word to reserve width — prevents layout shift */}
      <span className="col-start-1 row-start-1 invisible" aria-hidden="true">
        {longestWord}
      </span>
      {/* Visible typed text */}
      <span className="col-start-1 row-start-1">
        {displayed}
        <span className="inline-block w-[3px] h-[0.85em] bg-yellow ml-0.5 align-middle animate-[blink_1s_step-end_infinite]" />
      </span>
    </span>
  );
}
