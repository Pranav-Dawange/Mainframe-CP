import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, File, CheckCircle, AlertCircle, X } from 'lucide-react';
import { documentApi } from '../api/api';

const UploadDocument = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, processing, complete, error
  const [progressStep, setProgressStep] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const steps = [
    'Uploading Document...',
    'Reading Content...',
    'Extracting Information...',
    'Classifying Document...',
    'Saving Record...'
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploadStatus('uploading');
    setProgressStep(0);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // We simulate the progress states while waiting for the API call
      // In a real app, you might use WebSockets or SSE for real progress
      const progressInterval = setInterval(() => {
        setProgressStep((prev) => {
          if (prev < steps.length - 1) return prev + 1;
          clearInterval(progressInterval);
          return prev;
        });
      }, 1000);

      const res = await documentApi.upload(formData);
      
      clearInterval(progressInterval);
      setProgressStep(steps.length - 1);
      setUploadStatus('complete');
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate(`/documents/${res.data.id || ''}`);
      }, 1500);

    } catch (err) {
      setUploadStatus('error');
      setError('An error occurred during processing. Please try again.');
    }
  };

  const resetUpload = () => {
    setFile(null);
    setUploadStatus('idle');
    setProgressStep(0);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold text-primary mb-8">Upload Document</h1>

      <div className="card p-8">
        {uploadStatus === 'idle' && (
          <>
            <div 
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:bg-gray-50 transition-colors cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="w-16 h-16 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-medium text-primary mb-2">Click or drag file to this area to upload</h3>
              <p className="text-sm text-gray-500 mb-4">Support for a single PDF, JPG, PNG or DOCX file.</p>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                onChange={handleFileChange}
              />
              <button className="btn-secondary pointer-events-none">Select File</button>
            </div>

            {file && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <File className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-primary">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); resetUpload(); }} className="p-1 hover:bg-blue-100 rounded text-gray-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button 
                onClick={handleUpload} 
                disabled={!file} 
                className={`btn-primary px-8 ${!file ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Analyze Document
              </button>
            </div>
          </>
        )}

        {(uploadStatus === 'uploading' || uploadStatus === 'processing') && (
          <div className="py-12 px-6">
            <h3 className="text-xl font-bold text-primary text-center mb-8">Processing Document</h3>
            <div className="space-y-6 max-w-md mx-auto">
              {steps.map((step, idx) => {
                const isCompleted = idx < progressStep;
                const isCurrent = idx === progressStep;
                return (
                  <div key={idx} className={`flex items-center gap-4 ${isCompleted || isCurrent ? 'opacity-100' : 'opacity-40'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                      ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 
                        isCurrent ? 'border-accent text-accent animate-pulse' : 'border-gray-300 text-gray-400'}`}
                    >
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> : <span>{idx + 1}</span>}
                    </div>
                    <span className={`font-medium ${isCurrent ? 'text-accent' : 'text-primary'}`}>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {uploadStatus === 'complete' && (
          <div className="py-16 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-2">Processing Complete</h3>
            <p className="text-gray-600 mb-8">Your document has been successfully analyzed and saved.</p>
            <p className="text-sm text-gray-400">Redirecting...</p>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="py-16 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-primary mb-2">Processing Failed</h3>
            <p className="text-gray-600 mb-8">{error}</p>
            <button onClick={resetUpload} className="btn-secondary">Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadDocument;
