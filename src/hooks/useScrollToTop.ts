import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Smoothly scrolls to the top of the page on route changes
 */
const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }, [pathname]);
};

export default useScrollToTop;
