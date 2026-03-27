import { useState, useEffect } from 'react';
import { 
    Box, Typography, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Select, MenuItem,
    Button, CircularProgress, Alert, Snackbar
} from '@mui/material';
import { Save, People } from '@mui/icons-material';
import { getStudents, assignMentor as assignMentorApi, getAllMentors } from '../services/api'; 

const MentorAssignment = () => {
    const [students, setStudents] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [assignments, setAssignments] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [studRes, mentRes] = await Promise.all([
                    getStudents(),
                    getAllMentors()
                ]);
                
                setStudents(studRes.data);
                setMentors(mentRes.data);
                
                // Map current assignments
                const initial = {};
                studRes.data.forEach(s => {
                    if (s.mentorId) initial[s._id] = s.mentorId._id || s.mentorId;
                });
                setAssignments(initial);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleAssignChange = (studentObjectId, mentorId) => {
        setAssignments({ ...assignments, [studentObjectId]: mentorId });
    };

    const handleSave = async (studentObjectId) => {
        setSaving(true);
        try {
            await assignMentorApi({ studentObjectId, mentorId: assignments[studentObjectId] });
            setMessage('Mentor assigned successfully');
            
            // Update local state to reflect new mentor
            const updatedStudents = students.map(s => {
                if (s._id === studentObjectId) {
                    const mentor = mentors.find(m => m._id === assignments[studentObjectId]);
                    return { ...s, mentorId: { _id: mentor._id, name: mentor.name } };
                }
                return s;
            });
            setStudents(updatedStudents);
        } catch (err) {
            setMessage('Error assigning mentor');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

    return (
        <Box sx={{ p: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight="black" color="primary">Mentor Assignment</Typography>
                    <Typography color="textSecondary">Assign students to their respective mentors for counseling.</Typography>
                </Box>
                <People sx={{ fontSize: 40, color: 'primary.light', opacity: 0.5 }} />
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid #e2e8f0' }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell><strong>Student Name</strong></TableCell>
                            <TableCell><strong>Department / Year</strong></TableCell>
                            <TableCell><strong>Current Mentor</strong></TableCell>
                            <TableCell><strong>New Assignment</strong></TableCell>
                            <TableCell align="right"><strong>Action</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {students.map((student) => (
                            <TableRow key={student._id}>
                                <TableCell fontWeight="bold">{student.name}</TableCell>
                                <TableCell>{student.department} / {student.year}</TableCell>
                                <TableCell>
                                    {student.mentorId?.name || <Typography component="span" color="error" variant="caption">Unassigned</Typography>}
                                </TableCell>
                                <TableCell>
                                    <Select
                                        size="small"
                                        value={assignments[student._id] || ''}
                                        onChange={(e) => handleAssignChange(student._id, e.target.value)}
                                        displayEmpty
                                        sx={{ minWidth: 200, borderRadius: 2 }}
                                    >
                                        <MenuItem value="" disabled>Select Mentor</MenuItem>
                                        {mentors.map(m => (
                                            <MenuItem key={m._id} value={m._id}>{m.name}</MenuItem>
                                        ))}
                                    </Select>
                                </TableCell>
                                <TableCell align="right">
                                    <Button 
                                        variant="contained" 
                                        size="small" 
                                        startIcon={<Save />}
                                        disabled={!assignments[student._id] || assignments[student._id] === (student.mentorId?._id || student.mentorId)}
                                        onClick={() => handleSave(student._id)}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        Save
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Snackbar open={!!message} autoHideDuration={3000} onClose={() => setMessage('')}>
                <Alert severity={message.includes('Error') ? 'error' : 'success'}>{message}</Alert>
            </Snackbar>
        </Box>
    );
};

export default MentorAssignment;
