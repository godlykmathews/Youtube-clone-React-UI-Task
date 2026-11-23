import React, { useState } from 'react';
import {
  Alert,
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  CssBaseline,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputBase,
  Skeleton,
  Stack,
  ThemeProvider,
  Toolbar,
  Tooltip,
  Typography,
  createTheme,
  alpha,
} from '@mui/material';
import {
  AddCircleOutline,
  Close,
  ExploreOutlined,
  HistoryOutlined,
  Home,
  Menu,
  Mic,
  MoreVert,
  NotificationsNone,
  OndemandVideoOutlined,
  PlayCircleFilled,
  Search,
  SubscriptionsOutlined,
  ThumbUpOutlined,
  VideoLibraryOutlined,
} from '@mui/icons-material';
import { formatPublishedAt } from './api/youtube.js';
import { useVideos } from './hooks/useVideos.js';
import VideoPlayer from './components/VideoPlayer.jsx';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#ff0033',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f0f0f',
      secondary: '#606060',
    },
  },
  typography: {
    fontFamily:
      'Roboto, Arial, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
});

const categories = [
  'All',
  'Music',
  'Live',
  'Mixes',
  'Gaming',
  'React',
  'Podcasts',
  'Computer programming',
  'Recently uploaded',
];

const sidebarItems = [
  { label: 'Home', icon: <Home />, active: true },
  { label: 'Shorts', icon: <OndemandVideoOutlined /> },
  { label: 'Subscriptions', icon: <SubscriptionsOutlined /> },
  { label: 'You', icon: <VideoLibraryOutlined /> },
  { label: 'History', icon: <HistoryOutlined /> },
  { label: 'Explore', icon: <ExploreOutlined /> },
  { label: 'Liked videos', icon: <ThumbUpOutlined /> },
];

function Header({ onSearch }) {
  const [query, setQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim());
    setMobileSearchOpen(false);
  }

  return (
    <>
    <AppBar
      elevation={0}
      color="inherit"
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        zIndex: (muiTheme) => muiTheme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 58, sm: 64 },
          gap: { xs: 1, md: 2 },
          px: { xs: 1, sm: 2 },
        }}
      >
        <Tooltip title="Main menu">
          <IconButton size="large" edge="start" aria-label="open navigation menu">
            <Menu />
          </IconButton>
        </Tooltip>

        <Stack
          direction="row"
          alignItems="center"
          gap={0.5}
          sx={{ minWidth: { xs: 0, sm: 148 }, flexGrow: { xs: 1, sm: 0 } }}
        >
          <PlayCircleFilled sx={{ color: 'primary.main', fontSize: 34 }} />
          <Typography
            variant="h6"
            component="div"
            sx={{
              display: { xs: 'none', sm: 'block' },
              fontWeight: 800,
              letterSpacing: 0,
            }}
          >
            YouTube
          </Typography>
        </Stack>

        <Stack
          component="form"
          role="search"
          onSubmit={handleSubmit}
          direction="row"
          alignItems="center"
          sx={{
            flex: 1,
            maxWidth: 720,
            mx: 'auto',
            display: { xs: 'none', sm: 'flex' },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              height: 42,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '24px 0 0 24px',
              px: 2,
              bgcolor: '#fff',
            }}
          >
            <InputBase
              fullWidth
              placeholder="Search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              inputProps={{ 'aria-label': 'search videos', maxLength: 200 }}
              sx={{ fontSize: 16 }}
            />
          </Box>
          <Tooltip title="Search">
            <IconButton
              type="submit"
              aria-label="search"
              sx={{
                width: 64,
                height: 42,
                border: '1px solid',
                borderLeft: 0,
                borderColor: 'divider',
                borderRadius: '0 24px 24px 0',
                bgcolor: '#f8f8f8',
                '&:hover': { bgcolor: '#f1f1f1' },
              }}
            >
              <Search />
            </IconButton>
          </Tooltip>
          <Tooltip title="Search with your voice">
            <IconButton aria-label="voice search" sx={{ ml: 1, bgcolor: '#f8f8f8' }}>
              <Mic />
            </IconButton>
          </Tooltip>
        </Stack>

        <Stack direction="row" alignItems="center" gap={0.5}>
          <Tooltip title="Search">
            <IconButton
              aria-label="open video search"
              onClick={() => setMobileSearchOpen(true)}
              sx={{ display: { sm: 'none' } }}
            >
              <Search />
            </IconButton>
          </Tooltip>
          <Tooltip title="Create">
            <IconButton aria-label="create video">
              <AddCircleOutline />
            </IconButton>
          </Tooltip>
          <Tooltip title="Notifications">
            <IconButton aria-label="notifications">
              <Badge color="primary" variant="dot">
                <NotificationsNone />
              </Badge>
            </IconButton>
          </Tooltip>
          <Avatar
            alt="User profile"
            sx={{ width: 34, height: 34, bgcolor: '#0f9d58', fontWeight: 700 }}
          >
            U
          </Avatar>
        </Stack>
      </Toolbar>
    </AppBar>
    <Dialog
      open={mobileSearchOpen}
      onClose={() => setMobileSearchOpen(false)}
      fullWidth
      maxWidth="sm"
      aria-labelledby="mobile-search-title"
    >
      <DialogTitle id="mobile-search-title">
        Search videos
        <IconButton
          aria-label="close search"
          onClick={() => setMobileSearchOpen(false)}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack
          component="form"
          role="search"
          onSubmit={handleSubmit}
          direction="row"
          spacing={1}
          sx={{ pt: 1 }}
        >
          <InputBase
            autoFocus
            fullWidth
            placeholder="Search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            inputProps={{ 'aria-label': 'search videos', maxLength: 200 }}
          />
          <IconButton type="submit" aria-label="search"><Search /></IconButton>
        </Stack>
      </DialogContent>
    </Dialog>
    </>
  );
}

