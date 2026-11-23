import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, Dialog, DialogContent, DialogTitle, IconButton, LinearProgress, Stack, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import { formatPublishedAt, getVideo } from '../api/youtube.js';

export default function VideoPlayer({ video, onClose }) {
  const [details, setDetails] = useState(video);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    getVideo(video.id, controller.signal)
      .then((result) => { if (!controller.signal.aborted) setDetails(result); })
      .catch((failure) => { if (!controller.signal.aborted) setError(failure.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [video.id, attempt]);

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="lg" aria-labelledby="video-title" PaperProps={{ sx: { m: { xs: 1, sm: 4 }, width: { xs: 'calc(100% - 16px)' } } }}>
      <DialogTitle id="video-title" sx={{ pr: 7, fontSize: { xs: 16, sm: 20 } }}>
        {details.title}
        <IconButton aria-label="close video" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}><Close /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: { xs: 1, sm: 3 } }}>
        <Box sx={{ aspectRatio: '16 / 9', bgcolor: '#000', mb: 2 }}>
          <Box
            component="iframe"
            src={`https://www.youtube-nocookie.com/embed/${video.id}`}
            title={details.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            sx={{ width: '100%', height: '100%', border: 0 }}
          />
        </Box>
        {loading && <LinearProgress aria-label="Loading video details" sx={{ mb: 2 }} />}
        {error && <Alert severity="warning" sx={{ mb: 2 }} action={<Button color="inherit" onClick={() => setAttempt((value) => value + 1)}>Retry</Button>}>{error}</Alert>}
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{details.channel}</Typography>
        <Stack direction="row" spacing={2} sx={{ my: 1 }}>
          {details.viewCount != null && Number.isFinite(Number(details.viewCount)) && <Typography variant="body2" color="text.secondary">{Number(details.viewCount).toLocaleString()} views</Typography>}
          <Typography variant="body2" color="text.secondary">{formatPublishedAt(details.publishedAt)}</Typography>
        </Stack>
        {details.description && <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', bgcolor: '#f2f2f2', borderRadius: 2, p: 2 }}>{details.description}</Typography>}
      </DialogContent>
    </Dialog>
  );
}
