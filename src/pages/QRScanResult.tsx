import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { FileText, User } from "lucide-react";
import { verifyPatientQRData } from "@/utils/tokenGenerator";

const QRScanResult = () => {
  const { username } = useParams();
  const [searchParams] = useSearchParams();
  const [patient, setPatient] = useState<any>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    try {
      console.log('Username from params:', username);
      const code = searchParams.get("code");
      console.log('Code from URL:', code);
      
      if (!code) {
        setError("Invalid QR code: No code parameter found");
        return;
      }

      if (!username) {
        setError("Invalid URL: No username parameter found");
        return;
      }

      const { isValid, patientId } = verifyPatientQRData(code);
      console.log('QR verification result:', { isValid, patientId });

      if (!isValid) {
        setError("Invalid QR code format");
        return;
      }

      if (patientId !== username) {
        setError("QR code does not match the patient ID");
        return;
      }

      // Get patient data from localStorage
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      console.log('Found registered users:', registeredUsers.length);
      
      const foundPatient = registeredUsers.find((user: any) => user.username === username);
      console.log('Found patient:', foundPatient ? 'yes' : 'no');
      
      if (!foundPatient) {
        setError("Patient not found in the system");
        return;
      }
      // Fetch summary for doctor view
      const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const patient = users.find((u: any) => u.username === username);
      let summary = '';
      if (patient && patient.medicalReports && patient.medicalReports.length > 0) {
        const lastReport = patient.medicalReports[patient.medicalReports.length - 1];
        summary = `Last diagnosis: ${lastReport.diagnosis}. Treatment: ${lastReport.treatment}`;
      } else {
        summary = 'No recent medical reports.';
      }
      setPatient({ ...foundPatient, summary });
    } catch (err) {
      console.error('Error in QR scan result:', err);
      setError("An error occurred while processing the QR code");
    }
  }, [username, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Patient Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={patient.photo} />
                <AvatarFallback className="bg-primary">
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{patient.name}</CardTitle>
                <CardDescription>
                  Patient ID: {patient.username}
                </CardDescription>
                {/* Show summary for doctor */}
                {patient.summary && (
                  <p className="mt-2 text-primary font-semibold">Summary: {patient.summary}</p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{patient.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{patient.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Blood Group</p>
                <p className="font-medium">{patient.bloodGroup}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium">{patient.gender}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{patient.address}</p>
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <h3 className="font-medium mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{patient.emergencyContact?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Relation</p>
                  <p className="font-medium">{patient.emergencyContact?.relation}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{patient.emergencyContact?.phone}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical Reports */}
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              <CardTitle>Medical Reports</CardTitle>
            </div>
            <CardDescription>Recent medical history and reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {patient.medicalReports?.map((report: any, index: number) => (
                <div key={report.id}>
                  <Card>
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
                        {report.notes && (
                          <div>
                            <p className="text-sm text-gray-500">Notes</p>
                            <p>{report.notes}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  {index < patient.medicalReports.length - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))}
              {(!patient.medicalReports || patient.medicalReports.length === 0) && (
                <p className="text-center text-gray-500">No medical reports available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QRScanResult;