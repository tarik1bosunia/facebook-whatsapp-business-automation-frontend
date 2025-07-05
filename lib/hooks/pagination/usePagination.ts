import { useEffect, useState } from 'react';
import useInfiniteScroll from './useInfiniteScroll';
import { PaginatedResponse } from '@/types/pagination';




// Define generic type for the data being searched
type UsePaginationProps<T> = {
  apiUrl?: string,
  query?: string;
  pageNumber?: number;
  pageSize?: number;
  // fetchFunction: (arg: any) => any;
  fetchFunction: (arg: { page: number }) => {
    data?: PaginatedResponse<T>; // ✅ optional
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;
  }
};

interface UsePaginationReturn<T> {
  totalCount: number;
  results: T[];
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;


  // pagination
  pageNumber: number,
  incrementPage: () => void,
  resetPage: () => void,
  hasMore: boolean;

  // infinite scroll
  lastElementRef: (node: HTMLDivElement) => void
}

export default function usePagination<T>({ fetchFunction }: UsePaginationProps<T>) : UsePaginationReturn<T>{

// apiUrl="", query = "", pageSize = 5,

  // pagination
  const initialPage = 1
  const [pageNumber, setPageNumber] = useState(initialPage);
  const incrementPage = () => setPageNumber((prevPage) => prevPage + 1);
  const resetPage = () => setPageNumber(initialPage);
  const [hasMore, setHasMore] = useState(false);
  
  
  // data featching
  // const {data, isLoading, isError, isFetching } = fetchFunction({url: `${apiUrl}?page=${pageNumber}&page_size=${pageSize}&q=${query}`});
  // TODO: need to update it for filtering and search
  const {data, isLoading, isError, isFetching } = fetchFunction({page: pageNumber});

  const [results, setResults] = useState<T[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  

  // Clear results when query changes
  // useEffect(() => {
  //   setResults([]);
  //   resetPage()
  // }, [query]);

  // Append new results as they come in
  useEffect(() => {
    if (data?.results) {
      setResults((prevResults) => Array.from(new Set([...prevResults, ...data.results])));
      setHasMore(!!data.next);
      setTotalCount(data.count);
    }
  }, [data?.results, data?.next, data?.count]);

  // use infinite scrool 
  const lastElementRef = useInfiniteScroll({
    loading: isLoading,
    isFetching,
    hasMore,
    onIntersect: () => incrementPage(),
  });

  return {
    totalCount,
    results,
    isLoading,
    isError,
    hasMore,
    isFetching,

    // pagination
    pageNumber,
    incrementPage,
    resetPage,

    // infinite scroll
    lastElementRef,
  };
}