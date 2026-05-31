import React from 'react';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  CssBaseline,
  Divider,
  IconButton,
  InputBase,
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
  ExploreOutlined,
  HistoryOutlined,
  Home,
  Menu,
  Mic,
  MoreVert,
  MovieCreationOutlined,
  NotificationsNone,
  OndemandVideoOutlined,
  PlayCircleFilled,
  Search,
  SubscriptionsOutlined,
  ThumbUpOutlined,
  VideoLibraryOutlined,
} from '@mui/icons-material';

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
  'Watched',
  'New to you',
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

const videos = [
  {
    id: 'Gl0lELDHSww',
    title: 'End of Good 5G Networks?',
    channel: 'Code Studio',
    views: '1.2M views',
    age: '2 weeks ago',
    duration: '14:28',
    category: 'React',
    url: 'https://www.youtube.com/watch?v=Gl0lELDHSww',
  },
  {
    id: 'VL4fYsv2q5A',
    title: 'Day in my life as a Software Engineer at a Amazon',
    channel: 'Design Lab',
    views: '824K views',
    age: '1 month ago',
    duration: '21:06',
    category: 'Computer programming',
    url: 'https://www.youtube.com/watch?v=VL4fYsv2q5A',
  },
  {
    id: 'oshQg1uSRvg',
    title: 'Coding in 2026 - Vibe Coding',
    channel: 'Focus Room',
    views: '3.6M views',
    age: '8 months ago',
    duration: '1:02:44',
    category: 'Music',
    url: 'https://www.youtube.com/watch?v=oshQg1uSRvg',
  },
  {
    id: 't0OsqyJ1M3c',
    title: 'Top 5 Programming Languages to Learn in 2026',
    channel: 'Frontend Mentor',
    views: '476K views',
    age: '3 days ago',
    duration: '18:39',
    category: 'React',
    url: 'https://www.youtube.com/watch?v=t0OsqyJ1M3c',
  },
  {
    id: 'NqXebyg7nCc',
    title: 'Live session: UI patterns, state, and component design',
    channel: 'Dev Stream',
    views: '95K views',
    age: 'Streamed 5 days ago',
    duration: '2:11:09',
    category: 'Live',
    url: 'https://www.youtube.com/watch?v=NqXebyg7nCc',
  },
  {
    id: 'iGe8TrCHN1E',
    title: 'Creative video editing tricks every creator should know',
    channel: 'Creator Desk',
    views: '689K views',
    age: '6 months ago',
    duration: '11:52',
    category: 'Recently uploaded',
    url: 'https://www.youtube.com/watch?v=iGe8TrCHN1E',
  },
];

function Header() {
  return (
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

        <Stack direction="row" alignItems="center" gap={0.5} sx={{ minWidth: 148 }}>
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
              inputProps={{ 'aria-label': 'search videos' }}
              sx={{ fontSize: 16 }}
            />
          </Box>
          <Tooltip title="Search">
            <IconButton
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
            <IconButton aria-label="search videos" sx={{ display: { sm: 'none' } }}>
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
  );
}

function Sidebar() {
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

function CompactRail() {
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

function CategoryBar() {
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
        {categories.map((category, index) => (
          <Chip
            key={category}
            label={category}
            clickable
            color={index === 0 ? 'default' : undefined}
            sx={{
              height: 34,
              borderRadius: 2,
              bgcolor: index === 0 ? '#0f0f0f' : '#f2f2f2',
              color: index === 0 ? '#ffffff' : 'text.primary',
              fontWeight: 600,
              px: 0.5,
              '&:hover': {
                bgcolor: index === 0 ? '#0f0f0f' : '#e5e5e5',
              },
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}

function VideoCard({ video, index }) {
  return (
    <Box
      component="article"
      sx={{
        minWidth: 0,
      }}
    >
      <Box
        component="a"
        href={video.url}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open ${video.title}`}
        sx={{
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
        <Box
          component="img"
          src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
          alt=""
          loading="lazy"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 180ms ease',
          }}
        />
        <Typography
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
          {video.duration}
        </Typography>
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
              component="a"
              href={video.url}
              target="_blank"
              rel="noreferrer"
              variant="subtitle1"
              sx={{
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
            {video.views} - {video.age}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

function MobileNav() {
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

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Header />
        <Sidebar />
        <CompactRail />

        <Box
          component="main"
          sx={{
            ml: { xs: 0, md: '76px', lg: '232px' },
            pt: { xs: '58px', sm: '64px' },
            pb: { xs: 9, md: 4 },
          }}
        >
          <CategoryBar />

          <Box
            sx={{
              px: { xs: 2, sm: 3 },
              py: 3,
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
              <VideoCard key={video.id} video={video} index={index} />
            ))}
          </Box>

        
        </Box>

        <MobileNav />
      </Box>
    </ThemeProvider>
  );
}
