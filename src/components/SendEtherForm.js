// SendEtherForm.js
import React, { useState } from 'react';
import '../SendEtherForm.css'; 

const SendEtherForm = ({ onSendEther }) => {
  const [senderAddress, setSenderAddress] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [sendAmount, setSendAmount] = useState(0);

  const handleSendEther = () => {
    onSendEther(senderAddress, recipientAddress, sendAmount);
  };

  return (
    <div className="send-ether-form">
      <h2>Send Ether</h2>
      <div className="form-group">
        <label>Sender Address:</label>
        <input type="text" onChange={(e) => setSenderAddress(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Recipient Address:</label>
        <input type="text" onChange={(e) => setRecipientAddress(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Amount to Send (ETH):</label>
        <input type="number" onChange={(e) => setSendAmount(e.target.value)} />
      </div>
      <button className="send-button" onClick={handleSendEther}>Send Ether</button>
    </div>
  );
};

export default SendEtherForm;
