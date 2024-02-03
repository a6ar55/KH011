// CreateLoanForm.js
import React, { useState } from 'react';
import '../CreateLoanForm.css'; // Import the CSS file for styling

const CreateLoanForm = ({ onCreateLoan, web3, contract }) => {
  const [loanAmount, setLoanAmount] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [repaymentPeriod, setRepaymentPeriod] = useState(0);

  const handleCreateLoan = async () => {
    try {
      const amountWei = web3.utils.toWei(loanAmount.toString(), 'ether');
      const interestRateWei = web3.utils.toWei(interestRate.toString(), 'ether');
      const repaymentPeriodSeconds = repaymentPeriod * 24 * 60 * 60;

      // Use estimateGas to dynamically get gas limit
      const gasLimit = await contract.methods
        .createLoan(amountWei, interestRateWei, repaymentPeriodSeconds)
        .estimateGas();

      await onCreateLoan(amountWei, interestRateWei, repaymentPeriodSeconds, gasLimit);
    } catch (error) {
      console.error('Error creating loan:', error.message, error);
    }
  };

  return (
    <div className="create-loan-form">
      <h2>Create Loan</h2>
      <div className="form-group">
        <label>Loan Amount (ETH):</label>
        <input type="number" onChange={(e) => setLoanAmount(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Interest Rate:</label>
        <input type="number" onChange={(e) => setInterestRate(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Repayment Period (in days):</label>
        <input type="number" onChange={(e) => setRepaymentPeriod(e.target.value)} />
      </div>
      <button className="create-loan-button" onClick={handleCreateLoan}>Create Loan</button>
    </div>
  );
};

export default CreateLoanForm;
