import { useState, useEffect } from 'react';
import { 
    Box, Stepper, Step, StepLabel, Button, Typography, 
    Card, CardContent, Grid, TextField, LinearProgress,
    CircularProgress, Alert, Snackbar, Paper
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { saveFormData, getFormData, submitForm as submitFormApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

const steps = [
    'Student Personal Details', 'Family Details', 'Contact Information', 
    '10th Academic Details', '12th Academic Details', 'Current Semester Details', 
    'CGPA and SGPA Details', 'Attendance Details', 'Internal Test Marks', 
    'Semester Results', 'Backlogs', 'Co-Curricular Activities', 
    'Extra Curricular Activities', 'Internships / Projects', 
    'Skill Development Courses', 'Career Goals', 'Personal Strengths', 
    'Weakness and Challenges', 'Mentor Meeting Details', 'Mentor Remarks', 
    'Final Submission'
];

const MentoringFormWizard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await getFormData(user.studentId || user.id, 1); // Prefer student record ID
                setFormData(data || {});
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user.id]);

    const handleNext = async () => {
        setSaving(true);
        try {
            await saveFormData({ studentId: user.studentId || user.id, semester: 1, data: formData });
            setActiveStep((prev) => prev + 1);
            setMessage('Progress saved automatically');
        } catch (err) {
            setMessage('Error saving progress');
        } finally {
            setSaving(false);
        }
    };

    const handleSubmit = async () => {
        setSaving(true);
        try {
            await saveFormData({ studentId: user.studentId || user.id, semester: 1, data: formData });
            await submitFormApi();
            setMessage('Form submitted successfully!');
            setTimeout(() => navigate('/student/dashboard'), 1500);
        } catch (err) {
            setMessage('Error submitting form');
        } finally {
            setSaving(false);
        }
    };

    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

    const renderStepContent = (step) => {
        switch (step) {
            case 0: return (
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Full Name" name="name" value={formData.name || ''} onChange={handleChange} /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Register Number" name="regNo" value={formData.regNo || ''} onChange={handleChange} /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Date of Birth" type="date" InputLabelProps={{ shrink: true }} name="dob" value={formData.dob || ''} onChange={handleChange} /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Gender" name="gender" value={formData.gender || ''} onChange={handleChange} /></Grid>
                    <Grid item xs={12}><TextField fullWidth multiline rows={2} label="Permanent Address" name="address" value={formData.address || ''} onChange={handleChange} /></Grid>
                </Grid>
            );
            case 1: return (
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Father's Name" name="fatherName" value={formData.fatherName || ''} onChange={handleChange} /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Mother's Name" name="motherName" value={formData.motherName || ''} onChange={handleChange} /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Parent's Occupation" name="parentOccupation" value={formData.parentOccupation || ''} onChange={handleChange} /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Annual Income" name="income" value={formData.income || ''} onChange={handleChange} /></Grid>
                </Grid>
            );
            case 2: return (
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Student Mobile" name="mobile" value={formData.mobile || ''} onChange={handleChange} /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Parent Mobile" name="parentMobile" value={formData.parentMobile || ''} onChange={handleChange} /></Grid>
                    <Grid item xs={12}><TextField fullWidth label="Personal Email" name="personalEmail" value={formData.personalEmail || ''} onChange={handleChange} /></Grid>
                </Grid>
            );
            case 3: return (
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="10th School Name" name="school10" value={formData.school10 || ''} onChange={handleChange} /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="10th Board" name="board10" value={formData.board10 || ''} onChange={handleChange} /></Grid>
                    <Grid item xs={12} sm={3}><TextField fullWidth label="Year of Passing" name="year10" value={formData.year10 || ''} onChange={handleChange} /></Grid>
                    <Grid item xs={12} sm={3}><TextField fullWidth label="Percentage / CGPA" name="perc10" value={formData.perc10 || ''} onChange={handleChange} /></Grid>
                </Grid>
            );
            case 4: return (
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="12th / Diploma College" name="college12" value={formData.college12 || ''} onChange={handleChange} /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="12th Board / DTE" name="board12" value={formData.board12 || ''} onChange={handleChange} /></Grid>
                    <Grid item xs={12} sm={3}><TextField fullWidth label="Year of Passing" name="year12" value={formData.year12 || ''} onChange={handleChange} /></Grid>
                    <Grid item xs={12} sm={3}><TextField fullWidth label="Percentage / CGPA" name="perc12" value={formData.perc12 || ''} onChange={handleChange} /></Grid>
                </Grid>
            );
            case 5: return (
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}><TextField fullWidth label="Current Semester" name="currentSem" value={formData.currentSem || ''} onChange={handleChange} /></Grid>
                    <Grid item xs={12} sm={4}><TextField fullWidth label="Section" name="section" value={formData.section || ''} onChange={handleChange} /></Grid>
                    <Grid item xs={12} sm={4}><TextField fullWidth label="Batch" name="batch" value={formData.batch || ''} onChange={handleChange} /></Grid>
                </Grid>
            );
            case 6: return (
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Current SGPA" name="sgpa" value={formData.sgpa || ''} onChange={handleChange} /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Current CGPA" name="cgpa" value={formData.cgpa || ''} onChange={handleChange} /></Grid>
                </Grid>
            );
            case 7: return (
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Total Working Days" name="workingDays" value={formData.workingDays || ''} onChange={handleChange} /></Grid>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Days Present" name="presentDays" value={formData.presentDays || ''} onChange={handleChange} /></Grid>
                    <Grid item xs={12}><Typography variant="body2">Percentage: {formData.workingDays ? ((formData.presentDays/formData.workingDays)*100).toFixed(2) : 0}%</Typography></Grid>
                </Grid>
            );
            case 8: return (
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={3}><TextField fullWidth label="Sub 1 Marks" name="m1" value={formData.m1 || ''} onChange={handleChange} /></Grid>
                    <Grid item xs={12} sm={3}><TextField fullWidth label="Sub 2 Marks" name="m2" value={formData.m2 || ''} onChange={handleChange} /></Grid>
                    <Grid item xs={12} sm={3}><TextField fullWidth label="Sub 3 Marks" name="m3" value={formData.m3 || ''} onChange={handleChange} /></Grid>
                    <Grid item xs={12} sm={3}><TextField fullWidth label="Sub 4 Marks" name="m4" value={formData.m4 || ''} onChange={handleChange} /></Grid>
                    <Grid item xs={12} sm={3}><TextField fullWidth label="Sub 5 Marks" name="m5" value={formData.m5 || ''} onChange={handleChange} /></Grid>
                    <Grid item xs={12} sm={3}><TextField fullWidth label="Sub 6 Marks" name="m6" value={formData.m6 || ''} onChange={handleChange} /></Grid>
                </Grid>
            );
            case 9: return (
                <Grid container spacing={3}>
                    <Grid item xs={12}><TextField fullWidth multiline rows={4} label="Previous Semester Results Summary" name="semResults" value={formData.semResults || ''} onChange={handleChange} /></Grid>
                </Grid>
            );
            case 10: return (
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}><TextField fullWidth label="Number of Backlogs" name="backlogs" value={formData.backlogs || ''} onChange={handleChange} /></Grid>
                    <Grid item xs={12}><TextField fullWidth multiline rows={3} label="List of Backlog Subjects" name="backlogList" value={formData.backlogList || ''} onChange={handleChange} /></Grid>
                </Grid>
            );
            case 11:
            case 12:
            case 13:
            case 14: return (
                <Box>
                    <Typography variant="body1" sx={{ mb: 2 }}>{steps[step]} Details</Typography>
                    <TextField 
                        fullWidth 
                        multiline 
                        rows={6} 
                        placeholder={`List your ${steps[step].toLowerCase()}...`}
                        name={`step_${step}`} 
                        value={formData[`step_${step}`] || ''} 
                        onChange={handleChange} 
                    />
                    <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>Include dates, organizations, and certificates obtained.</Typography>
                </Box>
            );
            case 15: return (
                <Grid container spacing={3}>
                    <Grid item xs={12}><TextField fullWidth multiline rows={3} label="Career Goals (Short term & Long term)" name="careerGoals" value={formData.careerGoals || ''} onChange={handleChange} /></Grid>
                    <Grid item xs={12}><TextField fullWidth label="Preferred Industry" name="preferredIndustry" value={formData.preferredIndustry || ''} onChange={handleChange} /></Grid>
                </Grid>
            );
            case 16:
            case 17: return (
                <Box>
                    <Typography variant="body1" sx={{ mb: 2 }}>{steps[step]} Analysis</Typography>
                    <TextField 
                        fullWidth 
                        multiline 
                        rows={6} 
                        variant="outlined"
                        placeholder={`Be honest about your ${steps[step].toLowerCase()}. This helps your mentor guide you better.`}
                        name={`step_${step}`} 
                        value={formData[`step_${step}`] || ''} 
                        onChange={handleChange} 
                    />
                </Box>
            );
            case 18:
            case 19: return (
                <Box>
                    <Typography variant="body1" sx={{ mb: 2 }}>{steps[step]}</Typography>
                    <Alert severity="info" sx={{ mb: 2 }}>This section is usually filled during or after the meeting with your mentor.</Alert>
                    <TextField 
                        fullWidth 
                        multiline 
                        rows={4} 
                        label="Student's Perspective" 
                        name={`step_${step}`} 
                        value={formData[`step_${step}`] || ''} 
                        onChange={handleChange} 
                    />
                </Box>
            );
            case 20: return (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h5" color="success.main" fontWeight="bold" gutterBottom>🎉 All Steps Completed!</Typography>
                    <Typography variant="body1" sx={{ mb: 4 }}>Preview your data and click Finish to submit the final form to your mentor.</Typography>
                    <Alert severity="info" sx={{ mb: 3 }}>Submitting this form will notify your mentor for review.</Alert>
                </Box>
            );
            default: return (
                <Box>
                    <Typography variant="body1" sx={{ mb: 2 }}>{steps[step]} Details</Typography>
                    <TextField 
                        fullWidth 
                        multiline 
                        rows={6} 
                        variant="outlined"
                        placeholder={`Describe your ${steps[step].toLowerCase()} here...`}
                        name={`step_${step}`} 
                        value={formData[`step_${step}`] || ''} 
                        onChange={handleChange} 
                    />
                </Box>
            );
        }
    };

    return (
        <Box sx={{ maxWidth: 1000, mx: 'auto', p: 4 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0' }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                    Student Mentoring Record
                </Typography>
                <Typography color="textSecondary" sx={{ mb: 4 }}>
                    Please fill out the details accurately. Progress is saved automatically on "Next".
                </Typography>

                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5, display: { xs: 'none', md: 'flex' } }}>
                    {steps.map((label, index) => (
                        <Step key={label}>
                            <StepLabel>{index + 1}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {saving && <LinearProgress sx={{ mb: 2 }} />}

                <Box sx={{ mt: 2, mb: 4, minHeight: 300 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                        Step {activeStep + 1}: {steps[activeStep]}
                    </Typography>
                    {renderStepContent(activeStep)}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="contained"
                        onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                        sx={{ borderRadius: 2, px: 4 }}
                    >
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next Step'}
                    </Button>
                </Box>
            </Paper>

            <Snackbar 
                open={!!message} 
                autoHideDuration={3000} 
                onClose={() => setMessage('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={message.includes('Error') ? 'error' : 'success'}>
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default MentoringFormWizard;
