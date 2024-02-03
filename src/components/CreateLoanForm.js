// CreateLoanForm.js
import React, { useState } from 'react';

const CreateLoanForm = ({ onCreateLoan }) => {
  const [loanAmount, setLoanAmount] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [repaymentPeriod, setRepaymentPeriod] = useState(0);

  const handleCreateLoan = () => {
    onCreateLoan(loanAmount, interestRate, repaymentPeriod);
  };

  return (
    <div className="box">
      <h2>Create Loan</h2>
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
      <button onClick={handleCreateLoan}>Create Loan</button>
    </div>
  );
};

export default CreateLoanForm;
