// components/FAQ.js
import React from 'react';
import '../FAQ.css';

const FAQ = () => {
  return (
    <div className="faq-container">
      <h2>Frequently Asked Questions</h2>

      <div className="faq-item">
        <h3>1. How does Eazy Tr4n5fer ensure secure transactions?</h3>
        <p>
          Eazy Tr4n5fer utilizes blockchain technology to provide a secure and transparent environment for peer-to-peer transactions. All transactions are recorded on the blockchain, ensuring immutability and reducing the risk of fraud.
        </p>
      </div>

      <div className="faq-item">
        <h3>2. What is the advantage of P2P transactions in Eazy Tr4n5fer?</h3>
        <p>
          P2P transactions in Eazy Tr4n5fer eliminate the need for intermediaries, such as banks, reducing transaction costs and increasing efficiency. Users can directly lend or borrow funds from each other, promoting financial inclusion.
        </p>
      </div>

      {/* Add more FAQs as needed */}
    </div>
  );
};

export default FAQ;
