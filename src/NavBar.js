import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [account, setAccount] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts',
          });
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0]);
          } else {
            console.warn('No accounts found');
            navigate('/metamask');
          }
        } catch (error) {
          console.error('Error fetching wallet address:', error);
          navigate('/metamask');
        }
      } else {
        console.warn('MetaMask not installed');
        navigate('/metamask');
      }
    };

    connectWallet();

    const handleAccountChange = (accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        setAccount(null);
      }
    };

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountChange);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountChange);
      }
    };
  }, [navigate]);

  const handleSignOut = () => {
    setAccount(null);
    navigate('/login');
  };

  return (
    <>
      <div className="outer-container">
        <div className="side-elements left">
          <Link to="/">
            <img
              src="https://i.ibb.co/7JXpV9PZ/L-removebg-preview.png"
              alt="Logo"
              className="nav-logo"
            />
          </Link>
        </div>
        
        <nav className="navbar-container">
          <div className="nav-background">
            <div className="nav-content">
              <div className="nav-links">
                <Link to="/home" className="nav-link">Home</Link>
                <Link to="/properties" className="nav-link">My Properties</Link>
                <Link to="/settings" className="nav-link">Settings</Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="side-elements right">
          <div className="wallet-address">
            {account ? (
              <span>{`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}</span>
            ) : (
              'Connect Wallet'
            )}
          </div>
          {account && (
            <button className="logout-button" onClick={handleSignOut}>
              Log Out
            </button>
          )}
        </div>
      </div>
      <div className="nav-spacer"></div>
    </>
  );
};

export default Navbar;