'use client';

import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Media, createMedia } from '@/utils/localStorage';

interface MediaUploadProps {
  eventId: string;
  onMediaAdded: (media: Media) => void;
}

export default function MediaUpload({ eventId, onMediaAdded }: MediaUploadProps) {
  // @ts-ignore - using useState directly from React object due to import errors
  const [isUploading, setIsUploading] = React.useState(false);
  
  const handleFileChange = async (e: any) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    try {
      // Create array from FileList
      const fileArray = Array.from(files);
      
      // Process each file
      for (const file of fileArray) {
        // In a real app, we'd upload to a cloud service
        // For now, we'll create a data URL and store it in localStorage
        const reader = new FileReader();
        
        // Use a Promise to handle the FileReader async operation
        const dataUrl = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file as Blob);
        });
        
        // Determine media type
        const type = (file as any).type.startsWith('image/') ? 'image' : 'document';
        
        // Create media object
        const media: Omit<Media, '_id' | 'createdAt'> = {
          name: (file as any).name,
          url: dataUrl,
          type,
          eventId
        };
        
        // Store in localStorage
        const newMedia = createMedia(media);
        
        // Notify parent component
        onMediaAdded(newMedia);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload files. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset the input
      e.target.value = '';
    }
  };
  
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Add Media
      </label>
      
      <div className="flex items-center">
        <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
          <input
            type="file"
            className="sr-only"
            onChange={handleFileChange}
            accept="image/*,application/pdf"
            multiple
            disabled={isUploading}
          />
          {isUploading ? 'Uploading...' : 'Upload Files'}
        </label>
        
        {isUploading && (
          <span className="ml-3 text-sm text-gray-500">Processing files...</span>
        )}
      </div>
      
      <p className="mt-1 text-xs text-gray-500">
        Upload images or documents to attach to this event.
      </p>
    </div>
  );
} 