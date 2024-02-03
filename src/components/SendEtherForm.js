// SendEtherForm.js
import React, { useState } from 'react';

const SendEtherForm = ({ onSendEther }) => {
  const [senderAddress, setSenderAddress] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [sendAmount, setSendAmount] = useState(0);

  const handleSendEther = () => {
    onSendEther(senderAddress, recipientAddress, sendAmount);
  };

  return (
    <div className="box">
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
      <button onClick={handleSendEther}>Send Ether</button>
    </div>
  );
};

export default SendEtherForm;
