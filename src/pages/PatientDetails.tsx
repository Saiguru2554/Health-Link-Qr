import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { FileText, User } from "lucide-react";
import { verifyPatientQRData } from "@/utils/tokenGenerator";
import { initialUsers } from "@/data/initialUsers";

// Sample medical reports data (you can move this to a separate file)
const mockMedicalReports = [
  {
    id: "MR-2023-1234",
    date: "2023-06-15",
    doctorName: "Dr. Sarah Wilson",
    diagnosis: "Common Cold",
    treatment: "Prescribed cold medicine and rest",
    followUp: "None required",
    notes: "Patient should recover within a week with proper rest."
  },
  {
    id: "MR-2023-4567",
    date: "2023-09-22",
    doctorName: "Dr. Michael Brown",
    diagnosis: "Sprained Ankle",
    treatment: "Ice pack application, compression bandage, and pain medication",
    followUp: "1 week",
    notes: "Avoid strenuous activities and keep the foot elevated."
  }
];

const PatientDetails = () => {
  const { patientId } = useParams();
  const [searchParams] = useSearchParams();
  const [patient, setPatient] = useState<any>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const code = searchParams.get("code");
    
    if (!code) {
      setError("Invalid QR code");
      return;
    }

    const { isValid, patientId: decodedPatientId } = verifyPatientQRData(code);

    if (!isValid || decodedPatientId !== patientId) {
      setError("Invalid or expired QR code");
      return;
    }

    // Find patient in initial users
    const foundPatient = initialUsers.find(u => u.username === patientId);
    
    if (!foundPatient) {
      setError("Patient not found");
      return;
    }

    setPatient(foundPatient);
  }, [patientId, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-healthcare-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Patient Info Card */}
        <Card className="bg-white">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={patient.photo} />
                <AvatarFallback className="bg-healthcare-primary text-white">
                  <User size={32} />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{patient.name}</CardTitle>
                <CardDescription>Patient ID: {patient.username}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{patient.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 text-healthcare-primary" />
              Medical History
            </CardTitle>
            <CardDescription>
              Recent medical reports and diagnoses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mockMedicalReports.map((report, index) => (
                <div key={report.id}>
                  <Card className="border border-gray-200">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Report ID: {report.id}</h3>
                        <span className="text-sm text-gray-500">{report.date}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Doctor</p>
                            <p>{report.doctorName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Diagnosis</p>
                            <p>{report.diagnosis}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Treatment</p>
                            <p>{report.treatment}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Follow-up</p>
                            <p>{report.followUp}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Notes</p>
                          <p>{report.notes}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  {index < mockMedicalReports.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientDetails; 