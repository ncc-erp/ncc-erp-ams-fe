import { useEffect, useRef } from "react";

export default function useDebouncedEventListener(
  eventType: string,
  handler: () => void,
  delay: number = 100
) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const debouncedHandler = () => {
      clearTimeout(timeoutRef.current as NodeJS.Timeout);
      timeoutRef.current = setTimeout(() => {
        handler();
      }, delay);
    };
    window.addEventListener(eventType, debouncedHandler);

    return () => {
      clearTimeout(timeoutRef.current as NodeJS.Timeout);
      window.removeEventListener(eventType, debouncedHandler);
    };
  }, [eventType, handler, delay]);
}
