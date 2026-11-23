import { useEffect, useState } from 'react';
import { searchVideos } from '../api/youtube.js';

// The feed is keyed by its search parameters, so a new search starts on page one.
export function useVideos(params) {
  const query = new URLSearchParams(params).toString();
  const [videos, setVideos] = useState([]);
  const [pageToken, setPageToken] = useState('');
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const search = Object.fromEntries(new URLSearchParams(query));
    if (pageToken) search.pageToken = pageToken;
    setLoading(true);
    setError('');

    searchVideos(search, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return;
        setVideos((previous) => [...new Map(
          [...(pageToken ? previous : []), ...result.videos].map((video) => [video.id, video]),
        ).values()]);
        setNextPageToken(result.nextPageToken === pageToken ? null : result.nextPageToken);
      })
      .catch((failure) => {
        if (!controller.signal.aborted) setError(failure.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [query, pageToken, attempt]);

  return {
    videos, loading, error, nextPageToken,
    retry: () => setAttempt((value) => value + 1),
    loadMore: () => {
      if (!loading && nextPageToken) setPageToken(nextPageToken);
    },
  };
}
