'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, File, Image, CheckCircle, AlertCircle, MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Alert } from '../ui/Alert';
import { fileUploadApi, FileUploadResponse, MultipleFileUploadResponse } from '../../lib/api/file-upload';

interface FileUploadProps {
  folder?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  allowedTypes?: string[];
  allowedExtensions?: string[];
  onUploadComplete?: (files: FileUploadResponse | MultipleFileUploadResponse) => void;
  onFileSelect?: (files: File[]) => void;
  className?: string;
  disabled?: boolean;
  showPreview?: boolean;
  existingFiles?: string[];
}

interface UploadingFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  result?: any;
}

export function FileUpload({
  folder = 'general',
  multiple = false,
  maxFiles = 5,
  maxSize,
  allowedTypes,
  allowedExtensions,
  onUploadComplete,
  onFileSelect,
  className = '',
  disabled = false,
  showPreview = true,
  existingFiles = []
}: FileUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    setError(null);
    setSuccess(null);
    
    const fileArray = Array.from(files);
    
    // Validate files
    const validatedFiles: File[] = [];
    for (const file of fileArray) {
      const validation = fileUploadApi.validateFile(file, {
        maxSize,
        allowedTypes,
        allowedExtensions,
      });
      
      if (!validation.valid) {
        setError(validation.error || 'Invalid file');
        return;
      }
      
      validatedFiles.push(file);
    }
    
    // Check max files limit
    if (multiple && validatedFiles.length + uploadingFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }
    
    if (!multiple && validatedFiles.length > 1) {
      setError('Only one file allowed');
      return;
    }
    
    // Add files to uploading state
    const newUploadingFiles: UploadingFile[] = validatedFiles.map(file => ({
      file,
      progress: 0,
      status: 'pending' as const
    }));
    
    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);
    onFileSelect?.(validatedFiles);
    
    // Start uploads
    if (multiple) {
      uploadMultipleFiles(validatedFiles);
    } else {
      uploadSingleFile(validatedFiles[0]);
    }
  }, [folder, multiple, maxFiles, maxSize, allowedTypes, allowedExtensions, onFileSelect, uploadingFiles.length]);

  const uploadSingleFile = async (file: File) => {
    try {
      setUploadingFiles(prev => 
        prev.map(f => 
          f.file === file 
            ? { ...f, status: 'uploading', progress: 50 }
            : f
        )
      );

      const result = await fileUploadApi.uploadSingle(file, folder);
      
      setUploadingFiles(prev => 
        prev.map(f => 
          f.file === file 
            ? { ...f, status: 'completed', progress: 100, result: result.data }
            : f
        )
      );
      
      setSuccess('File uploaded successfully');
      onUploadComplete?.(result);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Upload failed';
      setUploadingFiles(prev => 
        prev.map(f => 
          f.file === file 
            ? { ...f, status: 'error', error: errorMessage }
            : f
        )
      );
      setError(errorMessage);
    }
  };

  const uploadMultipleFiles = async (files: File[]) => {
    try {
      setUploadingFiles(prev => 
        prev.map(f => 
          files.includes(f.file)
            ? { ...f, status: 'uploading', progress: 50 }
            : f
        )
      );

      const result = await fileUploadApi.uploadMultiple(files, folder);
      
      setUploadingFiles(prev => 
        prev.map(f => {
          const uploadedFile = result.data.find(r => r.originalName === f.file.name);
          return files.includes(f.file)
            ? { ...f, status: 'completed', progress: 100, result: uploadedFile }
            : f;
        })
      );
      
      setSuccess(`${files.length} files uploaded successfully`);
      onUploadComplete?.(result);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Upload failed';
      setUploadingFiles(prev => 
        prev.map(f => 
          files.includes(f.file)
            ? { ...f, status: 'error', error: errorMessage }
            : f
        )
      );
      setError(errorMessage);
    }
  };

  const removeFile = (fileToRemove: UploadingFile) => {
    setUploadingFiles(prev => prev.filter(f => f !== fileToRemove));
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [disabled, handleFiles]);

  const openFileExplorer = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const getFileIcon = (file: File) => {
    const mimeType = file.type;
    if (mimeType.startsWith('image/')) {
      return <Image className="w-8 h-8 text-blue-500" />;
    }
    return <File className="w-8 h-8 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    return fileUploadApi.formatFileSize(bytes);
  };

  const getProgressColor = (status: UploadingFile['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'uploading': return 'bg-blue-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {error && (
        <Alert variant="error" className="mb-4">
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" className="mb-4">
          {success}
        </Alert>
      )}

      {/* Drop Zone */}
      <Card
        className={`
          border-2 border-dashed transition-colors cursor-pointer
          ${dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : disabled 
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
              : 'border-gray-300 hover:border-gray-400'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileExplorer}
      >
        <CardContent className="flex flex-col items-center justify-center py-8 px-4">
          <Upload className={`w-12 h-12 mb-4 ${disabled ? 'text-gray-400' : 'text-gray-500'}`} />
          
          <h3 className={`text-lg font-semibold mb-2 ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
            {dragActive ? 'Drop files here' : 'Upload files'}
          </h3>
          
          <p className={`text-sm text-center mb-4 ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>
            {multiple 
              ? `Drop files here or click to browse (max ${maxFiles} files)`
              : 'Drop a file here or click to browse'
            }
          </p>
          
          {(allowedTypes || allowedExtensions) && (
            <p className="text-xs text-gray-400 text-center">
              Allowed: {[...(allowedTypes || []), ...(allowedExtensions || [])].join(', ')}
            </p>
          )}
          
          {maxSize && (
            <p className="text-xs text-gray-400 text-center mt-1">
              Max size: {formatFileSize(maxSize)}
            </p>
          )}
          
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              openFileExplorer();
            }}
          >
            Choose Files
          </Button>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={[...(allowedTypes || []), ...(allowedExtensions || [])].join(',')}
        onChange={(e) => {
          if (e.target.files) {
            handleFiles(e.target.files);
          }
        }}
        className="hidden"
        disabled={disabled}
      />

      {/* File List */}
      {showPreview && uploadingFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="font-medium text-gray-700">Files</h4>
          {uploadingFiles.map((uploadingFile, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              {getFileIcon(uploadingFile.file)}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {uploadingFile.file.name}
                  </p>
                  <div className="flex items-center gap-2">
                    {uploadingFile.status === 'completed' && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    {uploadingFile.status === 'error' && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(uploadingFile)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    {formatFileSize(uploadingFile.file.size)}
                  </p>
                  
                  {uploadingFile.status === 'error' && uploadingFile.error && (
                    <p className="text-xs text-red-500 truncate">
                      {uploadingFile.error}
                    </p>
                  )}
                  
                  {uploadingFile.status === 'completed' && uploadingFile.result && (
                    <p className="text-xs text-green-500">
                      Uploaded
                    </p>
                  )}
                </div>
                
                {/* Progress Bar */}
                {(uploadingFile.status === 'uploading' || uploadingFile.status === 'pending') && (
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                    <div
                      className={`h-1 rounded-full transition-all duration-300 ${getProgressColor(uploadingFile.status)}`}
                      style={{ width: `${uploadingFile.progress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Existing Files */}
      {existingFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="font-medium text-gray-700">Existing Files</h4>
          {existingFiles.map((fileUrl, index) => {
            const fileName = fileUrl.split('/').pop() || `File ${index + 1}`;
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg"
              >
                <File className="w-8 h-8 text-blue-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {fileName}
                  </p>
                  <p className="text-xs text-blue-600">
                    Previously uploaded
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(fileUrl, '_blank')}
                  className="h-6 w-6 p-0"
                >
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
