interface User {
  username: string;
  password: string;
  name: string;
  role: 'patient' | 'doctor' | 'report_entry';
  email: string;
  specialty?: string;
  photo?: string;
  gender?: string;
  patient_id?: string;
  card_number?: string;
}

export const initialUsers: User[] = [
  // Doctors
  {
    username: "dr.smith",
    password: "DrSmith123",
    name: "Dr. John Smith",
    role: "doctor",
    email: "dr.smith@healthqrlink.com",
    specialty: "cardiology",
    photo: "https://randomuser.me/api/portraits/men/1.jpg"
  },
  {
    username: "dr.wilson",
    password: "DrWilson123",
    name: "Dr. Sarah Wilson",
    role: "doctor",
    email: "dr.wilson@healthqrlink.com",
    specialty: "pediatrics",
    photo: "https://randomuser.me/api/portraits/women/2.jpg"
  },
  {
    username: "dr.patel",
    password: "DrPatel123",
    name: "Dr. Raj Patel",
    role: "doctor",
    email: "dr.patel@healthqrlink.com",
    specialty: "neurology",
    photo: "https://randomuser.me/api/portraits/men/3.jpg"
  },
  {
    username: "dr.chen",
    password: "DrChen123",
    name: "Dr. Lisa Chen",
    role: "doctor",
    email: "dr.chen@healthqrlink.com",
    specialty: "dermatology",
    photo: "https://randomuser.me/api/portraits/women/4.jpg"
  },
  {
    username: "dr.brown",
    password: "DrBrown123",
    name: "Dr. Michael Brown",
    role: "doctor",
    email: "dr.brown@healthqrlink.com",
    specialty: "orthopedics",
    photo: "https://randomuser.me/api/portraits/men/5.jpg"
  },
  {
    username: "dr.garcia",
    password: "DrGarcia123",
    name: "Dr. Maria Garcia",
    role: "doctor",
    email: "dr.garcia@healthqrlink.com",
    specialty: "psychiatry",
    photo: "https://randomuser.me/api/portraits/women/6.jpg"
  },

  // Staff Members
  {
    username: "staff.johnson",
    password: "Staff123",
    name: "Emma Johnson",
    role: "report_entry",
    email: "e.johnson@healthqrlink.com",
    photo: "https://randomuser.me/api/portraits/women/7.jpg"
  },
  {
    username: "staff.williams",
    password: "Staff123",
    name: "James Williams",
    role: "report_entry",
    email: "j.williams@healthqrlink.com",
    photo: "https://randomuser.me/api/portraits/men/8.jpg"
  },
  {
    username: "staff.davis",
    password: "Staff123",
    name: "Sophie Davis",
    role: "report_entry",
    email: "s.davis@healthqrlink.com",
    photo: "https://randomuser.me/api/portraits/women/9.jpg"
  },
  {
    username: "staff.miller",
    password: "Staff123",
    name: "Robert Miller",
    role: "report_entry",
    email: "r.miller@healthqrlink.com",
    photo: "https://randomuser.me/api/portraits/men/10.jpg"
  },

  // Patients
  {
    username: "patient.anderson",
    password: "Patient123",
    name: "Sarah Anderson",
    role: "patient",
    email: "s.anderson@healthqrlink.com",
    photo: "https://randomuser.me/api/portraits/women/11.jpg"
  },
  {
    username: "patient.taylor",
    password: "Patient123",
    name: "David Taylor",
    role: "patient",
    email: "d.taylor@healthqrlink.com",
    photo: "https://randomuser.me/api/portraits/men/12.jpg"
  },
  {
    username: "patient.thomas",
    password: "Patient123",
    name: "Emily Thomas",
    role: "patient",
    email: "e.thomas@healthqrlink.com",
    photo: "https://randomuser.me/api/portraits/women/13.jpg"
  },
  {
    username: "patient.roberts",
    password: "Patient123",
    name: "Michael Roberts",
    role: "patient",
    email: "m.roberts@healthqrlink.com",
    photo: "https://randomuser.me/api/portraits/men/14.jpg"
  },
  {
    username: "patient.clark",
    password: "Patient123",
    name: "Jessica Clark",
    role: "patient",
    email: "j.clark@healthqrlink.com",
    photo: "https://randomuser.me/api/portraits/women/15.jpg"
  },
  {
    username: "patient.walker",
    password: "Patient123",
    name: "Christopher Walker",
    role: "patient",
    email: "c.walker@healthqrlink.com",
    photo: "https://randomuser.me/api/portraits/men/16.jpg"
  },
  {
    username: "patient.hall",
    password: "Patient123",
    name: "Amanda Hall",
    role: "patient",
    email: "a.hall@healthqrlink.com",
    photo: "https://randomuser.me/api/portraits/women/17.jpg"
  },
  {
    username: "patient.young",
    password: "Patient123",
    name: "Daniel Young",
    role: "patient",
    email: "d.young@healthqrlink.com",
    photo: "https://randomuser.me/api/portraits/men/18.jpg"
  },
  {
    username: "patient.lee",
    password: "Patient123",
    name: "Jennifer Lee",
    role: "patient",
    email: "j.lee@healthqrlink.com",
    photo: "https://randomuser.me/api/portraits/women/19.jpg"
  },
  {
    username: "patient.king",
    password: "Patient123",
    name: "William King",
    role: "patient",
    email: "w.king@healthqrlink.com",
    photo: "https://randomuser.me/api/portraits/men/20.jpg"
  }
]; 