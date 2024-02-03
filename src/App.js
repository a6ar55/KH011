// App.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import LoanContract from './contracts/LoanContract.json';
import Login from './components/Login';
import CreateLoanForm from './components/CreateLoanForm';
import SendEtherForm from './components/SendEtherForm';

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [totalLoans, setTotalLoans] = useState(0);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [showCreateLoanForm, setShowCreateLoanForm] = useState(false); // Added state
  const [showSendEtherForm, setShowSendEtherForm] = useState(true); // Added state
  const handleToggleCreateLoanForm = () => {
    setShowCreateLoanForm(!showCreateLoanForm);
    setShowSendEtherForm(false); // Hide SendEtherForm when showing CreateLoanForm
  };

  const handleToggleSendEtherForm = () => {
    setShowSendEtherForm(!showSendEtherForm);
    setShowCreateLoanForm(false); // Hide CreateLoanForm when showing SendEtherForm
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
      const interestRateWei = web3.utils.toWei(interestRate.toString(), 'ether');
      const repaymentPeriodWei = web3.utils.toWei(repaymentPeriod.toString(), 'ether');
  
      await contract.methods.createLoan(amountWei, interestRateWei, repaymentPeriodWei).send({ from: accounts[0] });
    } catch (error) {
      console.error('Error creating loan:', error);
    }
  };
  
  

  const sendEther = async (senderAddress, recipientAddress, amount) => {
    try {
      if (!senderAddress || !recipientAddress || !amount) {
        alert('Please fill in all the required fields.');
        return;
      }

      const gasPriceGwei = 15; // Set your desired gas price in Gwei
      const gasPriceWei = web3.utils.toWei(gasPriceGwei.toString(), 'gwei'); // Convert Gwei to Wei

      const gasLimit = 21000; // A typical gas limit for simple transactions

      // Dynamically get the selected account from MetaMask
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
          {showCreateLoanForm && <CreateLoanForm onCreateLoan={createLoan} />}
          {showSendEtherForm && <SendEtherForm onSendEther={sendEther} />}
        </>
      )}
    </div>
  );
}

export default App;