import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Box, Typography, Card, CardContent, Grid, 
    Avatar, Chip, Button, CircularProgress, Alert,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { ArrowBack, Person, School, Email } from '@mui/icons-material';
import { getMenteesByMentorId } from '../services/api';

const MentorMentees = () => {
    const { mentorId } = useParams();
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMentees = async () => {
            try {
                const { data } = await getMenteesByMentorId(mentorId);
                setStudents(data);
            } catch (err) {
                setError("Failed to load mentees");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMentees();
    }, [mentorId]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

    return (
        <Box>
            <Button 
                startIcon={<ArrowBack />} 
                onClick={() => navigate('/hod/mentors')}
                sx={{ mb: 3 }}
            >
                Back to Mentors
            </Button>

            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight="black" color="primary">
                        Allotted Mentees
                    </Typography>
                    <Typography color="textSecondary">
                        Listing all students assigned to this mentor.
                    </Typography>
                </Box>
                <Chip label={`${students.length} Students`} color="primary" />
            </Box>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {students.length === 0 ? (
                <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 4 }}>
                    <Typography color="textSecondary">No students have been assigned to this mentor yet.</Typography>
                </Paper>
            ) : (
                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 4 }}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8fafc' }}>
                            <TableRow>
                                <TableCell><strong>Student Name</strong></TableCell>
                                <TableCell><strong>Reg. Number</strong></TableCell>
                                <TableCell><strong>Department</strong></TableCell>
                                <TableCell><strong>Year / Sem</strong></TableCell>
                                <TableCell align="center"><strong>Form Status</strong></TableCell>
                                <TableCell align="right"><strong>Action</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {students.map((student) => (
                                <TableRow key={student._id} hover>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{ bgcolor: 'primary.light' }}>{student.name.charAt(0)}</Avatar>
                                            <Typography variant="body2" fontWeight="bold">{student.name}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{student.studentId || student.regNo}</TableCell>
                                    <TableCell>{student.department}</TableCell>
                                    <TableCell>{student.year}</TableCell>
                                    <TableCell align="center">
                                        <Chip 
                                            label={student.isFormSubmitted ? "Submitted" : "Pending"} 
                                            color={student.isFormSubmitted ? "success" : "warning"}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button 
                                            size="small" 
                                            variant="outlined"
                                            onClick={() => navigate(`/hod/review/${student.userId._id || student.userId}`)}
                                        >
                                            Review Form
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default MentorMentees;
