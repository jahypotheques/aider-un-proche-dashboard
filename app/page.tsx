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

      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Stack spacing={3}>
          {/* Header */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              Nominations Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View and manage contest nominations with AI scoring
            </Typography>
          </Paper>

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
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Score Maximum
                    </Typography>
                    <Typography variant="h3" color="primary">
                      {data.stats?.highestScore.toFixed(2) || 0}
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ flex: 1 }}>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Score Moyen
                    </Typography>
                    <Typography variant="h3" color="secondary">
                      {data.stats?.averageScore.toFixed(2) || 0}
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ flex: 1 }}>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Nombre total de participants
                    </Typography>
                    <Typography variant="h3">
                      {data.stats?.totalParticipants || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>

              {/* Nominations Table */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                  Liste des Nominations
                </Typography>

                <TableContainer>
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
                        <TableRow key={nomination.id} hover>
                          <TableCell>
                            <Typography variant="h6" color="primary">
                              {nomination.ai_score.toFixed(2)}
                            </Typography>
                          </TableCell>
                          <TableCell>{nomination.first_name || 'N/A'}</TableCell>
                          <TableCell>{nomination.last_name || 'N/A'}</TableCell>
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
              style={{
                width: '100%',
                maxHeight: '80vh',
                display: 'block',
              }}
            >
              <source src={selectedVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </Box>
      </Modal>
    </>
  );
}
