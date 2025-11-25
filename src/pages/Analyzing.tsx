import React from 'react';
import Navigation from '../components/Navigation';
import AnalyzingCard from '../components/AnalyzingCard';
import './Analyzing.css';

interface AnalyzingProps {
  userInitial?: string;
  onProfileClick?: () => void;
}

const Analyzing: React.FC<AnalyzingProps> = ({ userInitial, onProfileClick }) => {
  return (
    <div className="analyzing-page">
      <Navigation showProfile={true} userInitial={userInitial} onProfileClick={onProfileClick} />
      <div className="analyzing-content">
        <AnalyzingCard />
      </div>
    </div>
  );
};

export default Analyzing;

