// App.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import LoanContract from './contracts/LoanContract.json';
import Login from './components/Login';
import CreateLoanForm from './components/CreateLoanForm';
import SendEtherForm from './components/SendEtherForm';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHk6Qa1Knax3bQVYWT4YsuNtR0y-F1oBI",
  authDomain: "p2pdapp.firebaseapp.com",
  projectId: "p2pdapp",
  storageBucket: "p2pdapp.appspot.com",
  messagingSenderId: "519389986756",
  appId: "1:519389986756:web:e1f368e35dcff7532cee91",
  measurementId: "G-E4PXNPB11B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [showCreateLoanForm, setShowCreateLoanForm] = useState(false);
  const [showSendEtherForm, setShowSendEtherForm] = useState(true);

  const handleToggleCreateLoanForm = () => {
    setShowCreateLoanForm(!showCreateLoanForm);
    setShowSendEtherForm(false);
  };

  const handleToggleSendEtherForm = () => {
    setShowSendEtherForm(!showSendEtherForm);
    setShowCreateLoanForm(false);
  };

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.enable();
        setWeb3(web3Instance);

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = LoanContract.networks[networkId];
        const contractInstance = new web3Instance.eth.Contract(
          LoanContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        setContract(contractInstance);

        const accounts = await web3Instance.eth.getAccounts();
        setAccounts(accounts);

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

  const handleLogin = () => {
    localStorage.setItem('userLoggedIn', 'true');
    setUserLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    setUserLoggedIn(false);
  };

  const createLoan = async (amount, interestRate, repaymentPeriod) => {
    try {
      // Convert values to Wei
      const amountWei = web3.utils.toWei(amount.toString(), 'ether');
      const interestRateWei = web3.utils.toWei(interestRate.toString(), 'wei'); // Assuming interest rate should be in Wei
  
      // Convert repayment period to seconds
      const repaymentPeriodSeconds = repaymentPeriod * 24 * 60 * 60; // Assuming repayment period is in days
  
      // Estimate gas
      const gasLimit = await contract.methods
        .createLoan(amountWei, interestRateWei, repaymentPeriodSeconds)
        .estimateGas();
  
      // Explicitly set gas price
      const gasPriceGwei = 15; // Set your desired gas price in Gwei
      const gasPriceWei = web3.utils.toWei(gasPriceGwei.toString(), 'gwei');
  
      await contract.methods
        .createLoan(amountWei, interestRateWei, repaymentPeriodSeconds)
        .send({ from: accounts[0], gas: gasLimit, gasPrice: gasPriceWei });
    } catch (error) {
      console.error('Error creating loan:', error.message, error);
    }
  };
  
  

  const sendEther = async (senderAddress, recipientAddress, amount) => {
    try {
      if (!senderAddress || !recipientAddress || !amount) {
        alert('Please fill in all the required fields.');
        return;
      }

      const gasPriceGwei = 15;
      const gasPriceWei = web3.utils.toWei(gasPriceGwei.toString(), 'gwei');

      const gasLimit = 21000;

      const selectedAccount = await web3.eth.getCoinbase();

      const transactionObject = {
        from: selectedAccount,
        to: recipientAddress,
        value: web3.utils.toWei(amount.toString(), 'ether'),
        gas: gasLimit,
        gasPrice: gasPriceWei,
      };

      const result = await web3.eth.sendTransaction(transactionObject);

      alert(`Transaction successful! Transaction hash: ${result.transactionHash}`);
    } catch (error) {
      console.error('Error sending Ether:', error);
    }
  };

  return (
    <div className="App">
      <h1>Decentralized Microloan App</h1>
      <Login onLogin={handleLogin} onLogout={handleLogout} userLoggedIn={userLoggedIn} />

      {userLoggedIn && (
        <>
          <button onClick={handleToggleCreateLoanForm}>Create Loan</button>
          <button onClick={handleToggleSendEtherForm}>Send Ether</button>
          {showCreateLoanForm && <CreateLoanForm onCreateLoan={createLoan} web3={web3} contract={contract} />}
          {showSendEtherForm && <SendEtherForm onSendEther={sendEther} />}
        </>
      )}
    </div>
  );
}

export default App;
