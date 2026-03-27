// Shared memory for prototype mode (when MongoDB is not connected)
module.exports = {
    users: [
        // password for all is 'password123'
        { _id: '101', name: 'Rahul Sharma', email: 'rahul@test.com', password: '$2a$10$XmI8uE6/t6GzP7kZt0C3u.tT1rGv8yWzJ9Qp8u0o8R7zP5/S3u.tT', role: 'Student', department: 'CS' },
        { _id: 'm1', name: 'Dr. Ramesh', email: 'ramesh@test.com', password: '$2a$10$XmI8uE6/t6GzP7kZt0C3u.tT1rGv8yWzJ9Qp8u0o8R7zP5/S3u.tT', role: 'Staff', department: 'CS' },
        { _id: 'h1', name: 'Admin HOD', email: 'hod@test.com', password: '$2a$10$XmI8uE6/t6GzP7kZt0C3u.tT1rGv8yWzJ9Qp8u0o8R7zP5/S3u.tT', role: 'HOD', department: 'CS' }
    ],
    students: [
        { _id: 's1', userId: '101', studentId: '2023CS01', name: 'Rahul Sharma', department: 'CS', year: '3rd Year', isFormSubmitted: true, mentorId: 'm1' },
        { _id: 's2', userId: '102', studentId: '2023CS02', name: 'Priya Verma', department: 'CS', year: '3rd Year', isFormSubmitted: false },
        { _id: 's3', userId: '103', studentId: '2023CS03', name: 'Ankit Gupta', department: 'CS', year: '2nd Year', isFormSubmitted: false },
    ],
    mentoringForms: [],
    academicRecords: [],
    activities: []
};