function Sidebar({ onHome }) {
  return (
    <Box
      component="aside"
      sx={{
        position: 'fixed',
        top: 64,
        left: 0,
        bottom: 0,
        width: 232,
        display: { xs: 'none', lg: 'block' },
        overflowY: 'auto',
        borderRight: '1px solid',
        borderColor: 'divider',
        px: 1.5,
        py: 1,
        bgcolor: 'background.paper',
      }}
    >
      <Stack spacing={0.5}>
        {sidebarItems.slice(0, 3).map((item) => (
          <Button
            key={item.label}
            onClick={item.label === 'Home' ? onHome : undefined}
            startIcon={item.icon}
            fullWidth
            sx={{
              justifyContent: 'flex-start',
              gap: 1,
              minHeight: 42,
              px: 2,
              color: 'text.primary',
              bgcolor: item.active ? '#f2f2f2' : 'transparent',
              '&:hover': { bgcolor: '#f2f2f2' },
            }}
          >
            {item.label}
          </Button>
        ))}
      </Stack>

      <Divider sx={{ my: 1.25 }} />

      <Stack spacing={0.5}>
        {sidebarItems.slice(3).map((item) => (
          <Button
            key={item.label}
            startIcon={item.icon}
            fullWidth
            sx={{
              justifyContent: 'flex-start',
              gap: 1,
              minHeight: 42,
              px: 2,
              color: 'text.primary',
              '&:hover': { bgcolor: '#f2f2f2' },
            }}
          >
            {item.label}
          </Button>
        ))}
      </Stack>

      <Divider sx={{ my: 1.25 }} />

      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
          Subscriptions
        </Typography>
        {['Code Studio', 'Design Lab', 'Focus Room'].map((channel, index) => (
          <Stack
            key={channel}
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ py: 1 }}
          >
            <Avatar
              sx={{
                width: 28,
                height: 28,
                bgcolor: ['#1976d2', '#8e24aa', '#ef6c00'][index],
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {channel.charAt(0)}
            </Avatar>
            <Typography variant="body2" noWrap>
              {channel}
            </Typography>
          </Stack>
        ))}
      </Box>
    </Box>
  );
}

