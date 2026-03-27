import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, LinearProgress, Avatar, Divider, CircularProgress } from '@mui/material';
import { Description, TrendingUp, Timeline, CheckCircle } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getStudentDashboard } from '../services/api';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getStudentDashboard();
                setData(res.data);
            } catch (err) {
                console.error('Error fetching dashboard:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

    const stats = data?.stats || [
        { label: 'Form Progress', value: 0, icon: <Description color="primary" />, color: 'primary' },
        { label: 'Attendance', value: 0, icon: <Timeline color="success" />, color: 'success' },
        { label: 'Current CGPA', value: '0.0', icon: <TrendingUp color="warning" />, color: 'warning' },
        { label: 'Backlogs', value: 0, icon: <CheckCircle color="info" />, color: 'info' },
    ];

    return (
        <Box>
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="h4" fontWeight="black" color="primary">
                        Student Dashboard
                    </Typography>
                    <Typography color="textSecondary">
                        Welcome back, {user?.name}!
                    </Typography>
                </Box>
                <Button 
                    component={Link} 
                    to="/student/form" 
                    variant="contained" 
                    startIcon={<Description />}
                    sx={{ borderRadius: 2, px: 3, height: 45 }}
                >
                    Fill Mentoring Form
                </Button>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.label}>
                        <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{ p: 1.5, bgcolor: `${stat.color}.50`, borderRadius: 3 }}>
                                    {stat.icon}
                                </Box>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">
                                        {typeof stat.value === 'number' && stat.label !== 'Backlogs' ? `${stat.value}%` : stat.value}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        {stat.label}
                                    </Typography>
                                </Box>
                            </CardContent>
                            {typeof stat.value === 'number' && stat.label !== 'Backlogs' && (
                                <LinearProgress 
                                    variant="determinate" 
                                    value={stat.value} 
                                    color={stat.color} 
                                    sx={{ height: 4, borderRadius: 2 }} 
                                />
                            )}
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none', height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Mentoring Progress
                            </Typography>
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                    {stats[0].value}% of 21 Sections Completed
                                </Typography>
                                <LinearProgress variant="determinate" value={stats[0].value} sx={{ height: 10, borderRadius: 5 }} />
                            </Box>
                            <Box sx={{ mt: 4 }}>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    Your mentoring record is your official counseling document. Please keep it updated.
                                </Typography>
                                <Button component={Link} to="/student/form" variant="outlined" size="small">Edit Form</Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none', textAlign: 'center' }}>
                        <CardContent sx={{ py: 4 }}>
                            <Avatar 
                                sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main', fontSize: '2rem' }}
                            >
                                {user?.name?.charAt(0)}
                            </Avatar>
                            <Typography variant="h6" fontWeight="bold">{user?.name}</Typography>
                            <Typography variant="body2" color="textSecondary">{user?.department}</Typography>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ textAlign: 'left' }}>
                                <Typography variant="caption" color="textSecondary">Assigned Mentor</Typography>
                                <Typography variant="body1" fontWeight="bold">
                                    {data?.student?.mentorId?.name || 'Not Assigned Yet'}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default StudentDashboard;
