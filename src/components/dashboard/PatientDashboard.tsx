import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import QRCodeGenerator from "../utils/QRCodeGenerator";
import PDFGenerator from "../utils/PDFGenerator";
import FileUpload from "../utils/FileUpload";
import { FileText, User, Calendar, Clock, AlertCircle, Download, Upload, Eye, ChevronRight, FileIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import EditProfileDialog from "./EditProfileDialog";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { uploadMedicalFile, getMedicalFiles, getUserProfile, generatePatientSummary } from '@/services/api';
import { auth } from '@/services/firebase';

const PatientDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [qrUrl, setQrUrl] = useState<string>("");
  const [medicalFiles, setMedicalFiles] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [healthSummary, setHealthSummary] = useState<string>("");
  const { toast } = useToast();
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await getUserProfile(firebaseUser.uid);
        setUser(profile);
        setQrUrl(window.location.origin + '/patient/' + firebaseUser.uid);
        const files = await getMedicalFiles(firebaseUser.uid);
        setMedicalFiles(files);
        const { summary } = await generatePatientSummary(firebaseUser.uid);
        setHealthSummary(summary);
      } else {
        setUser(null);
        setMedicalFiles([]);
        setHealthSummary('');
      }
    });
    return () => unsubscribe();
  }, []);
  const handleFileUpload = async (file: File) => {
    if (!user) return;
    setIsUploading(true);
    try {
      await uploadMedicalFile(user.uid, file, {
        uploadedBy: user.uid,
        uploadedByName: user.name,
        uploadedByRole: user.role,
        category: 'medical_report',
        description: 'Uploaded via patient dashboard',
      });
      const files = await getMedicalFiles(user.uid);
      setMedicalFiles(files);
      toast({
        title: 'File uploaded successfully',
        description: `${file.name} has been added to your medical records.`,
        variant: 'default',
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload file',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  if (!user) return null;

  // Inline VirtualCard definition (fixed JSX)
  const VirtualCard = () => (
    <div className="relative w-full h-72 bg-gradient-to-br from-[#1a2e4c] to-[#2d4f83] rounded-xl p-6 overflow-hidden shadow-xl">
      {/* Medical cross pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full flex items-center justify-center">
          <div className="relative w-40 h-40">
            <div className="absolute inset-0 bg-white rounded-md transform rotate-45"></div>
            <div className="absolute inset-0 bg-white rounded-md transform -rotate-45"></div>
          </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-20 h-20 text-[#4a90e2] opacity-10">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
      </div>
      <div className="relative z-10 h-full flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-white">Health Link Card</h2>
              <p className="text-blue-200 text-sm mt-1">Patient Profile</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
              <img src="/logo-small.png" alt="Health Link Logo" className="h-8 w-8" />
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-2xl font-bold text-white">{user?.name}</h3>
            <p className="text-blue-200 text-sm">ID: {user?.uid}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-xs text-blue-200">Blood Group</p>
            <p className="text-white font-medium">{user?.bloodGroup}</p>
          </div>
          <div>
            <p className="text-xs text-blue-200">Emergency Contact</p>
            <p className="text-white font-medium">{user?.emergencyContact?.name}</p>
          </div>
          <div>
            <p className="text-xs text-blue-200">Phone</p>
            <p className="text-white font-medium">{user?.phone}</p>
          </div>
          <div>
            <p className="text-xs text-blue-200">Date of Birth</p>
            <p className="text-white font-medium">{user?.dob || "01/15/1985"}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen healthcare-gradient flex flex-col items-center justify-center p-4">
      {/* Content Container */}
      <div className="w-full max-w-7xl mx-auto space-y-6">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Patient Dashboard</h1>
          <EditProfileDialog user={user} />
        </div>

        {/* Patient Name and Details */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">{user.name}</h2>
          <div className="mb-8">
            {/* Show the new VirtualCard at the top */}
            <VirtualCard />
          </div>
          <Card>
            <CardContent className="grid grid-cols-2 gap-4 p-6">
              {/* QR Code Card remains as is for download functionality */}
              <div className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>QR Code</CardTitle>
                    <CardDescription>Your permanent patient profile QR code</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <QRCodeGenerator
                        value={qrUrl}
                        size={240}
                        fgColor="#000000"
                      />
                    </div>
                    <div className="mt-4 space-y-2 w-full max-w-md">
                      <p className="text-sm text-gray-500 text-center">
                        Share this QR code to provide quick access to your medical profile
                      </p>
                      <Button
                        className="w-full mt-2"
                        onClick={() => {
                          // Create a temporary link element
                          const canvas = document.querySelector('canvas');
                          if (canvas) {
                            const link = document.createElement('a');
                            link.download = `health-link-qr-${user?.username}.png`;
                            link.href = canvas.toDataURL('image/png');
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            toast({
                              title: "QR Code Downloaded",
                              description: "Your Health Link QR code has been downloaded.",
                            });
                          }
                        }}
                      >
                        Download QR Code
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="summary" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="upload">Upload</TabsTrigger>
            </TabsList>

            {/* Health Summary Tab */}
            <TabsContent value="summary" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Health Summary
                  </CardTitle>
                  <CardDescription>
                    Overview of your recent medical conditions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-lg font-medium text-primary">{healthSummary || "Generating your health summary..."}</p>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg border p-4 shadow-sm">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="font-medium">Last Checkup</h3>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        {medicalFiles && medicalFiles.length > 0
                          ? format(new Date(medicalFiles[0].date), 'MMMM d, yyyy')
                          : "No recent checkups"}
                      </p>
                    </div>

                    <div className="bg-white rounded-lg border p-4 shadow-sm">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="font-medium">Next Follow-up</h3>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        {medicalFiles && medicalFiles.length > 0 && medicalFiles[0].followUp !== "None required"
                          ? medicalFiles[0].followUp
                          : "No scheduled follow-ups"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="mr-2 h-5 w-5" />
                    Important Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {medicalFiles && medicalFiles.length > 0 ? (
                      <div className="flex items-start space-x-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-amber-800">Follow-up Reminder</p>
                          <p className="text-sm text-amber-700 mt-1">
                            {medicalFiles[0].followUp !== "None required"
                              ? `Remember to schedule your follow-up appointment in ${medicalFiles[0].followUp}.`
                              : "No follow-up required for your recent visit."}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">No important notifications at this time.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Medical Reports Tab */}
            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center">
                      <FileText className="mr-2 h-5 w-5" />
                      Medical Reports
                    </CardTitle>
                    <PDFGenerator
                      contentId="all-medical-reports"
                      filename="complete-medical-history"
                      label="Download All Reports"
                    />
                  </div>
                  <CardDescription>
                    View your medical reports in chronological order
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div id="all-medical-reports" className="space-y-6">
                    {medicalFiles && medicalFiles.length > 0 ? (
                      medicalFiles.map((report: any, index: number) => (
                        <div key={report.id}>
                          <Card>
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <h3 className="font-medium">Report ID: {report.id}</h3>
                                  <Badge className="ml-2">
                                    {new Date(report.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) ? 'New' : 'Report'}
                                  </Badge>
                                </div>
                                <span className="text-sm text-gray-500">
                                  {format(new Date(report.date), 'MMMM d, yyyy')}
                                </span>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-gray-500">Doctor</p>
                                    <p className="text-gray-900">{report.doctorName || (report.uploadedByRole === 'patient' ? user?.name : '')}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Diagnosis</p>
                                    <p className="text-gray-900">{report.diagnosis}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Treatment</p>
                                    <p className="text-gray-900">{report.treatment}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Follow-up</p>
                                    <p className="text-gray-900">{report.followUp}</p>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Notes</p>
                                  <p className="text-gray-900">{report.notes}</p>
                                </div>
                                <div className="text-xs text-gray-500 mt-2">
                                  Uploaded by {report.doctorName ? `Dr. ${report.doctorName}` : (report.uploadedByRole === 'patient' ? 'the patient' : 'Unknown')}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          {index < medicalFiles.length - 1 && (
                            <Separator className="my-4" />
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 mx-auto text-gray-300" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No reports yet</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Your medical reports will appear here once they are added by your healthcare provider.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Medical Files Tab */}
            <TabsContent value="files">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileIcon className="mr-2 h-5 w-5" />
                    Medical Files
                  </CardTitle>
                  <CardDescription>
                    Access your uploaded medical documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {medicalFiles && medicalFiles.length > 0 ? (
                    <div className="space-y-4">
                      {medicalFiles.map((file: any) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-white border rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 rounded-md">
                              <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{file.name}</p>
                              <div className="flex items-center text-sm text-gray-500 space-x-3">
                                <span>{format(new Date(file.uploadDate), 'MMM d, yyyy')}</span>
                                <span>•</span>
                                <span>{(file.size / 1024).toFixed(1)} KB</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button className="h-8 px-2">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button className="h-8 px-2">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileIcon className="h-12 w-12 mx-auto text-gray-300" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900">No files uploaded</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Upload your medical documents to keep them organized and accessible.
                      </p>
                      <Button
                        className="mt-4"
                        onClick={() => setActiveTab("upload")}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Files
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* File Upload Tab */}
            <TabsContent value="upload">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="mr-2 h-5 w-5" />
                    Upload Medical Documents
                  </CardTitle>
                  <CardDescription>
                    Add medical reports, test results, or other health documents to your profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload
                    onFileUpload={handleFileUpload}
                    label="Upload Medical Document"
                    description="Drag and drop your medical document here or click to browse"
                  />

                  <div className="mt-6">
                    <h3 className="text-sm font-medium mb-2">Upload Guidelines:</h3>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                      <li>Accepted file formats: PDF, PNG, JPG, DOC, DOCX</li>
                      <li>Maximum file size: 5MB</li>
                      <li>Make sure documents are clearly legible</li>
                      <li>Include relevant date information in the document</li>
                      <li>Personal information should be visible for proper identification</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
