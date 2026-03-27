import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './layouts/DashboardLayout';
import MentoringFormWizard from './pages/MentoringFormWizard';
import StudentDashboard from './pages/StudentDashboard';
import StaffDashboard from './pages/StaffDashboard';
import HODDashboard from './pages/HODDashboard';
import StudentFormReview from './pages/StudentFormReview';
import MentorAssignment from './pages/MentorAssignment';
import ProfilePage from './pages/ProfilePage';
import MyStudents from './pages/MyStudents';
import MentorList from './pages/MentorList';
import MentorMentees from './pages/MentorMentees';
import DepartmentList from './pages/DepartmentList';

const ProtectedRoute = ({ children, roles }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
    return children;
};

const HomeRedirect = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    if (user.role === 'Student') return <Navigate to="/student/dashboard" />;
    if (user.role === 'Staff') return <Navigate to="/staff/dashboard" />;
    return <Navigate to="/hod/dashboard" />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    
                    {/* Protected Routes */}
                    <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                        <Route index element={<HomeRedirect />} />
                        
                        {/* Student Routes */}
                        <Route path="student/dashboard" element={<ProtectedRoute roles={['Student']}><StudentDashboard /></ProtectedRoute>} />
                        <Route path="student/form" element={<ProtectedRoute roles={['Student']}><MentoringFormWizard /></ProtectedRoute>} />
                        <Route path="student/profile" element={<ProtectedRoute roles={['Student']}><ProfilePage /></ProtectedRoute>} />
                        
                        {/* Staff Routes */}
                        <Route path="staff/dashboard" element={<ProtectedRoute roles={['Staff']}><StaffDashboard /></ProtectedRoute>} />
                        <Route path="staff/profile" element={<ProtectedRoute roles={['Staff']}><ProfilePage /></ProtectedRoute>} />
                        <Route path="staff/students" element={<ProtectedRoute roles={['Staff']}><MyStudents /></ProtectedRoute>} />
                        <Route path="staff/review/:studentId" element={<ProtectedRoute roles={['Staff']}><StudentFormReview /></ProtectedRoute>} />
                        
                        {/* HOD and Assistant HOD Routes */}
                        <Route path="hod/dashboard" element={<ProtectedRoute roles={['HOD', 'Assistant HOD']}><HODDashboard /></ProtectedRoute>} />
                        <Route path="hod/profile" element={<ProtectedRoute roles={['HOD', 'Assistant HOD']}><ProfilePage /></ProtectedRoute>} />
                        <Route path="hod/mentors" element={<ProtectedRoute roles={['HOD', 'Assistant HOD']}><MentorList /></ProtectedRoute>} />
                        <Route path="hod/mentor/:mentorId/mentees" element={<ProtectedRoute roles={['HOD', 'Assistant HOD']}><MentorMentees /></ProtectedRoute>} />
                        <Route path="hod/students" element={<ProtectedRoute roles={['HOD', 'Assistant HOD']}><MyStudents /></ProtectedRoute>} />
                        <Route path="hod/departments" element={<ProtectedRoute roles={['HOD', 'Assistant HOD']}><DepartmentList /></ProtectedRoute>} />
                        <Route path="hod/assignment" element={<ProtectedRoute roles={['HOD', 'Assistant HOD']}><MentorAssignment /></ProtectedRoute>} />
                        <Route path="hod/review/:studentId" element={<ProtectedRoute roles={['HOD', 'Assistant HOD']}><StudentFormReview /></ProtectedRoute>} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
