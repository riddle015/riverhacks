
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface MediaUploaderProps {
  onMediaCapture: (files: File[]) => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ onMediaCapture }) => {
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      if (mediaFiles.length + files.length > 3) {
        toast.error('Maximum of 3 files allowed');
        return;
      }
      
      const newFiles = [...mediaFiles, ...files];
      setMediaFiles(newFiles);
      
      // Generate previews
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);
      
      onMediaCapture(newFiles);
      
      // Clear the input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const removeMedia = (index: number) => {
    const newFiles = [...mediaFiles];
    const newPreviews = [...previews];
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previews[index]);
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setMediaFiles(newFiles);
    setPreviews(newPreviews);
    onMediaCapture(newFiles);
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button 
          type="button"
          variant="outline" 
          className="flex gap-2"
          onClick={triggerFileInput}
          disabled={mediaFiles.length >= 3}
        >
          <Camera className="h-5 w-5" />
          <span>Take Photo</span>
        </Button>
        
        <Button 
          type="button"
          variant="outline" 
          className="flex gap-2"
          onClick={triggerFileInput}
          disabled={mediaFiles.length >= 3}
        >
          <Upload className="h-5 w-5" />
          <span>Upload</span>
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="hidden"
          capture="environment"
          multiple
        />
      </div>
      
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              <img 
                src={preview} 
                alt={`Upload ${index + 1}`} 
                className="h-24 w-24 object-cover rounded-md border"
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md"
                onClick={() => removeMedia(index)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {mediaFiles.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
          <p className="text-gray-500">
            Upload photos or videos to document the issue
          </p>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
