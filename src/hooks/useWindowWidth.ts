import useDebouncedEventListener from "./useDebouncedEventListener";
import { useState } from "react";

export default function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useDebouncedEventListener(
    "resize",
    () => {
      setWindowWidth(window.innerWidth);
    },
    100
  );

  return windowWidth;
}
