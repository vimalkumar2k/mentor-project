import { Box, Typography, Grid, Card, CardContent, Divider, Chip, Avatar } from '@mui/material';
import { Business, People, Group, School } from '@mui/icons-material';

const DepartmentList = () => {
    const departments = [
        { name: 'Information Technology', code: 'IT', students: 120, mentors: 5, color: '#6366f1' },
        { name: 'Computer Science & Engineering', code: 'CSE', students: 180, mentors: 8, color: '#ec4899' },
        { name: 'AI & Data Science', code: 'AIDS', students: 60, mentors: 3, color: '#06b6d4' },
        { name: 'AI & Machine Learning', code: 'AIML', students: 55, mentors: 3, color: '#f59e0b' },
        { name: 'CS Business Systems', code: 'CSBS', students: 45, mentors: 2, color: '#10b981' },
        { name: 'VLSI Design', code: 'VLSI', students: 30, mentors: 2, color: '#8b5cf6' },
        { name: 'Fashion Technology', code: 'FT', students: 40, mentors: 2, color: '#f43f5e' },
        { name: 'Biotechnology', code: 'BIOTECH', students: 50, mentors: 3, color: '#22c55e' },
        { name: 'Mechanical Engineering', code: 'MECH', students: 100, mentors: 6, color: '#3b82f6' },
        { name: 'Civil Engineering', code: 'CIVIL', students: 80, mentors: 4, color: '#ef4444' }
    ];

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="black" color="primary">
                    Departmental Oversight
                </Typography>
                <Typography color="textSecondary">
                    Overview of student strength and mentoring capacity across all branches.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {departments.map((dept) => (
                    <Grid item xs={12} sm={6} md={4} key={dept.code}>
                        <Card sx={{ 
                            borderRadius: 4, 
                            border: '1px solid #e2e8f0', 
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            transition: 'transform 0.2s',
                            '&:hover': { transform: 'translateY(-4px)' }
                        }}>
                            <CardContent sx={{ p: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                                    <Avatar sx={{ bgcolor: dept.color, width: 44, height: 44 }}>
                                        <Business />
                                    </Avatar>
                                    <Chip label={dept.code} sx={{ fontWeight: 'bold' }} />
                                </Box>
                                
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                                    {dept.name}
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <School sx={{ fontSize: 18, color: 'text.secondary' }} />
                                            <Typography variant="body2" color="textSecondary">Students</Typography>
                                        </Box>
                                        <Typography variant="h6" fontWeight="bold">{dept.students}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <People sx={{ fontSize: 18, color: 'text.secondary' }} />
                                            <Typography variant="body2" color="textSecondary">Mentors</Typography>
                                        </Box>
                                        <Typography variant="h6" fontWeight="bold">{dept.mentors}</Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default DepartmentList;
