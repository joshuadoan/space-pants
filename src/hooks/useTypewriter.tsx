import { useState, useEffect, useRef } from "react";

/**
 * Hook that provides a typewriter effect for text
 * 
 * @param text - The full text to type out
 * @param speed - Typing speed in milliseconds per character (default: 30)
 * @param enabled - Whether the typewriter effect is enabled (default: true)
 * @returns The current displayed text and typing status
 */
export function useTypewriter(text: string, speed: number = 30, enabled: boolean = true) {
  const [displayedText, setDisplayedText] = useState(enabled ? "" : text);
  const [isTyping, setIsTyping] = useState(enabled);
  const timeoutRef = useRef<number | null>(null);
  const indexRef = useRef(0);
  const textRef = useRef(text);
  const enabledRef = useRef(enabled);
  const [animationTrigger, setAnimationTrigger] = useState(0);

  // Update refs
  useEffect(() => {
    textRef.current = text;
    enabledRef.current = enabled;
  }, [text, enabled]);

  // Reset when text changes or enabled changes
  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (!enabled) {
      // If disabled, show full text immediately
      setDisplayedText(text);
      setIsTyping(false);
      indexRef.current = text.length;
      return;
    }

    // If enabled, reset to start typing
    indexRef.current = 0;
    setDisplayedText("");
    setIsTyping(true);
    setAnimationTrigger(prev => prev + 1); // Trigger animation restart
  }, [text, enabled]);

  // Typewriter animation loop
  useEffect(() => {
    if (!enabledRef.current) {
      return;
    }

    // Don't start if we've already completed
    if (indexRef.current >= textRef.current.length) {
      setIsTyping(false);
      return;
    }

    const typeNextChar = () => {
      // Check if still enabled and text hasn't changed
      if (!enabledRef.current || indexRef.current >= textRef.current.length) {
        setIsTyping(false);
        return;
      }

      const nextIndex = indexRef.current + 1;
      setDisplayedText(textRef.current.slice(0, nextIndex));
      indexRef.current = nextIndex;

      if (nextIndex < textRef.current.length) {
        timeoutRef.current = setTimeout(typeNextChar, speed);
      } else {
        setIsTyping(false);
      }
    };

    // Start typing immediately
    timeoutRef.current = setTimeout(typeNextChar, speed);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [text, enabled, speed, animationTrigger]);

  return { displayedText, isTyping };
}

