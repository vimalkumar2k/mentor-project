import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Box, Typography, Paper, Grid, Divider, Button, 
    CircularProgress, Alert, Chip, Card, CardContent, TextField,
    IconButton, Stack
} from '@mui/material';
import { ChevronLeft, ChevronRight, Save, AssignmentInd } from '@mui/icons-material';
import { getFormData, saveFormData, getStudentById } from '../services/api';
import { useAuth } from '../context/AuthContext';

const StudentFormReview = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activePage, setActivePage] = useState(0);
    const [formData, setFormData] = useState({});
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mentorRemarks, setMentorRemarks] = useState('');

    const pages = [
        'Personal Details', 'Family Details', 'Contact Details', '10th Marks', '12th Marks', 
        'Current Semester', 'CGPA/SGPA Progress', 'Attendance Record', 'Internal Marks', 'Semester Results', 
        'Backlog History', 'Co-Curricular', 'Extra-Curricular', 'Internships', 'Technical Skills', 
        'Career Goals', 'Strengths', 'Weaknesses', 'Meeting Details', 'Mentor Feedback'
    ];

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch student first to ensure they exist
                const studentRes = await getStudentById(studentId);
                if (!studentRes.data) {
                    setError('Student record not found. Please ensure the student has registered their profile correctly.');
                    setLoading(false);
                    return;
                }
                setStudent(studentRes.data);

                // Fetch form data using the Student record's actual _id
                const formRes = await getFormData(studentRes.data._id, 1);
                // Handle both nested (mock) and flat (live) response structures
                const data = formRes.data?.mentoring || formRes.data || {};
                setFormData(data);
                setMentorRemarks(data.mentorRemarks || '');
            } catch (err) {
                console.error('Error loading review data:', err);
                setError('Unable to load student form data. This student may not have started the mentoring form yet.');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [studentId]);

    const handleSaveRemarks = async () => {
        try {
            await saveFormData({ 
                studentId, 
                semester: 1, 
                data: { ...formData, mentorRemarks } 
            });
            alert('Remarks saved successfully');
        } catch (err) {
            alert('Error saving remarks');
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 20, gap: 2 }}>
            <CircularProgress size={60} thickness={4} />
            <Typography color="textSecondary">Fetching enrollment records...</Typography>
        </Box>
    );

    if (error) return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 10 }}>
            <Alert 
                severity="info" 
                variant="outlined" 
                sx={{ borderRadius: 4, py: 3, px: 4, bgcolor: 'white' }}
                action={
                    <Button color="inherit" size="small" onClick={() => navigate(-1)}>Go Back</Button>
                }
            >
                <Typography variant="h6" fontWeight="bold" gutterBottom>No Data Available</Typography>
                {error}
            </Alert>
        </Box>
    );

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 1 }}>
                <IconButton onClick={() => navigate(user?.role === 'HOD' ? '/hod/students' : '/staff/students')} color="primary">
                    <ChevronLeft />
                </IconButton>
                <Typography variant="h5" fontWeight="black" color="primary">
                    Reviewing: {student?.name || 'Loading...'}
                </Typography>
            </Box>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none', position: 'sticky', top: 100 }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                <AssignmentInd color="primary" />
                                <Typography variant="h6" fontWeight="bold">Academic Profile</Typography>
                            </Box>
                            
                            <Stack spacing={2}>
                                <Box>
                                    <Typography variant="caption" color="textSecondary">Register Number</Typography>
                                    <Typography variant="body1" fontWeight="bold">{student?.studentId || 'N/A'}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="textSecondary">Branch & Year</Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {student?.department} • {student?.year} Year
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="textSecondary">Current Status</Typography>
                                    <Box sx={{ mt: 0.5 }}>
                                        <Chip 
                                            label={student?.isFormSubmitted ? "Submitted" : "Pending Action"} 
                                            color={student?.isFormSubmitted ? "success" : "warning"}
                                            size="small"
                                            sx={{ fontWeight: 'bold' }}
                                        />
                                    </Box>
                                </Box>
                            </Stack>

                            <Divider sx={{ my: 3 }} />
                            
                            <Typography variant="subtitle2" fontWeight="bold" color="textSecondary" gutterBottom>
                                NAVIGATION (Section {activePage + 1}/20)
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, maxHeight: 400, overflowY: 'auto', pr: 1 }}>
                                {pages.map((page, index) => (
                                    <Button 
                                        key={index}
                                        variant={activePage === index ? "contained" : "text"}
                                        onClick={() => setActivePage(index)}
                                        sx={{ 
                                            justifyContent: 'flex-start', 
                                            textAlign: 'left', 
                                            borderRadius: 2,
                                            py: 1,
                                            px: 2,
                                            fontSize: '0.85rem'
                                        }}
                                        size="small"
                                    >
                                        {index + 1}. {page}
                                    </Button>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper elevation={0} sx={{ p: 5, borderRadius: 4, border: '1px solid #e2e8f0', minHeight: 650, bgcolor: 'white' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                            <Box>
                                <Typography variant="caption" color="primary" fontWeight="bold" sx={{ letterSpacing: 1, textTransform: 'uppercase' }}>
                                    Mentoring Form Section {activePage + 1}
                                </Typography>
                                <Typography variant="h4" fontWeight="black" sx={{ mt: 0.5 }}>
                                    {pages[activePage]}
                                </Typography>
                            </Box>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="h3" fontWeight="black" color="primary" sx={{ opacity: 0.1 }}>
                                    {String(activePage + 1).padStart(2, '0')}
                                </Typography>
                            </Box>
                        </Box>

                        <Paper variant="outlined" sx={{ p: 4, borderRadius: 3, bgcolor: '#f8fafc', mb: 4 }}>
                            {(() => {
                                const renderField = (label, value) => (
                                    <Box sx={{ mb: 2, pb: 1, borderBottom: '1px solid #e2e8f0' }}>
                                        <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'bold' }}>{label}</Typography>
                                        <Typography variant="body1">{value || 'Not provided'}</Typography>
                                    </Box>
                                );

                                switch(activePage) {
                                    case 0: return (
                                        <Box>
                                            {renderField('Full Name', formData.name)}
                                            {renderField('Register Number', formData.regNo)}
                                            {renderField('Date of Birth', formData.dob)}
                                            {renderField('Gender', formData.gender)}
                                            {renderField('Permanent Address', formData.address)}
                                        </Box>
                                    );
                                    case 1: return (
                                        <Box>
                                            {renderField("Father's Name", formData.fatherName)}
                                            {renderField("Mother's Name", formData.motherName)}
                                            {renderField("Parent's Occupation", formData.parentOccupation)}
                                            {renderField("Annual Income", formData.income)}
                                        </Box>
                                    );
                                    case 2: return (
                                        <Box>
                                            {renderField("Student Mobile", formData.mobile)}
                                            {renderField("Parent Mobile", formData.parentMobile)}
                                            {renderField("Email ID", formData.personalEmail)}
                                        </Box>
                                    );
                                    case 3: return (
                                        <Box>
                                            {renderField("10th School", formData.school10)}
                                            {renderField("10th Board", formData.board10)}
                                            {renderField("Year of Passing", formData.year10)}
                                            {renderField("Percentage", formData.perc10)}
                                        </Box>
                                    );
                                    case 4: return (
                                        <Box>
                                            {renderField("12th/Diploma College", formData.college12)}
                                            {renderField("Board", formData.board12)}
                                            {renderField("Year of Passing", formData.year12)}
                                            {renderField("Percentage", formData.perc12)}
                                        </Box>
                                    );
                                    case 5: return (
                                        <Box>
                                            {renderField("Current Semester", formData.currentSem)}
                                            {renderField("Section", formData.section)}
                                            {renderField("Batch", formData.batch)}
                                        </Box>
                                    );
                                    case 6: return (
                                        <Box>
                                            {renderField("Current SGPA", formData.sgpa)}
                                            {renderField("Current CGPA", formData.cgpa)}
                                        </Box>
                                    );
                                    case 7: return (
                                        <Box>
                                            {renderField("Total Working Days", formData.workingDays)}
                                            {renderField("Days Present", formData.presentDays)}
                                            <Typography variant="h6" color="primary">Attendance: {formData.workingDays ? ((formData.presentDays/formData.workingDays)*100).toFixed(2) : 0}%</Typography>
                                        </Box>
                                    );
                                    case 8: return (
                                        <Grid container spacing={2}>
                                            {[1,2,3,4,5,6].map(i => (
                                                <Grid size={{ xs: 6 }} key={i}>{renderField(`Subject ${i} Marks`, formData[`m${i}`])}</Grid>
                                            ))}
                                        </Grid>
                                    );
                                    case 9: return <Typography sx={{ whiteSpace: 'pre-wrap' }}>{formData.semResults || 'Not provided'}</Typography>;
                                    case 10: return (
                                        <Box>
                                            {renderField("Number of Backlogs", formData.backlogs)}
                                            {renderField("List of Subjects", formData.backlogList)}
                                        </Box>
                                    );
                                    case 15: return (
                                        <Box>
                                            {renderField("Career Goals", formData.careerGoals)}
                                            {renderField("Preferred Industry", formData.preferredIndustry)}
                                        </Box>
                                    );
                                    default: return (
                                        <Typography variant="body1" color="textPrimary" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, fontSize: '1.05rem' }}>
                                            {formData[`step_${activePage}`] || "The student has not populated this section of the mentoring form yet."}
                                        </Typography>
                                    );
                                }
                            })()}
                        </Paper>

                        {activePage === 19 && (
                            <Box sx={{ mt: 6, pt: 4, borderTop: '2px dashed #e2e8f0' }}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Save fontSize="small" color="primary" /> Counseling & Official Remarks
                                </Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                    Provide your assessment or record the details of the counseling session here.
                                </Typography>
                                <TextField 
                                    fullWidth 
                                    multiline 
                                    rows={8} 
                                    placeholder="Enter your professional assessment and recommendations..."
                                    value={mentorRemarks}
                                    onChange={(e) => setMentorRemarks(e.target.value)}
                                    sx={{ 
                                        mb: 3, 
                                        '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'white' } 
                                    }}
                                />
                                <Button 
                                    variant="contained" 
                                    size="large"
                                    startIcon={<Save />} 
                                    onClick={handleSaveRemarks}
                                    sx={{ borderRadius: 3, px: 4, py: 1.5, fontWeight: 'bold' }}
                                >
                                    Save Official Remarks
                                </Button>
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 8, pt: 2 }}>
                            <Button 
                                variant="outlined"
                                disabled={activePage === 0} 
                                onClick={() => setActivePage(p => p - 1)}
                                startIcon={<ChevronLeft />}
                                sx={{ borderRadius: 2 }}
                            >
                                Previous
                            </Button>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                {activePage < 19 && (
                                    <Button 
                                        variant="contained"
                                        onClick={() => setActivePage(p => p + 1)}
                                        endIcon={<ChevronRight />}
                                        sx={{ borderRadius: 2, px: 4 }}
                                    >
                                        Next
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default StudentFormReview;
