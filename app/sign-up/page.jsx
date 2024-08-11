'use client'
import { useState } from 'react';
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/app/firebase/config';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Avatar
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      const res = await createUserWithEmailAndPassword(email, password);
      console.log({ res });
      sessionStorage.setItem('user', true);
      setEmail('');
      setPassword('');
      router.push('/');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        backgroundImage: `url('https://cdn.dribbble.com/users/3562886/screenshots/14606470/media/ed4351829839a5d99b9c1b6028e1af7e.png?resize=1000x750&vertical=center')`,  // Background image for the entire page
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={10} sx={{ padding: 4, borderRadius: 2, backgroundColor: 'rgba(0, 38, 70, 255)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
            <Avatar sx={{ bgcolor: '#1E88E5', width: 56, height: 56 }}>
              <AccountCircleIcon fontSize="large" />
            </Avatar>
          </Box>
          <Typography variant="h4" component="h1" gutterBottom color="white" align="center">
            Sign Up
          </Typography>
          <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              type="email"
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              InputProps={{
                style: { color: 'white' }
              }}
              InputLabelProps={{
                style: { color: '#BDBDBD' }
              }}
              sx={{ backgroundColor: '#616161', borderRadius: 1 }}
            />
            <TextField
              type="password"
              label="Password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              InputProps={{
                style: { color: 'white' }
              }}
              InputLabelProps={{
                style: { color: '#BDBDBD' }
              }}
              sx={{ backgroundColor: '#616161', borderRadius: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSignIn}
              fullWidth
              sx={{ marginTop: 2, padding: 2, backgroundColor: '#1E88E5' }}
            >
              Sign Up
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignIn;
