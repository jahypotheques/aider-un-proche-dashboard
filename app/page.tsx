'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  AppBar,
  Toolbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Modal,
  IconButton,
  TableSortLabel,
  Avatar,
} from '@mui/material';
import { Close as CloseIcon, PlayCircleOutline as PlayIcon } from '@mui/icons-material';
import Image from 'next/image';

interface Nomination {
  id: number;
  ai_score: number;
  video: string;
  participant_id: number;
  first_name: string;
  last_name: string;
}

interface Stats {
  highestScore: number;
  averageScore: number;
  totalParticipants: number;
}

interface DatabaseData {
  success: boolean;
  stats?: Stats;
  nominations?: Nomination[];
  error?: string;
}

type OrderDirection = 'asc' | 'desc';

export default function Home() {
  const [data, setData] = useState<DatabaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDirection, setOrderDirection] = useState<OrderDirection>('desc');
  const [sortedNominations, setSortedNominations] = useState<Nomination[]>([]);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string>('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/data');
        const result = await response.json();
        setData(result);
        if (!result.success) {
          setError(result.error);
        } else if (result.nominations) {
          setSortedNominations(result.nominations);
        }
      } catch (err) {
        setError('Failed to fetch data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSort = () => {
    const newDirection = orderDirection === 'desc' ? 'asc' : 'desc';
    setOrderDirection(newDirection);

    const sorted = [...sortedNominations].sort((a, b) => {
      if (newDirection === 'asc') {
        return a.ai_score - b.ai_score;
      }
      return b.ai_score - a.ai_score;
    });

    setSortedNominations(sorted);
  };

  const handleVideoClick = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
    setVideoModalOpen(true);
  };

  const handleCloseModal = () => {
    setVideoModalOpen(false);
    setSelectedVideo('');
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: '#161D19' }}>
        <Toolbar>
          <Image
            src="/ja-logo-title-fr.png"
            alt="JA Hypothèques"
            width={180}
            height={50}
            style={{ marginRight: '16px', objectFit: 'contain' }}
          />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#F6F7F7' }}>
            Aider un Proche - Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <Container maxWidth="xl" sx={{ pt: 4, pb: 6 }}>
          <Stack spacing={4}>
            {/* Header */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="h4" gutterBottom sx={{ color: 'text.primary', fontWeight: 600 }}>
                Nominations Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                View and manage contest nominations with AI scoring
              </Typography>
            </Box>

          {loading && (
            <Box display="flex" justifyContent="center" p={5}>
              <CircularProgress size={60} />
            </Box>
          )}

          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}

          {!loading && data?.success && (
            <>
              {/* Statistics Cards */}
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                <Card sx={{ flex: 1 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, fontSize: '0.875rem', fontWeight: 500 }}
                    >
                      Score Maximum
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        color: 'primary.main',
                        fontWeight: 600,
                        fontSize: '2.5rem',
                        lineHeight: 1.2
                      }}
                    >
                      {data.stats?.highestScore.toFixed(2) || 0}
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ flex: 1 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, fontSize: '0.875rem', fontWeight: 500 }}
                    >
                      Score Moyen
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        color: 'secondary.main',
                        fontWeight: 600,
                        fontSize: '2.5rem',
                        lineHeight: 1.2
                      }}
                    >
                      {data.stats?.averageScore.toFixed(2) || 0}
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ flex: 1 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, fontSize: '0.875rem', fontWeight: 500 }}
                    >
                      Nombre total de participants
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        color: 'text.primary',
                        fontWeight: 600,
                        fontSize: '2.5rem',
                        lineHeight: 1.2
                      }}
                    >
                      {data.stats?.totalParticipants || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>

              {/* Nominations Table */}
              <Paper sx={{ p: 0, overflow: 'hidden' }}>
                <Box sx={{ p: 3, pb: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Liste des Nominations
                  </Typography>
                </Box>

                <TableContainer sx={{ px: 0 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <TableSortLabel
                            active={true}
                            direction={orderDirection}
                            onClick={handleSort}
                          >
                            <strong>Score IA</strong>
                          </TableSortLabel>
                        </TableCell>
                        <TableCell><strong>Prénom</strong></TableCell>
                        <TableCell><strong>Nom</strong></TableCell>
                        <TableCell><strong>Vidéo</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sortedNominations.map((nomination) => (
                        <TableRow
                          key={nomination.id}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'rgba(154, 174, 161, 0.05)',
                            },
                          }}
                        >
                          <TableCell>
                            <Box
                              sx={{
                                display: 'inline-block',
                                bgcolor: 'rgba(154, 174, 161, 0.15)',
                                px: 2,
                                py: 0.5,
                                borderRadius: 2,
                              }}
                            >
                              <Typography
                                variant="body1"
                                sx={{
                                  color: 'primary.main',
                                  fontWeight: 600,
                                  fontSize: '1.1rem'
                                }}
                              >
                                {nomination.ai_score.toFixed(2)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {nomination.first_name || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {nomination.last_name || 'N/A'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {nomination.video ? (
                              <IconButton
                                color="primary"
                                onClick={() => handleVideoClick(nomination.video)}
                                sx={{
                                  '&:hover': {
                                    backgroundColor: 'primary.light',
                                  },
                                }}
                              >
                                <Avatar
                                  sx={{
                                    bgcolor: 'primary.main',
                                    width: 48,
                                    height: 48,
                                  }}
                                >
                                  <PlayIcon fontSize="large" />
                                </Avatar>
                              </IconButton>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                Pas de vidéo
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </>
          )}
        </Stack>
      </Container>

        {/* Video Modal */}
        <Modal
        open={videoModalOpen}
        onClose={handleCloseModal}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '90%',
            maxWidth: 1200,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 2,
            borderRadius: 2,
          }}
        >
          <IconButton
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'grey.500',
              zIndex: 1,
            }}
            onClick={handleCloseModal}
          >
            <CloseIcon />
          </IconButton>
          {selectedVideo && (
            <video
              controls
              autoPlay
              onError={(e) => console.error('Video error:', e)}
              onLoadStart={() => console.log('Video loading started')}
              onCanPlay={() => console.log('Video can play')}
              style={{
                width: '100%',
                maxHeight: '80vh',
                display: 'block',
              }}
            >
              <source src={selectedVideo} type="video/mp4" />
              <source src={selectedVideo} type="video/quicktime" />
              Your browser does not support the video tag.
            </video>
          )}
        </Box>
      </Modal>
      </Box>
    </>
  );
}
