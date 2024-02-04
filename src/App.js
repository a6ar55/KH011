// App.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import LoanContract from './contracts/LoanContract.json';
import Login from './components/Login';
import CreateLoanForm from './components/CreateLoanForm';
import SendEtherForm from './components/SendEtherForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import About from './components/About';
import Faq from './components/Faq';
import Home from './components/Home';

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [showCreateLoanForm, setShowCreateLoanForm] = useState(false);
  const [showSendEtherForm, setShowSendEtherForm] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showHome, setShowHome] = useState(false);

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
    setShowCreateLoanForm(false);
    setShowSendEtherForm(false);
    setShowAbout(false);
    setShowFAQ(false);
    setShowHome(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    setUserLoggedIn(false);
    setShowCreateLoanForm(false);
    setShowSendEtherForm(false);
  };

  const handleToggleComponent = (component) => {
    setShowCreateLoanForm(false);
    setShowSendEtherForm(false);
    setShowAbout(false);
    setShowFAQ(false);
    setShowHome(false);

    switch (component) {
      case 'about':
        setShowAbout(true);
        break;
      case 'faq':
        setShowFAQ(true);
        break;
      case 'home':
        setShowHome(true);
        break;
      case 'createLoanForm':
        setShowCreateLoanForm(true);
        break;
      case 'sendEtherForm':
        setShowSendEtherForm(true);
        break;
      default:
        break;
    }
  };

  const renderActiveComponent = () => {
    if (showAbout) {
      return <About />;
    } else if (showFAQ) {
      return <Faq />;
    } else if (showHome) {
      // Add your home component here
      return <div><Home/></div>;
    } else if (showCreateLoanForm) {
      return <CreateLoanForm onCreateLoan={createLoan} web3={web3} contract={contract} />;
    } else if (showSendEtherForm) {
      return <SendEtherForm onSendEther={sendEther} />;
    } else {
      return null;
    }
  };

  const createLoan = async (amount, interestRate, repaymentPeriod) => {
    try {
      // Convert values to Wei
      const amountWei = web3.utils.toWei(amount.toString(), 'ether');
      const interestRateWei = web3.utils.toWei(interestRate.toString(), 'wei'); // Assuming interest rate should be in Wei
  
      // period to seconds
      const repaymentPeriodSeconds = repaymentPeriod * 24 * 60 * 60; // for calculating in days
  
      // Estimate gas
      const gasLimit = await contract.methods
        .createLoan(amountWei, interestRateWei, repaymentPeriodSeconds)
        .estimateGas();
  
      const gasPriceGwei = 15; 
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
      {/* Navbar */}
      <nav className="navbar navbar-light bg-light">
        <a className="navbar-brand mx-auto" href="#">
          <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/EasyTransfer_Logo.png" width="300" height="70" className="d-inline-block align-top" alt="" />
        </a>
      </nav>

      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">
          Eazy Tr4n5er
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <button className="btn btn-link nav-link" onClick={() => handleToggleComponent('home')}>
                Home
              </button>
            </li>
            <li className="nav-item active">
              <button className="btn btn-link nav-link" onClick={() => handleToggleComponent('about')}>
                About
              </button>
            </li>
            <li className="nav-item">
              <button className="btn btn-link nav-link" onClick={() => handleToggleComponent('faq')}>
                FAQ
              </button>
            </li>
          </ul>

          <Login onLogin={handleLogin} onLogout={handleLogout} userLoggedIn={userLoggedIn} />
        </div>
      </nav>

      {/* Render active component based on state */}
      {userLoggedIn && (
        <div className="my-3">
          <button className="btn btn-primary mr-2" onClick={() => handleToggleComponent('createLoanForm')}>
            Create Loan
          </button>
          <button className="btn btn-secondary" onClick={() => handleToggleComponent('sendEtherForm')}>
            Send Ether
          </button>
        </div>
      )}

      {renderActiveComponent()}
    </div>
  );
}

export default App;
