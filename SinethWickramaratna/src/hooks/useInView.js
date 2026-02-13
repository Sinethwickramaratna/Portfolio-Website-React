import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook to trigger animations when elements come into view
 * Uses Intersection Observer API for efficient performance
 * 
 * @param {Object} options - IntersectionObserver options
 * @returns {Array} [ref, isInView] - Ref to attach to element and boolean for animation state
 */
export function useInView(options = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        // Optional: Stop observing once element is in view
        if (options.once) {
          observer.unobserve(entry.target);
        }
      } else if (!options.once) {
        setIsInView(false);
      }
    }, {
      threshold: options.threshold || 0.1,
      rootMargin: options.rootMargin || '0px',
      ...options
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options.once, options.threshold, options.rootMargin]);

  return [ref, isInView];
}
