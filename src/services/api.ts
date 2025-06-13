// Remove axios and localStorage logic, use Firebase instead
import { auth, db, storage } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';

// Register user with role
export const register = async (userData: any) => {
  const { email, password, role, username, ...rest } = userData;
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  await updateProfile(user, { displayName: username });
  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    email,
    username,
    role,
    ...rest,
    createdAt: new Date().toISOString(),
  });
  return user;
};

// Login
export const login = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logout = async () => {
  await signOut(auth);
};

// Get user profile
export const getUserProfile = async (uid: string) => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  return userDoc.exists() ? userDoc.data() : null;
};

// Update user profile
export const updateUserProfile = async (uid: string, profileData: any) => {
  await updateDoc(doc(db, 'users', uid), profileData);
};

// Upload medical file
export const uploadMedicalFile = async (uid: string, file: File, meta: any) => {
  const fileRef = ref(storage, `medical_reports/${uid}/${Date.now()}_${file.name}`);
  await uploadBytes(fileRef, file);
  const url = await getDownloadURL(fileRef);
  // Save file metadata in Firestore
  const report = {
    url,
    name: file.name,
    size: file.size,
    type: file.type,
    uploadDate: new Date().toISOString(),
    ...meta,
  };
  const userDoc = doc(db, 'users', uid);
  const userSnap = await getDoc(userDoc);
  let reports = [];
  if (userSnap.exists()) {
    reports = userSnap.data().medicalReports || [];
  }
  reports.push(report);
  await updateDoc(userDoc, { medicalReports: reports });
  return report;
};

// Get all medical files for a user
export const getMedicalFiles = async (uid: string) => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  return userDoc.exists() ? userDoc.data().medicalReports || [] : [];
};

// Doctor: search patient by username or ID
export const searchPatient = async (searchValue: string) => {
  const q = query(collection(db, 'users'), where('role', '==', 'patient'), where('username', '==', searchValue));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
};

// Generate patient summary for dashboard
export const generatePatientSummary = async (uid: string) => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (!userDoc.exists()) return { summary: 'No recent medical reports.' };
  const reports = userDoc.data().medicalReports || [];
  if (reports.length === 0) return { summary: 'No recent medical reports.' };
  const lastReport = reports[reports.length - 1];
  return { summary: `Last diagnosis: ${lastReport.diagnosis || 'N/A'}. Treatment: ${lastReport.treatment || 'N/A'}` };
};

// Remove all localStorage usage and demo fallback
export const getPatientFiles = undefined;
