import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import Dledgerbg from './DLedgerbg.jpg';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';

function Dashboard() {
  const [uid, setUid] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        setError("No user UID found. Please login first.");
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Wait 3 seconds before navigating to /properties after UID is set
  useEffect(() => {
    if (uid) {
      const timer = setTimeout(() => {
        navigate('/properties');
      }, 3000);

      return () => clearTimeout(timer); // Cleanup timer if component unmounts
    }
  }, [uid, navigate]);

  const backgroundStyle = {
    backgroundImage: `url(${Dledgerbg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '100vh',
  };

  return (
    <div className="App-header" style={backgroundStyle}>
      <div className="dashboard-container">
        <h1>Welcome to Your Dashboard</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {uid ? (
          <div className="dashboard-info">
            <h2>User Information</h2>
            <p>UID: {uid}</p>
            <p>Redirecting to properties in 3 seconds...</p>
          </div>
        ) : (
          <div className="dashboard-info">
            <p>Loading user information...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