function CompactRail({ onHome }) {
  return (
    <Box
      component="nav"
      sx={{
        position: 'fixed',
        top: 64,
        left: 0,
        bottom: 0,
        width: 76,
        display: { xs: 'none', md: 'block', lg: 'none' },
        bgcolor: 'background.paper',
        py: 1,
      }}
    >
      {sidebarItems.slice(0, 5).map((item) => (
        <Button
          key={item.label}
          onClick={item.label === 'Home' ? onHome : undefined}
          fullWidth
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
            minHeight: 72,
            px: 0.5,
            color: 'text.primary',
            fontSize: 11,
            '& .MuiButton-startIcon': { m: 0 },
            '&:hover': { bgcolor: '#f2f2f2' },
          }}
          startIcon={item.icon}
        >
          {item.label}
        </Button>
      ))}
    </Box>
  );
}

function CategoryBar({ selectedCategory, onSelect }) {
  return (
    <Box
      sx={{
        position: 'sticky',
        top: { xs: 58, sm: 64 },
        zIndex: 5,
        bgcolor: alpha('#ffffff', 0.96),
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        py: 1.25,
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          overflowX: 'auto',
          px: { xs: 2, sm: 3 },
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {categories.map((category) => (
          <Chip
            key={category}
            label={category}
            clickable
            onClick={() => onSelect(category)}
            aria-pressed={category === selectedCategory}
            sx={{
              height: 34,
              borderRadius: 2,
              bgcolor: category === selectedCategory ? '#0f0f0f' : '#f2f2f2',
              color: category === selectedCategory ? '#ffffff' : 'text.primary',
              fontWeight: 600,
              px: 0.5,
              '&:hover': {
                bgcolor: category === selectedCategory ? '#0f0f0f' : '#e5e5e5',
              },
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}

function VideoCard({ video, index, onPlay }) {
  return (
    <Box
      component="article"
      sx={{
        minWidth: 0,
      }}
    >
      <Box
        component="button"
        type="button"
        onClick={() => onPlay(video)}
        aria-label={`Play ${video.title}`}
        sx={{
          width: '100%',
          p: 0,
          border: 0,
          cursor: 'pointer',
          display: 'block',
          position: 'relative',
          aspectRatio: '16 / 9',
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: '#e7e7e7',
          textDecoration: 'none',
          '&:hover img': {
            transform: 'scale(1.03)',
          },
        }}
      >
        {video.thumbnail ? <Box
          component="img"
          src={video.thumbnail}
          alt=""
          loading="lazy"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 180ms ease',
          }}
        /> : <PlayCircleFilled sx={{ color: 'text.secondary', fontSize: 52 }} />}
        {video.isLive && <Typography
          component="span"
          variant="caption"
          sx={{
            position: 'absolute',
            right: 8,
            bottom: 8,
            px: 0.75,
            py: 0.25,
            bgcolor: 'rgba(0,0,0,0.86)',
            color: '#fff',
            borderRadius: 1,
            fontWeight: 700,
          }}
        >
          LIVE
        </Typography>}
      </Box>

      <Stack direction="row" spacing={1.5} sx={{ pt: 1.5 }}>
        <Avatar
          sx={{
            width: 38,
            height: 38,
            flex: '0 0 auto',
            bgcolor: ['#1976d2', '#8e24aa', '#ef6c00', '#00796b', '#d32f2f', '#5d4037'][
              index % 6
            ],
            fontWeight: 800,
          }}
        >
          {video.channel.charAt(0)}
        </Avatar>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Stack direction="row" alignItems="flex-start" spacing={0.5}>
            <Typography
              component="button"
              type="button"
              onClick={() => onPlay(video)}
              variant="subtitle1"
              sx={{
                border: 0,
                p: 0,
                bgcolor: 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                color: 'text.primary',
                textDecoration: 'none',
                fontWeight: 700,
                lineHeight: 1.3,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {video.title}
            </Typography>
            <Tooltip title="More actions">
              <IconButton aria-label="more actions" size="small" sx={{ mt: -0.5 }}>
                <MoreVert fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }} noWrap>
            {video.channel}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {formatPublishedAt(video.publishedAt)}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

function MobileNav({ onHome }) {
  return (
    <Box
      sx={{
        position: 'fixed',
        display: { xs: 'block', md: 'none' },
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        zIndex: 10,
      }}
    >
      <Stack direction="row" justifyContent="space-around">
        {[
          { label: 'Home', icon: <Home /> },
          { label: 'Shorts', icon: <OndemandVideoOutlined /> },
          { label: 'Create', icon: <AddCircleOutline /> },
          { label: 'Subs', icon: <SubscriptionsOutlined /> },
          { label: 'You', icon: <VideoLibraryOutlined /> },
        ].map((item) => (
          <Button
            key={item.label}
            onClick={item.label === 'Home' ? onHome : undefined}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minWidth: 56,
              minHeight: 58,
              color: 'text.primary',
              fontSize: 11,
              '& .MuiButton-startIcon': { m: 0 },
            }}
            startIcon={item.icon}
          >
            {item.label}
          </Button>
        ))}
      </Stack>
    </Box>
  );
}

function VideoFeed({ params, title, onPlay }) {
  const { videos, loading, error, nextPageToken, retry, loadMore } = useVideos(params);

  return (
    <Box sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
      <Typography
        component="h1"
        variant="h6"
        sx={{ mb: 2, fontWeight: 700, overflowWrap: 'anywhere' }}
      >
        {title}
      </Typography>
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          action={<Button color="inherit" onClick={retry}>Retry</Button>}
        >
          {error}
        </Alert>
      )}
      {!loading && !error && videos.length === 0 && (
        <Typography role="status" color="text.secondary">
          No videos found. Try a different search or category.
        </Typography>
      )}
      <Box
        aria-busy={loading}
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, minmax(0, 1fr))',
            xl: 'repeat(3, minmax(0, 1fr))',
          },
          gap: { xs: 3, md: 3.5 },
        }}
      >
        {videos.map((video, index) => (
          <VideoCard key={video.id} video={video} index={index} onPlay={onPlay} />
        ))}
        {loading && videos.length === 0 && Array.from({ length: 6 }, (_, index) => (
          <Box key={index} aria-hidden="true">
            <Skeleton variant="rounded" sx={{ aspectRatio: '16 / 9', height: 'auto' }} />
            <Skeleton width="90%" height={28} />
            <Skeleton width="60%" />
          </Box>
        ))}
      </Box>
      {loading && (
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={1}
          sx={{ mt: 3 }}
          role="status"
        >
          <CircularProgress size={22} />
          <Typography>Loading videos…</Typography>
        </Stack>
      )}
      {!loading && !error && nextPageToken && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button variant="outlined" onClick={loadMore}>Load more videos</Button>
        </Box>
      )}
    </Box>
  );
}

