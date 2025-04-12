'use client';

import React from 'react';
import { useSession } from 'next-auth/react';

interface Media {
  _id: string;
  url: string;
  type: 'image' | 'document';
  filename: string;
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
  const { data: session } = useSession();
  // @ts-ignore - using useState directly from React object due to import errors
  const [isUploading, setIsUploading] = React.useState(false);
  // @ts-ignore - using useState directly from React object due to import errors
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: any) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const maxSizeInMB = 10;
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
      const formData = new FormData();
      formData.append('file', file);
      formData.append('eventId', eventId);
      
      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }
      
      const newMedia = await response.json();
      
      if (onMediaAdded) {
        onMediaAdded(newMedia);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during upload');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (mediaId: string) => {
    if (!window.confirm('Are you sure you want to remove this file?')) return;
    
    try {
      const response = await fetch(`/api/media?id=${mediaId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Deletion failed');
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
                  {item.filename}
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