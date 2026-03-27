import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, Typography, Grid, Card, CardContent, Avatar, 
    Divider, Button, TextField, CircularProgress, 
    Paper, Stack, Chip, IconButton
} from '@mui/material';
import { Person, Email, Business, School, Phone, Home, Edit, Save, CameraAlt, Group } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { getStudentDashboard, getProfile, updateProfile } from '../services/api';

const ProfilePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        department: '',
        contactNumber: '',
        address: ''
    });

    const isStudent = user?.role === 'Student';

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isStudent) {
                    const res = await getStudentDashboard();
                    setData(res.data);
                    const student = res.data.student;
                    setFormData({
                        name: student?.name || user?.name || '',
                        department: student?.department || '',
                        contactNumber: student?.contactNumber || '',
                        address: student?.address || ''
                    });
                } else {
                    const res = await getProfile();
                    setData({ user: res.data });
                    setFormData({
                        name: res.data.name || '',
                        department: res.data.department || '',
                        contactNumber: res.data.contactNumber || '',
                        address: res.data.address || ''
                    });
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, isStudent]);

    const handleSave = async () => {
        try {
            const updateData = new FormData();
            updateData.append('name', formData.name);
            updateData.append('department', formData.department);
            updateData.append('contactNumber', formData.contactNumber);
            updateData.append('address', formData.address);
            
            await updateProfile(updateData);
            setEditing(false);
            
            // Refresh data
            if (isStudent) {
                const res = await getStudentDashboard();
                setData(res.data);
            } else {
                const res = await getProfile();
                setData({ user: res.data });
            }
        } catch (err) {
            console.error('Error updating profile:', err);
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

    const student = data?.student;

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0', bgcolor: 'white', mb: 4 }}>
                <Grid container spacing={4} alignItems="center">
                    <Grid size={{ xs: 12, md: 3 }} sx={{ textAlign: 'center' }}>
                        <Box sx={{ position: 'relative', display: 'inline-block' }}>
                            <Avatar 
                                src={student?.photo ? `http://localhost:5000/uploads/${student.photo}` : undefined}
                                sx={{ 
                                    width: 150, 
                                    height: 150, 
                                    mx: 'auto', 
                                    fontSize: '3.5rem', 
                                    bgcolor: 'primary.main',
                                    border: '4px solid #fff',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                }}
                            >
                                {user?.name?.charAt(0)}
                            </Avatar>
                            <IconButton 
                                size="small" 
                                sx={{ 
                                    position: 'absolute', 
                                    bottom: 5, 
                                    right: 5, 
                                    bgcolor: 'white',
                                    '&:hover': { bgcolor: '#f1f5f9' },
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}
                            >
                                <CameraAlt fontSize="small" color="primary" />
                            </IconButton>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 9 }}>
                        <Stack spacing={1}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="h4" fontWeight="black" color="primary">
                                    {student?.name || user?.name}
                                </Typography>
                                <Button 
                                    variant={editing ? "contained" : "outlined"} 
                                    startIcon={editing ? <Save /> : <Edit />}
                                    onClick={() => editing ? handleSave() : setEditing(true)}
                                    sx={{ borderRadius: 2 }}
                                >
                                    {editing ? "Save Profile" : "Edit Profile"}
                                </Button>
                            </Box>
                            <Stack direction="row" spacing={1}>
                                <Chip label={user?.role} color="secondary" size="small" sx={{ fontWeight: 'bold' }} />
                                {isStudent && <Chip label={student?.studentId || 'Reg No not set'} variant="outlined" size="small" />}
                            </Stack>
                            <Typography color="textSecondary" variant="body1">
                                {isStudent ? student?.department : (data?.user?.department || 'Administration')} Department
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </Paper>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 7 }}>
                    <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Person fontSize="small" /> Personal Information
                            </Typography>
                            <Stack spacing={3} sx={{ mt: 3 }}>
                                <Box>
                                    <Typography variant="caption" color="textSecondary">Full Name</Typography>
                                    {editing ? (
                                        <TextField 
                                            fullWidth 
                                            size="small" 
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        />
                                    ) : (
                                        <Typography variant="body1" fontWeight="medium">{student?.name || 'N/A'}</Typography>
                                    )}
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="textSecondary">Email Address</Typography>
                                    <Typography variant="body1" fontWeight="medium">{student?.userId?.email || user?.email}</Typography>
                                </Box>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography variant="caption" color="textSecondary">Contact Number</Typography>
                                        {editing ? (
                                            <TextField 
                                                fullWidth 
                                                size="small" 
                                                value={formData.contactNumber}
                                                onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                                            />
                                        ) : (
                                            <Typography variant="body1" fontWeight="medium">{student?.contactNumber || 'Not provided'}</Typography>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="caption" color="textSecondary">Department</Typography>
                                        {editing ? (
                                            <TextField 
                                                fullWidth 
                                                size="small" 
                                                value={formData.department}
                                                onChange={(e) => setFormData({...formData, department: e.target.value})}
                                            />
                                        ) : (
                                            <Typography variant="body1" fontWeight="medium">
                                                {isStudent ? student?.department : (data?.user?.department || 'N/A')}
                                            </Typography>
                                        )}
                                    </Grid>
                                </Grid>
                                <Box>
                                    <Typography variant="caption" color="textSecondary">Address</Typography>
                                    {editing ? (
                                        <TextField 
                                            fullWidth 
                                            multiline 
                                            rows={2}
                                            size="small" 
                                            value={formData.address}
                                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                                        />
                                    ) : (
                                        <Typography variant="body1" fontWeight="medium">{student?.address || 'Not provided'}</Typography>
                                    )}
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 5 }}>
                    <Stack spacing={3}>
                        {isStudent ? (
                            <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                                <CardContent>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Business fontSize="small" /> Mentoring Info
                                    </Typography>
                                    <Stack spacing={2} sx={{ mt: 2 }}>
                                        <Box sx={{ p: 2, bgcolor: 'primary.50', borderRadius: 3 }}>
                                            <Typography variant="caption" color="textSecondary">Assigned Mentor</Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                {student?.mentorId?.name || 'Not assigned yet'}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ p: 2, bgcolor: 'success.50', borderRadius: 3 }}>
                                            <Typography variant="caption" color="textSecondary">Registration Status</Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                {student?.isFormSubmitted ? 'Verified Student' : 'Initial Phase'}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                                <CardContent>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Group fontSize="small" /> Faculty Dashboard
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        You are currently signed in with {user?.role} privileges. You can manage student records and review submissions from your main dashboard.
                                    </Typography>
                                    <Button 
                                        sx={{ mt: 2 }} 
                                        variant="outlined" 
                                        fullWidth
                                        onClick={() => navigate(user?.role === 'Staff' ? '/staff/dashboard' : '/hod/dashboard')}
                                    >
                                        Go to Dashboard
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {(user?.role === 'Student' || user?.role === 'Staff') && (
                            <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none', bgcolor: 'primary.main', color: 'white' }}>
                                <CardContent>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        Need Assistance?
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                                        {user?.role === 'Student' 
                                            ? "If your profile details are incorrect or you need a different mentor, please contact your department HOD."
                                            : "If you have issues with your mentee list or portal access, please contact the department HOD."}
                                    </Typography>
                                    <Button 
                                        component="a"
                                        href="mailto:hod@mms.edu?subject=Support Request"
                                        variant="contained" 
                                        color="inherit" 
                                        fullWidth 
                                        sx={{ color: 'primary.main', fontWeight: 'bold' }}
                                    >
                                        Contact Support
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ProfilePage;
