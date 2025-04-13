'use client';

import React from 'react';
import { useStateCompat, useRefCompat } from '@/utils/react-compat';
import { createMedia, deleteMedia } from '@/utils/localStorage';

// Type assertion to work around React type conflicts

interface Media {
  _id: string;
  url: string;
  type: string;
  name: string;
  eventId: string;
  createdAt: string;
  filename?: string;
}

interface MediaUploaderProps {
  eventId: string;
  mediaItems?: Media[];
  onMediaAdded?: (media: Media) => void;
  onMediaDeleted?: (mediaId: string) => void;
}

export default function MediaUploader({
  eventId,
  mediaItems = [],
  onMediaAdded,
  onMediaDeleted
}: MediaUploaderProps) {
  // Use compatibility hooks to avoid TypeScript errors
  const [isUploading, setIsUploading] = useStateCompat(false);
  const [error, setError] = useStateCompat<string | null>(null);
  const fileInputRef = useRefCompat<HTMLInputElement>(null);

  const handleFileChange = async (e: any) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const maxSizeInMB = 5; // Reduced size for localStorage
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    
    if (file.size > maxSizeInBytes) {
      setError(`File is too large. Maximum size is ${maxSizeInMB}MB.`);
      return;
    }
    
    // Check if file is an image or document
    const isImage = file.type.startsWith('image/');
    const isDocument = file.type === 'application/pdf' || 
                      file.type.includes('word') || 
                      file.type.includes('text/') ||
                      file.type.includes('application/vnd.openxmlformats-officedocument');
    
    if (!isImage && !isDocument) {
      setError('Only images and documents (PDF, Word, text) are allowed.');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    try {
      // Convert file to base64
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          if (!event.target || typeof event.target.result !== 'string') {
            throw new Error('Failed to read file');
          }
          
          const base64Data = event.target.result;
          
          // Store media in localStorage
          const newMedia = createMedia({
            name: file.name,
            url: base64Data,
            type: isImage ? 'image' : 'document',
            eventId: eventId,
          });
          
          if (onMediaAdded) {
            onMediaAdded(newMedia);
          }
          
          // Reset the file input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          
          setIsUploading(false);
        } catch (err: any) {
          setError(err.message || 'An error occurred during upload');
          setIsUploading(false);
        }
      };
      
      reader.onerror = () => {
        setError('Failed to read the file');
        setIsUploading(false);
      };
      
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message || 'An error occurred during upload');
      console.error('Upload error:', err);
      setIsUploading(false);
    }
  };

  const handleDelete = async (mediaId: string) => {
    if (!window.confirm('Are you sure you want to remove this file?')) return;
    
    try {
      // Delete from localStorage
      const success = deleteMedia(mediaId);
      
      if (!success) {
        throw new Error('Failed to delete media');
      }
      
      if (onMediaDeleted) {
        onMediaDeleted(mediaId);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during deletion');
      console.error('Deletion error:', err);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Attachments</h3>
        <label className="cursor-pointer px-3 py-1 bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 transition">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          <span>{isUploading ? 'Uploading...' : 'Add File'}</span>
        </label>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {mediaItems.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {mediaItems.map((item) => (
            <li key={item._id} className="py-3 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                {item.type === 'image' ? (
                  <div className="h-5 w-5 text-blue-500">🖼️</div>
                ) : (
                  <div className="h-5 w-5 text-red-500">📄</div>
                )}
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {item.name || item.filename}
                </a>
              </div>
              <button 
                onClick={() => handleDelete(item._id)}
                className="text-gray-400 hover:text-red-500 transition"
              >
                <span className="h-5 w-5 inline-block">✕</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">No files attached</p>
      )}
    </div>
  );
} 