// App.js
import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import LoanContract from './contracts/LoanContract.json';
import Login from './components/Login';
import CreateLoanForm from './components/CreateLoanForm';
import SendEtherForm from './components/SendEtherForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import About from './components/About';

function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [showCreateLoanForm, setShowCreateLoanForm] = useState(false);
  const [showSendEtherForm, setShowSendEtherForm] = useState(true);
  const [showAbout, setShowAbout] = useState(false);

  const handleToggleCreateLoanForm = () => {
    setShowCreateLoanForm(!showCreateLoanForm);
    setShowSendEtherForm(false);
    setShowAbout(false);
  };

  const handleToggleSendEtherForm = () => {
    setShowSendEtherForm(!showSendEtherForm);
    setShowCreateLoanForm(false);
    setShowAbout(false);
  };

  const handleToggleAbout = () => {
    setShowAbout(!showAbout);
    setShowCreateLoanForm(false);
    setShowSendEtherForm(false);
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

// ... (existing code)

return (
  <div className="App">

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
            <a className="nav-link" href="#">
              Home
            </a>
          </li>
          <li className="nav-item">
            <button className="btn btn-link nav-link" onClick={handleToggleAbout}>
              About
            </button>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              FAQ
            </a>
          </li>
        </ul>

        {/* Add the Login component to the right */}
        <Login onLogin={handleLogin} onLogout={handleLogout} userLoggedIn={userLoggedIn} />
      </div>
    </nav>

    {showAbout && <About />}
    {userLoggedIn && (
      <>
        <button className="btn btn-primary m-2" onClick={handleToggleCreateLoanForm}>
          Create Loan
        </button>
        <button className="btn btn-secondary m-2" onClick={handleToggleSendEtherForm}>
          Send Ether
        </button>
        {showCreateLoanForm && <CreateLoanForm onCreateLoan={createLoan} web3={web3} contract={contract} />}
        {showSendEtherForm && <SendEtherForm onSendEther={sendEther} />}
      </>
    )}
  </div>
);
}

export default App;