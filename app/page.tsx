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
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { Close as CloseIcon, PlayCircleOutline as PlayIcon, Search as SearchIcon } from '@mui/icons-material';
import { InputAdornment, TextField } from '@mui/material';
import Image from 'next/image';

interface Nomination {
  id: number;
  ai_score: number;
  video: string;
  participant_id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  nominee_first_name: string;
  nominee_last_name: string;
  nominee_phone_number: string;
  nominee_email: string;
  why_help_text: string;
  how_help_text: string;
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
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<DatabaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDirection, setOrderDirection] = useState<OrderDirection>('desc');
  const [sortedNominations, setSortedNominations] = useState<Nomination[]>([]);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string>('');
  const [nomineeModalOpen, setNomineeModalOpen] = useState(false);
  const [selectedNominee, setSelectedNominee] = useState<Nomination | null>(null);
  const [textModalOpen, setTextModalOpen] = useState(false);
  const [selectedTexts, setSelectedTexts] = useState<Nomination | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        if (response.ok) {
          setAuthenticated(true);
        }
      } catch {
        // Not authenticated
      } finally {
        setCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        setError('Échec du chargement des données');
        console.error('Erreur lors du chargement des données:', err);
      } finally {
        setLoading(false);
      }
    }

    if (mounted) {
      fetchData();
    }
  }, [mounted]);

  const filteredNominations = sortedNominations.filter((n) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      n.first_name?.toLowerCase().includes(q) ||
      n.last_name?.toLowerCase().includes(q) ||
      n.email?.toLowerCase().includes(q) ||
      n.phone_number?.toLowerCase().includes(q) ||
      n.nominee_first_name?.toLowerCase().includes(q) ||
      n.nominee_last_name?.toLowerCase().includes(q) ||
      n.nominee_email?.toLowerCase().includes(q) ||
      n.nominee_phone_number?.toLowerCase().includes(q)
    );
  });

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

  const handleNomineeClick = (nomination: Nomination) => {
    setSelectedNominee(nomination);
    setNomineeModalOpen(true);
  };

  const handleCloseNomineeModal = () => {
    setNomineeModalOpen(false);
    setSelectedNominee(null);
  };

  const handleTextClick = (nomination: Nomination) => {
    setSelectedTexts(nomination);
    setTextModalOpen(true);
  };

  const handleCloseTextModal = () => {
    setTextModalOpen(false);
    setSelectedTexts(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || loginLoading) return;

    setLoginLoading(true);
    setLoginError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setAuthenticated(true);
        setPassword('');
      } else {
        const data = await response.json();
        setLoginError(data.error || 'Invalid password');
      }
    } catch {
      setLoginError('Connection error');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setAuthenticated(false);
    setPassword('');
  };

  if (checkingAuth) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
        <Paper sx={{ maxWidth: 400, width: '100%', p: 4 }}>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Image
              src="/ja-logo-title-fr.png"
              alt="JA Hypothèques"
              width={160}
              height={44}
              style={{ objectFit: 'contain' }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Entrez le mot de passe pour continuer
            </Typography>
          </Box>
          <form onSubmit={handleLogin}>
            <Stack spacing={2}>
              <TextField
                type="password"
                label="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loginLoading}
                fullWidth
                autoFocus
              />
              {loginError && (
                <Alert severity="error">{loginError}</Alert>
              )}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loginLoading}
              >
                {loginLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </Stack>
          </form>
        </Paper>
      </div>
    );
  }

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
          <Button onClick={handleLogout} sx={{ color: '#F6F7F7' }}>
            Déconnexion
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <Container maxWidth="xl" sx={{ pt: 4, pb: 6 }}>
          <Stack spacing={4}>
            {/* Header */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="h4" gutterBottom sx={{ color: 'text.primary', fontWeight: 600 }}>
                Tableau de bord des nominations
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Voir et gérer les nominations du concours avec notation IA
              </Typography>
            </Box>

          {!mounted && (
            <Box display="flex" justifyContent="center" p={5}>
              <CircularProgress size={60} />
            </Box>
          )}

          {mounted && loading && (
            <Box display="flex" justifyContent="center" p={5}>
              <CircularProgress size={60} />
            </Box>
          )}

          {mounted && error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}

          {mounted && !loading && data?.success && (
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
                <Box sx={{ p: 3, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Liste des Nominations
                  </Typography>
                  <TextField
                    size="small"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    sx={{ width: 280 }}
                  />
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
                        <TableCell><strong>Nom du soumissionnaire</strong></TableCell>
                        <TableCell><strong>Cellulaire du soumissionnaire</strong></TableCell>
                        <TableCell><strong>Courriel du soumissionaire</strong></TableCell>
                        <TableCell><strong>Proche à aider</strong></TableCell>
                        <TableCell><strong>Texte soumis</strong></TableCell>
                        <TableCell><strong>Vidéo</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredNominations.map((nomination) => (
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
                            <Typography variant="body2">
                              {nomination.first_name} {nomination.last_name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{nomination.phone_number || '—'}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{nomination.email || '—'}</Typography>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleNomineeClick(nomination)}
                              sx={{ textTransform: 'none' }}
                            >
                              Voir détails
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleTextClick(nomination)}
                              sx={{ textTransform: 'none' }}
                            >
                              Voir texte
                            </Button>
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
              onError={(e) => console.error('Erreur vidéo:', e)}
              onLoadStart={() => console.log('Chargement vidéo démarré')}
              onCanPlay={() => console.log('Vidéo prête à lire')}
              style={{
                width: '100%',
                maxHeight: '80vh',
                display: 'block',
              }}
            >
              <source src={selectedVideo} type="video/mp4" />
              <source src={selectedVideo} type="video/quicktime" />
              Votre navigateur ne supporte pas la balise vidéo.
            </video>
          )}
        </Box>
      </Modal>

        {/* Nominee Modal */}
        <Modal
          open={nomineeModalOpen}
          onClose={handleCloseNomineeModal}
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
              maxWidth: 600,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <IconButton
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: 'grey.500',
              }}
              onClick={handleCloseNomineeModal}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Proche à aider
            </Typography>
            {selectedNominee && (
              <List>
                <ListItem>
                  <ListItemText
                    primary="Prénom"
                    secondary={selectedNominee.nominee_first_name || 'N/A'}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Nom"
                    secondary={selectedNominee.nominee_last_name || 'N/A'}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Téléphone"
                    secondary={selectedNominee.nominee_phone_number || 'N/A'}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Email"
                    secondary={selectedNominee.nominee_email || 'N/A'}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </ListItem>
              </List>
            )}
          </Box>
        </Modal>

        {/* Text Modal */}
        <Modal
          open={textModalOpen}
          onClose={handleCloseTextModal}
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
              maxWidth: 800,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              maxHeight: '80vh',
              overflow: 'auto',
            }}
          >
            <IconButton
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: 'grey.500',
              }}
              onClick={handleCloseTextModal}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Texte soumis
            </Typography>
            {selectedTexts && (
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                    Pourquoi souhaitez-vous aider ce proche ?
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: 'text.primary' }}>
                      {selectedTexts.why_help_text || 'N/A'}
                    </Typography>
                  </Paper>
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                    Comment peut-on aider ce proche ?
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: 'text.primary' }}>
                      {selectedTexts.how_help_text || 'N/A'}
                    </Typography>
                  </Paper>
                </Box>
              </Stack>
            )}
          </Box>
        </Modal>
      </Box>
    </>
  );
}
