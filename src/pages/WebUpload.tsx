import React from 'react';
import Navigation from '../components/Navigation';
import UploadCard from '../components/UploadCard';
import './WebUpload.css';

interface WebUploadProps {
  onUpload: (file: File) => void;
  userInitial?: string;
  onProfileClick?: () => void;
}

const WebUpload: React.FC<WebUploadProps> = ({ onUpload, userInitial, onProfileClick }) => {
  return (
    <div className="web-upload">
      <Navigation showProfile={true} userInitial={userInitial} onProfileClick={onProfileClick} />
      <div className="upload-content">
        <UploadCard onUpload={onUpload} />
      </div>
    </div>
  );
};

export default WebUpload;

