import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, Typography, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, Avatar, TextField, InputAdornment, Chip,
    IconButton, Tooltip
} from '@mui/material';
import { Search, Person, Phone, Email, Visibility } from '@mui/icons-material';
import { getAllMentors } from '../services/api';

const MentorList = () => {
    const navigate = useNavigate();
    const [mentors, setMentors] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const { data } = await getAllMentors();
                setMentors(data);
            } catch (err) {
                console.error('Error fetching mentors:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMentors();
    }, []);

    const filteredMentors = mentors.filter(m => 
        (m.name || '').toLowerCase().includes(search.toLowerCase()) || 
        (m.email || '').toLowerCase().includes(search.toLowerCase()) ||
        (m.department || '').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="black" color="primary">
                    All Mentors
                </Typography>
                <Typography color="textSecondary">
                    View and manage all faculty mentors across departments.
                </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
                <TextField
                    placeholder="Search by name, email, or department..."
                    size="small"
                    sx={{ width: 450, bgcolor: 'white' }}
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
                            <TableCell><strong>Mentor Name</strong></TableCell>
                            <TableCell><strong>Department</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Contact</strong></TableCell>
                            <TableCell align="center"><strong>Status</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredMentors.length > 0 ? filteredMentors.map((row) => (
                            <TableRow key={row._id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/hod/mentor/${row._id}/mentees`)}>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36 }}>
                                            {(row.name || 'M').charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" fontWeight="bold">{row.name}</Typography>
                                            <Typography variant="caption" color="textSecondary">Faculty ID: {row._id.slice(-6).toUpperCase()}</Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Chip label={row.department || 'General'} size="small" variant="outlined" />
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        <Typography variant="body2">{row.email}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        <Typography variant="body2">{row.contactNumber || 'Not set'}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="center">
                                    <Tooltip title="View Alloted Mentees">
                                        <IconButton color="primary" size="small">
                                            <Visibility fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                    <Typography color="textSecondary">No mentors found matching your search.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default MentorList;
