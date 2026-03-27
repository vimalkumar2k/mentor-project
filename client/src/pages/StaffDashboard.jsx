import { useState, useEffect } from 'react';
import { 
    Box, Typography, Grid, Card, CardContent, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, Paper, 
    Button, Chip, Avatar, TextField, InputAdornment 
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Group, Search, Person, Assignment } from '@mui/icons-material';
import { getStudents } from '../services/api';

const StaffDashboard = () => {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const { data } = await getStudents();
                setStudents(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStudents();
    }, []);

    const filteredStudents = students.filter(s => 
        s.name.toLowerCase().includes(search.toLowerCase()) || 
        s.studentId.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="black" color="primary">
                    Mentor Dashboard
                </Typography>
                <Typography color="textSecondary">
                    Manage your assigned mentees and their progress.
                </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                    <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ p: 1.5, bgcolor: 'primary.50', borderRadius: 3 }}>
                                <Group color="primary" />
                            </Box>
                            <Box>
                                <Typography variant="h5" fontWeight="black">{students.length}</Typography>
                                <Typography variant="caption" color="textSecondary">Total Mentees</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ p: 1.5, bgcolor: 'warning.50', borderRadius: 3 }}>
                                <Assignment color="warning" />
                            </Box>
                            <Box>
                                <Typography variant="h5" fontWeight="black">3</Typography>
                                <Typography variant="caption" color="textSecondary">Pending Reports</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                <TextField
                    placeholder="Search students by name or ID..."
                    size="small"
                    sx={{ width: 400, bgcolor: 'white' }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 4 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell><strong>Student</strong></TableCell>
                            <TableCell><strong>ID</strong></TableCell>
                            <TableCell><strong>Year</strong></TableCell>
                            <TableCell><strong>Form Status</strong></TableCell>
                            <TableCell><strong>Performance</strong></TableCell>
                            <TableCell align="right"><strong>Action</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredStudents.length > 0 ? filteredStudents.map((row) => (
                            <TableRow key={row._id} hover>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: 'secondary.light', width: 32, height: 32, fontSize: '0.8rem' }}>
                                            {row.name.charAt(0)}
                                        </Avatar>
                                        <Typography variant="body2" fontWeight="medium">{row.name}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>{row.studentId}</TableCell>
                                <TableCell>{row.year}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={row.isFormSubmitted ? "Submitted" : "Initial Draft"} 
                                        size="small" 
                                        color={row.isFormSubmitted ? "success" : "warning"}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>7.8 CGPA</TableCell>
                                <TableCell align="right">
                                    <Button 
                                        component={Link}
                                        to={`/staff/review/${row.userId}`}
                                        size="small" 
                                        variant="contained" 
                                        sx={{ borderRadius: 2 }}
                                    >
                                        Review
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                    <Typography color="textSecondary">No students found or assigned yet.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default StaffDashboard;
