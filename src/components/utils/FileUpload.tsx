import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileText, Upload, X, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileUploadProps {
  onFileUpload: (file: File) => Promise<void>;
  acceptedFileTypes?: Record<string, string[]>;
  maxFileSize?: number;
  label?: string;
  description?: string;
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  acceptedFileTypes = {
    'application/pdf': ['.pdf'],
    'image/*': ['.png', '.jpg', '.jpeg'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  },
  maxFileSize = 5 * 1024 * 1024, // 5MB
  label = 'Upload Medical Document',
  description = 'Drag and drop your medical document here or click to browse',
  className = '',
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    
    // Check file size
    if (file.size > maxFileSize) {
      setErrorMessage(`File is too large. Maximum size is ${maxFileSize / (1024 * 1024)}MB.`);
      setUploadStatus('error');
      return;
    }
    
    setSelectedFile(file);
    setUploadStatus('uploading');
    setUploadProgress(0);
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);
    
    try {
      await onFileUpload(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus('success');
    } catch (error) {
      clearInterval(progressInterval);
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to upload file');
    }
  }, [maxFileSize, onFileUpload]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxFiles: 1,
  });

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setUploadStatus('idle');
    setErrorMessage('');
  };

  return (
    <div className={`w-full ${className}`}>
      <AnimatePresence mode="wait">
        {uploadStatus === 'idle' && (
          <div
            className={`border-2 border-dashed rounded-lg p-6 transition-all ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
            } ${isDragReject ? 'border-red-500 bg-red-50' : ''}`}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center space-y-3 text-center">
              <Upload className="h-10 w-10 text-gray-400" />
              <h3 className="text-lg font-medium">{label}</h3>
              <p className="text-sm text-gray-500">{description}</p>
              <p className="text-xs text-gray-400">
                Supported formats: PDF, PNG, JPG, DOC, DOCX (Max {maxFileSize / (1024 * 1024)}MB)
              </p>
              <Button type="button" className="mt-2">
                Select File
              </Button>
            </div>
          </div>
        )}

        {uploadStatus === 'uploading' && selectedFile && (
          <div
            className="border rounded-lg p-4"
          >
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <Button
                type="button"
                className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                onClick={resetUpload}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-3">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">Uploading... {uploadProgress}%</p>
            </div>
          </div>
        )}

        {uploadStatus === 'success' && selectedFile && (
          <div
            className="border border-green-200 bg-green-50 rounded-lg p-4"
          >
            <div className="flex items-center space-x-3">
              <Check className="h-8 w-8 text-green-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB - Upload complete
                </p>
              </div>
              <Button
                type="button"
                className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                onClick={resetUpload}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div
            className="border border-red-200 bg-red-50 rounded-lg p-4"
          >
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Upload failed</p>
                <p className="text-xs text-red-500">{errorMessage}</p>
              </div>
              <Button
                type="button"
                className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                onClick={resetUpload}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUpload;
