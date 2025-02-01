import { useState, useEffect } from "react";
import Navbar from "./NavBar";
import Footer from "./Footer";

function Settings() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [networkName, setNetworkName] = useState(null);
  const [blockTimestamp, setBlockTimestamp] = useState(null);

  // Helper function to get network name from chainId
  const getNetworkName = (chainId) => {
    const networks = {
      "0x1": "Ethereum Mainnet",
      "0x3": "Ropsten Testnet",
      "0x4": "Rinkeby Testnet",
      "0x5": "Goerli Testnet",
      "0x2a": "Kovan Testnet",
      // Add more networks here if needed
    };

    return networks[chainId] || "Unknown Network";
  };

  useEffect(() => {
    const connectMetaMask = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          if (accounts && accounts.length > 0) {
            const account = accounts[0];
            setAccount(account); // Set account address

            // Get chainId (network)
            const chainId = await window.ethereum.request({ method: "eth_chainId" });
            setChainId(chainId); // Set chain ID
            setNetworkName(getNetworkName(chainId)); // Set network name based on chainId

            // Get account balance
            const balanceWei = await window.ethereum.request({
              method: "eth_getBalance",
              params: [account, "latest"],
            });
            const balance = parseFloat(balanceWei) / 10 ** 18; // Convert Wei to Ether
            setBalance(balance); // Set account balance

            // Get timestamp of the latest block
            const block = await window.ethereum.request({
              method: "eth_getBlockByNumber",
              params: ["latest", false],
            });
            setBlockTimestamp(new Date(block.timestamp * 1000).toLocaleString()); // Convert to readable format
          } else {
            console.warn("MetaMask: No accounts found.");
          }
        } catch (error) {
          console.error("MetaMask Error:", error);
        }
      } else {
        console.warn("MetaMask not installed.");
      }
    };

    connectMetaMask();
  }, []);

  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logged out");
    // You might want to redirect to a login page or clear some state
  };

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    },
    main: {
      flexGrow: 1,
      backgroundColor: "#fff",
      padding: "24px",
    },
    content: {
      maxWidth: "600px",
      margin: "0 auto",
    },
    heading: {
      fontSize: "2rem",
      fontWeight: "bold",
      textAlign: "center",
      color: "black",
      marginBottom: "32px",
    },
    card: {
      backgroundColor: "#f3f4f6",
      padding: "24px",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    subheading: {
      fontSize: "1.25rem",
      fontWeight: "600",
      marginBottom: "16px",
    },
    accountText: {
      marginBottom: "16px",
    },
    accountAddress: {
      fontFamily: "monospace",
    },
    button: {
      width: "100%",
      backgroundColor: "#dc2626",
      color: "#fff",
      padding: "8px 16px",
      borderRadius: "4px",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
    contactCard: {
      marginTop: "32px",
      backgroundColor: "#f3f4f6",
      padding: "24px",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    link: {
      color: "#15803d",
      textDecoration: "none",
    },
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <main style={styles.main}>
        <div style={styles.content}>
          <h1 style={styles.heading}>Account Settings</h1>
          <div style={styles.card}>
            <h2 style={styles.subheading}>MetaMask Account</h2>
            {account ? (
              <>
                <p style={styles.accountText}>
                  Connected: <span style={styles.accountAddress}>{account}</span>
                </p>
                <p style={styles.accountText}>Balance: {balance} ETH</p>
                <p style={styles.accountText}>Chain ID: {chainId}</p>
                <p style={styles.accountText}>Network: {networkName}</p>
                <p style={styles.accountText}>Last Block Timestamp: {blockTimestamp}</p>
              </>
            ) : (
              <p style={styles.accountText}>Not connected to MetaMask</p>
            )}
            <button onClick={handleLogout} style={styles.button}>
              Logout
            </button>
          </div>
          <div style={styles.contactCard}>
            <h2 style={styles.subheading}>Contact Us</h2>
            <p style={styles.accountText}>Join our community for more support:</p>
            <p style={styles.accountText}>
              Discord:{" "}
              <a href="#" style={styles.link}>
                Join our Discord
              </a>
            </p>
            <p style={styles.accountText}>
              Telegram:{" "}
              <a href="#" style={styles.link}>
                Join our Telegram
              </a>
            </p>
            <p>Email: admin@hadnt.com</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Settings;
