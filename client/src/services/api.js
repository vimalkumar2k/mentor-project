import axios from 'axios';

const API = axios.create({
    baseURL: '/api',
});

// Add token to requests
API.interceptors.request.use((req) => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData && userData.token) {
        req.headers.Authorization = `Bearer ${userData.token}`;
    }
    return req;
});

export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);
export const getProfile = () => API.get('/auth/profile');
export const getAllMentors = () => API.get('/auth/mentors');

export const getStudents = () => API.get('/students');
export const getStudentDashboard = () => API.get('/students/dashboard');
export const getStudentById = (id) => API.get(`/students/${id}`);
export const updateProfile = (formData) => API.post('/students/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const submitForm = () => API.post('/students/submit-form');

export const getFormData = (studentId, semester) => API.get(`/forms/${studentId}/${semester}`);
export const saveFormData = (data) => API.post('/forms/save', data);
export const assignMentor = (data) => API.post('/students/assign', data);
export const getMenteesByMentorId = (mentorId) => API.get(`/students/mentor/${mentorId}`);

export const getAssistantAccess = () => API.get('/config/assistant-access');
export const toggleAssistantAccess = (enabled) => API.post('/config/assistant-access', { enabled });

export default API;
