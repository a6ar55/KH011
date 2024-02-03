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
      await web3.eth.sendTransaction({
        from: accounts[0],
        to: recipientAddress,
        value: web3.utils.toWei(sendAmount.toString(), 'ether'),
      });
      alert(`Successfully sent ${sendAmount} ETH to ${recipientAddress}`);
    } catch (error) {
      console.error('Error sending Ether:', error);
    }
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
      <button onClick={createLoan}>Create Loan</button>

      {/* Display existing loans and repay option */}
      {/* ... */}

      <hr />

      <h2>Send Ether</h2>
      <div>
        <label>Recipient Address:</label>
        <input type="text" onChange={(e) => setRecipientAddress(e.target.value)} />
      </div>
      <div>
        <label>Amount to Send (ETH):</label>
        <input type="number" onChange={(e) => setSendAmount(e.target.value)} />
      </div>
      <button onClick={sendEther}>Send Ether</button>
    </div>
  );
}

export default App;
