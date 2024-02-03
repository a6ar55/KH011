// App.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import LoanContract from './contracts/LoanContract.json';

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [totalLoans, setTotalLoans] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [repaymentPeriod, setRepaymentPeriod] = useState(0);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [sendAmount, setSendAmount] = useState(0);
  const [senderAddress, setSenderAddress] = useState('');
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        // Use MetaMask or other Ethereum provider
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.enable();
        setWeb3(web3Instance);

        // Load smart contract
        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = LoanContract.networks[networkId];
        const contractInstance = new web3Instance.eth.Contract(
          LoanContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        setContract(contractInstance);

        // Load accounts
        const accounts = await web3Instance.eth.getAccounts();
        setAccounts(accounts);

        // Check if the user is already logged in
        const isUserLoggedIn = localStorage.getItem('userLoggedIn');
        if (isUserLoggedIn) {
          setUserLoggedIn(true);
        }
      } catch (error) {
        console.error('Error initializing web3:', error);
      }
    };

    initWeb3();
  }, []);

  const createLoan = async () => {
    try {
      await contract.methods.createLoan(loanAmount, interestRate, repaymentPeriod).send({ from: accounts[0] });
    } catch (error) {
      console.error('Error creating loan:', error);
    }
  };

  const repayLoan = async (loanId) => {
    try {
      await contract.methods.repayLoan(loanId).send({ from: accounts[0], value: loanAmount });
    } catch (error) {
      console.error('Error repaying loan:', error);
    }
  };

  const sendEther = async () => {
    try {
      if (!senderAddress) {
        alert('Please provide a sender address.');
        return;
      }

      const gasPriceGwei = 15; // Set your desired gas price in Gwei
      const gasPriceWei = web3.utils.toWei(gasPriceGwei.toString(), 'gwei'); // Convert Gwei to Wei

      const gasLimit = 21000; // A typical gas limit for simple transactions

      const transactionObject = {
        from: senderAddress,
        to: recipientAddress,
        value: web3.utils.toWei(sendAmount.toString(), 'ether'),
        gas: gasLimit,
        gasPrice: gasPriceWei,
      };

      await web3.eth.sendTransaction(transactionObject);

      alert(`Successfully sent ${sendAmount} ETH to ${recipientAddress} from ${transactionObject.from}`);
    } catch (error) {
      console.error('Error sending Ether:', error);
    }
  };

  const handleLogin = () => {
    // For simplicity, let's consider the user as logged in when clicking "Login"
    localStorage.setItem('userLoggedIn', 'true');
    setUserLoggedIn(true);
  };

  const handleLogout = () => {
    // Clear user data or perform any necessary cleanup
    localStorage.removeItem('userLoggedIn');
    setUserLoggedIn(false);
  };

  return (
    <div className="App">
      <h1>Decentralized Microloan App</h1>
      <p>Total Loans: {totalLoans}</p>
      <div>
        <label>Loan Amount:</label>
        <input type="number" onChange={(e) => setLoanAmount(e.target.value)} />
      </div>
      <div>
        <label>Interest Rate:</label>
        <input type="number" onChange={(e) => setInterestRate(e.target.value)} />
      </div>
      <div>
        <label>Repayment Period (in days):</label>
        <input type="number" onChange={(e) => setRepaymentPeriod(e.target.value)} />
      </div>

      {userLoggedIn ? (
        <>
          <button onClick={createLoan}>Create Loan</button>
          <hr />
          <h2>Send Ether</h2>
          <div>
            <label>Sender Address (optional):</label>
            <input type="text" onChange={(e) => setSenderAddress(e.target.value)} />
          </div>
          <div>
            <label>Recipient Address:</label>
            <input type="text" onChange={(e) => setRecipientAddress(e.target.value)} />
          </div>
          <div>
            <label>Amount to Send (ETH):</label>
            <input type="number" onChange={(e) => setSendAmount(e.target.value)} />
          </div>
          <button onClick={sendEther}>Send Ether</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}

      {/* Display existing loans and repay option */}
      {/* ... */}
    </div>
  );
}

export default App;
