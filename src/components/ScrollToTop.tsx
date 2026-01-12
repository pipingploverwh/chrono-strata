import useScrollToTop from "@/hooks/useScrollToTop";

/**
 * Component wrapper that triggers smooth scroll to top on route changes
 */
const ScrollToTop = () => {
  useScrollToTop();
  return null;
};

export default ScrollToTop;
