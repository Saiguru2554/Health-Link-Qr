interface PatientData {
  patientId: string;
  type: string;
  timestamp?: number;
  signature?: string;
  version?: string;
}

export const generatePatientQRData = (patientId: string): string => {
  try {
    const timestamp = Date.now();
    
    // Create a simple signature (in a real app, this would be more secure)
    const signatureBase = `${patientId}:${timestamp}:patient_profile`;
    const signature = btoa(signatureBase).slice(0, 16);
    
    const data: PatientData = {
      patientId,
      type: 'patient_profile',
      timestamp,
      signature,
      version: '1.0'
    };
    
    // Use encodeURIComponent to handle special characters
    return encodeURIComponent(btoa(JSON.stringify(data)));
  } catch (error) {
    console.error('Error generating QR data:', error);
    throw new Error('Failed to generate QR code data');
  }
};

export const verifyPatientQRData = (data: string): { isValid: boolean; patientId?: string; expired?: boolean } => {
  try {
    // Decode the URL-encoded base64 string
    const decodedData = JSON.parse(atob(decodeURIComponent(data)));
    console.log('Decoded QR data:', decodedData);

    // Check if the data has the required structure
    if (!decodedData.patientId || !decodedData.type || decodedData.type !== 'patient_profile') {
      console.log('Invalid QR data structure');
      return { isValid: false };
    }

    // Verify signature (in a real app, this would be a proper verification)
    if (decodedData.signature) {
      const signatureBase = `${decodedData.patientId}:${decodedData.timestamp}:patient_profile`;
      const expectedSignature = btoa(signatureBase).slice(0, 16);
      
      if (decodedData.signature !== expectedSignature) {
        console.log('Invalid signature');
        return { isValid: false };
      }
    }

    // Check if the QR code has expired (optional)
    // In a real app, you might want QR codes to expire after a certain time for security
    const now = Date.now();
    const MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    
    if (decodedData.timestamp && now - decodedData.timestamp > MAX_AGE) {
      console.log('QR code has expired');
      return { isValid: true, patientId: decodedData.patientId, expired: true };
    }

    return {
      isValid: true,
      patientId: decodedData.patientId,
      expired: false
    };
  } catch (error) {
    console.error('Error verifying QR data:', error);
    return { isValid: false };
  }
}; 