const homeFeed = {
  category: 'All',
  title: 'Recommended videos',
  params: { q: 'New', order: 'relevance' },
};

export default function App() {
  const [feed, setFeed] = useState(homeFeed);
  const [selectedVideo, setSelectedVideo] = useState(null);

  function selectCategory(category) {
    const params = {
      q: category === 'All' || category === 'Recently uploaded' ? 'New' : category,
      order: category === 'Recently uploaded' ? 'date' : 'relevance',
    };
    if (category === 'Live') params.eventType = 'live';
    setFeed({
      category,
      title: category === 'All' ? 'Recommended videos' : `${category} videos`,
      params,
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Header onSearch={(query) => setFeed({
          category: null,
          title: `Search results for “${query}”`,
          params: { q: query, order: 'relevance' },
        })} />
        <Sidebar onHome={() => setFeed(homeFeed)} />
        <CompactRail onHome={() => setFeed(homeFeed)} />

        <Box
          component="main"
          sx={{
            ml: { xs: 0, md: '76px', lg: '232px' },
            pt: { xs: '58px', sm: '64px' },
            pb: { xs: 9, md: 4 },
          }}
        >
          <CategoryBar selectedCategory={feed.category} onSelect={selectCategory} />
          <VideoFeed
            key={new URLSearchParams(feed.params).toString()}
            params={feed.params}
            title={feed.title}
            onPlay={setSelectedVideo}
          />
        </Box>

        <MobileNav onHome={() => setFeed(homeFeed)} />
        {selectedVideo && (
          <VideoPlayer
            key={selectedVideo.id}
            video={selectedVideo}
            onClose={() => setSelectedVideo(null)}
          />
        )}
      </Box>
    </ThemeProvider>
  );
}
