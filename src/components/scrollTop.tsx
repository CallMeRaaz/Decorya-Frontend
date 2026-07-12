// ScrollRestoration.tsx
import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const scrollPositions = new Map<string, number>();

const ScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType(); // POP, PUSH, REPLACE

  useEffect(() => {
    const path = location.pathname + location.search;

    if (navigationType === "POP") {
      // User pressed back/forward button
      const savedPosition = scrollPositions.get(path) || 0;
      window.scrollTo({ top: savedPosition, behavior: "auto" });
    } else {
      // New navigation → scroll to top
      window.scrollTo({ top: 0, behavior: "auto" });
    }

    const handleScroll = () => {
      scrollPositions.set(path, window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      scrollPositions.set(path, window.scrollY); // save position on unmount
    };
  }, [location, navigationType]);

  return null;
};

export default ScrollRestoration;
