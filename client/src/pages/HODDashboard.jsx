import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Divider, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Switch, FormControlLabel, CircularProgress } from '@mui/material';
import { Analytics, Group, AssignmentTurnedIn, Settings, ArrowForward, Security } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAssistantAccess, toggleAssistantAccess } from '../services/api';

const HODDashboard = () => {
    const { user } = useAuth();
    const [assistantAccess, setAssistantAccess] = useState(true);
    const [configLoading, setConfigLoading] = useState(false);
    const [accessError, setAccessError] = useState(null);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const { data } = await getAssistantAccess();
                setAssistantAccess(data.enabled);
            } catch (err) { 
                if (err.response?.status === 403) {
                    setAccessError(err.response.data.message);
                }
                console.error(err); 
            }
        };
        fetchConfig();
    }, [user.role]);

    const handleToggleAccess = async () => {
        setConfigLoading(true);
        try {
            const { data } = await toggleAssistantAccess(!assistantAccess);
            setAssistantAccess(data.enabled);
        } catch (err) {
            console.error(err);
        } finally {
            setConfigLoading(false);
        }
    };
    if (accessError) {
        return (
            <Box sx={{ p: 4, textAlign: 'center', mt: 10 }}>
                <Security sx={{ fontSize: 100, color: 'error.light', mb: 3, opacity: 0.5 }} />
                <Typography variant="h4" fontWeight="black" gutterBottom>Access Temporarily Suspended</Typography>
                <Typography variant="body1" color="textSecondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
                    {accessError}. Please contact the Department HOD for activation.
                </Typography>
                <Button variant="contained" onClick={() => window.location.reload()}>Retry Access</Button>
            </Box>
        );
    }

    const departmentStats = [
        { label: 'Total Students', value: 450, icon: <Group color="primary" />, trend: '+5% this year' },
        { label: 'Total Mentors', value: 24, icon: <Group color="success" />, trend: '1:18 Ratio' },
        { label: 'Forms Completed', value: '78%', icon: <AssignmentTurnedIn color="warning" />, trend: '65 Pending' },
        { label: 'Avg CGPA', value: '7.2', icon: <Analytics color="info" />, trend: '+0.2 from last sem' },
    ];

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="black" color="primary">
                    HOD Admin Dashboard
                </Typography>
                <Typography color="textSecondary">
                    Overall department overview and administrative control.
                </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {departmentStats.map((stat) => (
                    <Grid item xs={12} sm={6} md={3} key={stat.label}>
                        <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                    <Box sx={{ p: 1.5, bgcolor: '#f1f5f9', borderRadius: 3 }}>
                                        {stat.icon}
                                    </Box>
                                    <Typography variant="h4" fontWeight="black">{stat.value}</Typography>
                                </Box>
                                <Typography variant="subtitle2" fontWeight="bold">{stat.label}</Typography>
                                <Typography variant="caption" color="success.main">{stat.trend}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" fontWeight="bold">Recent Mentoring Activity</Typography>
                                <Button size="small">View All</Button>
                            </Box>
                            <List>
                                {[
                                    { name: 'Rahul Sharma', mentor: 'Dr. Ramesh', status: 'Updated Form', time: '2 hrs ago' },
                                    { name: 'Priya Verma', mentor: 'Prof. Sneha', status: 'Backlog Reported', time: '5 hrs ago' },
                                    { name: 'Ankit Gupta', mentor: 'Dr. Ramesh', status: 'Form Submitted', time: '1 day ago' },
                                ].map((activity, i) => (
                                    <Box key={i}>
                                        <ListItem sx={{ px: 0 }}>
                                            <ListItemText 
                                                primary={<Typography fontWeight="bold">{activity.name}</Typography>}
                                                secondary={`Mentor: ${activity.mentor} • ${activity.status}`}
                                            />
                                            <Typography variant="caption" color="textSecondary">{activity.time}</Typography>
                                            <ListItemSecondaryAction>
                                                <IconButton edge="end"><ArrowForward fontSize="small" /></IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        {i < 2 && <Divider />}
                                    </Box>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 4, bgcolor: 'primary.main', color: 'white', mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>Quick Actions</Typography>
                            <Button 
                                fullWidth 
                                component={Link}
                                to="/hod/assignment"
                                variant="contained" 
                                sx={{ bgcolor: 'white', color: 'primary.main', mb: 2, fontWeight: 'bold' }}
                            >
                                Assign Mentors
                            </Button>
                            <Button 
                                fullWidth 
                                component={Link}
                                to="/hod/mentors"
                                variant="outlined" 
                                sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', mb: 2, fontWeight: 'bold' }}
                            >
                                All Mentors
                            </Button>
                            <Button fullWidth variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', mb: 1 }}>
                                Generate Department Report
                            </Button>
                        </CardContent>
                    </Card>
                    {user.role === 'HOD' && (
                        <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none', mb: 3 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <Security color="error" />
                                    <Typography variant="h6" fontWeight="bold">Access Control</Typography>
                                </Box>
                                <Divider sx={{ mb: 2 }} />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="bold">Assistant HOD Portal</Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            Enable or disable all administrative access for Assistant HODs.
                                        </Typography>
                                    </Box>
                                    {configLoading ? <CircularProgress size={20} /> : (
                                        <Switch 
                                            checked={assistantAccess} 
                                            onChange={handleToggleAccess}
                                            color="primary"
                                        />
                                    )}
                                </Box>
                                <Box sx={{ mt: 2, p: 1, bgcolor: assistantAccess ? 'success.light' : 'error.light', borderRadius: 2, opacity: 0.15 }}>
                                    <Typography variant="caption" sx={{ color: 'black', fontWeight: 'bold' }}>
                                        Status: {assistantAccess ? 'ACTIVATED' : 'DEACTIVATED'}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    )}
                    
                    <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>Settings</Typography>
                            <List size="small">
                                <ListItem disablePadding sx={{ mb: 1 }}>
                                    <ListItemText primary="Manage Department Years" />
                                    <Settings fontSize="small" color="disabled" />
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemText primary="Form Deadlines" />
                                    <Settings fontSize="small" color="disabled" />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default HODDashboard;
