import axios from 'axios';

// Create an axios instance for our API
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Simulated backend functions using localStorage
// In a real app, these would make actual API calls

// Authentication
export const login = async (username: string, password: string) => {
  // Simulate API call
  const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  const user = users.find((u: any) => u.username === username && u.password === password);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  // Create a token (in a real app, this would be a JWT)
  const token = btoa(`${username}:${Date.now()}`);
  localStorage.setItem('authToken', token);
  localStorage.setItem('healthcareUser', JSON.stringify(user));
  
  return { user, token };
};

// Add password to registration and ensure role is stored
export const register = async (userData: any) => {
  // Simulate API call
  const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

  // Check if username or email already exists
  if (users.some((u: any) => u.username === userData.username)) {
    throw new Error('Username already exists');
  }

  if (users.some((u: any) => u.email === userData.email)) {
    throw new Error('Email already exists');
  }

  // Add new user
  const newUser = {
    ...userData,
    id: `user_${Date.now()}`,
    medicalReports: [],
    createdAt: new Date().toISOString(),
    password: userData.password, // Store password for login simulation
    role: userData.role,
  };

  users.push(newUser);
  localStorage.setItem('registeredUsers', JSON.stringify(users));

  return newUser;
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('healthcareUser');
};

// Patient data
export const getPatientProfile = async (patientId: string) => {
  // Simulate API call
  const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  const patient = users.find((u: any) => u.username === patientId && u.role === 'patient');
  
  if (!patient) {
    throw new Error('Patient not found');
  }
  
  return patient;
};

export const updatePatientProfile = async (patientId: string, profileData: any) => {
  // Simulate API call
  const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  const updatedUsers = users.map((user: any) => {
    if (user.username === patientId) {
      return { ...user, ...profileData };
    }
    return user;
  });
  
  localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
  
  // Update current user if it's the same
  const currentUser = JSON.parse(localStorage.getItem('healthcareUser') || '{}');
  if (currentUser.username === patientId) {
    localStorage.setItem('healthcareUser', JSON.stringify({ ...currentUser, ...profileData }));
  }
  
  return { ...currentUser, ...profileData };
};

// Medical reports
export const getPatientReports = async (patientId: string) => {
  // Simulate API call
  const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  const patient = users.find((u: any) => u.username === patientId);
  
  if (!patient) {
    throw new Error('Patient not found');
  }
  
  return patient.medicalReports || [];
};

// Add file upload for patient with metadata
export const uploadMedicalFile = async (username: string, file: File, meta: any) => {
  // Simulate file upload by storing metadata in localStorage
  const files = JSON.parse(localStorage.getItem(`files_${username}`) || '[]');
  const newFile = {
    id: `file_${Date.now()}`,
    name: file.name,
    size: file.size,
    type: file.type,
    uploadDate: new Date().toISOString(),
    ...meta,
  };
  files.push(newFile);
  localStorage.setItem(`files_${username}` , JSON.stringify(files));
  return newFile;
};

export const getPatientFiles = async (username: string) => {
  return JSON.parse(localStorage.getItem(`files_${username}`) || '[]');
};

// Add report to patient (doctor privilege)
export const addMedicalReport = async (patientUsername: string, report: any) => {
  const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  const updatedUsers = users.map((user: any) => {
    if (user.username === patientUsername) {
      const newReports = user.medicalReports ? [...user.medicalReports, report] : [report];
      return { ...user, medicalReports: newReports };
    }
    return user;
  });
  localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
};

// Generate a summary for a patient (simulate)
export const generatePatientSummary = async (username: string) => {
  const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  const patient = users.find((u: any) => u.username === username);
  if (!patient || !patient.medicalReports || patient.medicalReports.length === 0) {
    return { summary: 'No recent medical reports.' };
  }
  const lastReport = patient.medicalReports[patient.medicalReports.length - 1];
  return { summary: `Last diagnosis: ${lastReport.diagnosis}. Treatment: ${lastReport.treatment}` };
};

export default api;
