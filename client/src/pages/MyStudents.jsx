import { useState, useEffect } from 'react';
import { 
    Box, Typography, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, Button, Chip, Avatar, TextField, InputAdornment 
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Search, Assignment } from '@mui/icons-material';
import { getStudents } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyStudents = () => {
    const { user } = useAuth();
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
        (s.name || '').toLowerCase().includes(search.toLowerCase()) || 
        (s.studentId || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="black" color="primary">
                    {user?.role === 'HOD' ? 'Departmental Students' : 'My Assigned Mentees'}
                </Typography>
                <Typography color="textSecondary">
                    {user?.role === 'HOD' 
                        ? 'Administrative overview and monitoring of all students in the department.'
                        : 'View and review the progress of students assigned to you for mentoring.'}
                </Typography>
            </Box>

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
                                <Search color="action" />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 4 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell><strong>Student Name</strong></TableCell>
                            <TableCell><strong>Register Number</strong></TableCell>
                            <TableCell><strong>Department</strong></TableCell>
                            <TableCell><strong>Year</strong></TableCell>
                            <TableCell><strong>Mentoring Form</strong></TableCell>
                            <TableCell align="right"><strong>Action</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredStudents.length > 0 ? filteredStudents.map((row) => (
                            <TableRow key={row._id} hover>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32, fontSize: '0.8rem' }}>
                                            {(row.name || 'S').charAt(0)}
                                        </Avatar>
                                        <Typography variant="body2" fontWeight="medium">{row.name}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>{row.studentId}</TableCell>
                                <TableCell>{row.department}</TableCell>
                                <TableCell>{row.year}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={row.isFormSubmitted ? "Submitted" : "Initial Draft"} 
                                        size="small" 
                                        color={row.isFormSubmitted ? "success" : "warning"}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Button 
                                        component={Link}
                                        to={`${user?.role === 'HOD' ? '/hod' : '/staff'}/review/${row.userId}`}
                                        size="small" 
                                        variant="contained" 
                                        startIcon={<Assignment />}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        Review
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                    <Typography color="textSecondary">No assigned students found.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default MyStudents;
