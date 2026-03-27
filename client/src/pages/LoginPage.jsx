import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    Box, Card, CardContent, TextField, Button, 
    Typography, MenuItem, Container, Alert 
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'Student'
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userData = await login(formData); // This is context login, returns sessionUser
            const role = userData.role;
            if (role === 'Student') navigate('/student/dashboard');
            else if (role === 'Staff') navigate('/staff/dashboard');
            else navigate('/hod/dashboard');
        } catch (err) {
            console.error('Frontend Login Error:', err);
            setError(err.response?.data?.message || 'Login failed. Please register again if you just started the server.');
        }
    };

    return (
        <Box 
            sx={{ 
                minHeight: '100vh', display: 'flex', alignItems: 'center', 
                bgcolor: '#f1f5f9', py: 4 
            }}
        >
            <Container maxWidth="sm">
                <Card sx={{ borderRadius: 4, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h4" textAlign="center" fontWeight="bold" gutterBottom color="primary">
                            Welcome Back
                        </Typography>
                        <Typography variant="body1" textAlign="center" color="textSecondary" sx={{ mb: 4 }}>
                            Login to your Mentoring Portal
                        </Typography>

                        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                variant="outlined"
                                margin="normal"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                variant="outlined"
                                margin="normal"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                required
                            />
                            <TextField
                                fullWidth
                                select
                                label="Role"
                                variant="outlined"
                                margin="normal"
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                            >
                                {['Student', 'Staff', 'HOD', 'Assistant HOD'].map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                            
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                type="submit"
                                sx={{ mt: 3, mb: 2, height: 50, borderRadius: 2 }}
                            >
                                Login
                            </Button>
                        </form>

                        <Typography variant="body2" textAlign="center">
                            Don't have an account? <Link to="/register" style={{ color: '#1e40af', fontWeight: 'bold' }}>Register Here</Link>
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default LoginPage;
