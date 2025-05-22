interface PatientData {
  patientId: string;
  type: string;
}

export const generatePatientQRData = (patientId: string): string => {
  try {
    const data: PatientData = {
      patientId,
      type: 'patient_profile'
    };
    // Use encodeURIComponent to handle special characters
    return encodeURIComponent(btoa(JSON.stringify(data)));
  } catch (error) {
    console.error('Error generating QR data:', error);
    throw new Error('Failed to generate QR code data');
  }
};

export const verifyPatientQRData = (data: string): { isValid: boolean; patientId?: string } => {
  try {
    // Decode the URL-encoded base64 string
    const decodedData = JSON.parse(atob(decodeURIComponent(data)));
    console.log('Decoded QR data:', decodedData);

    // Check if the data has the required structure
    if (!decodedData.patientId || !decodedData.type || decodedData.type !== 'patient_profile') {
      console.log('Invalid QR data structure');
      return { isValid: false };
    }

    return {
      isValid: true,
      patientId: decodedData.patientId
    };
  } catch (error) {
    console.error('Error verifying QR data:', error);
    return { isValid: false };
  }
}; 