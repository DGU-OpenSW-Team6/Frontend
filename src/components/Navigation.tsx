import React from 'react';
import './Navigation.css';

interface NavigationProps {
  userInitial?: string;
  showProfile?: boolean;
  onProfileClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ userInitial, showProfile = false, onProfileClick }) => {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="logo-container">
          <span className="logo-sketch">Sketch</span>
          <span className="logo-check">Check</span>
        </div>
        
        {showProfile && (
          <button className="profile-button" onClick={onProfileClick}>
            <span className="profile-initial">{userInitial || 'A'}</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

