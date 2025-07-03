import { useRef, useCallback } from 'react';

interface UseInfiniteScrollProps {
  loading: boolean;
  hasMore: boolean;
  isFetching: boolean;
  onIntersect: () => void;
}

export default function useInfiniteScroll({ loading, hasMore, onIntersect, isFetching }: UseInfiniteScrollProps) {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading || isFetching) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onIntersect();
        }
      });


      if (node) observer.current.observe(node);
    },
    [loading, hasMore, isFetching, onIntersect]
  );

  return lastElementRef;
}