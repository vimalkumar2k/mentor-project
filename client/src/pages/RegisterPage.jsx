import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    Box, Card, CardContent, TextField, Button, 
    Typography, MenuItem, Container, Alert 
} from '@mui/material';
import { register } from '../services/api';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Student',
        department: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            console.error('Frontend Registration Error:', err);
            setError(err.response?.data?.message || 'Registration failed. Please check if the server is running.');
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
                            Create Account
                        </Typography>
                        <Typography variant="body1" textAlign="center" color="textSecondary" sx={{ mb: 4 }}>
                            Joint the Mentoring Management System
                        </Typography>

                        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                variant="outlined"
                                margin="normal"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                            />
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
                                label="Department"
                                variant="outlined"
                                margin="normal"
                                value={formData.department}
                                onChange={(e) => setFormData({...formData, department: e.target.value})}
                                required
                            />
                            <TextField
                                fullWidth
                                select
                                label="Register As"
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
                                Register
                            </Button>
                        </form>

                        <Typography variant="body2" textAlign="center">
                            Already have an account? <Link to="/login" style={{ color: '#1e40af', fontWeight: 'bold' }}>Login Here</Link>
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default RegisterPage;
