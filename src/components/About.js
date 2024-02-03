import React from 'react';
import '../About.css'; // Import the CSS file for styling

const About = () => {
  return (
    <div className="about-container">
      <h2>About Eazy Tr4n5er</h2>
      <p>Eazy Tr4n5er is a decentralized peer-to-peer (P2P) lending and borrowing application built on blockchain technology. It facilitates direct lending between users without the need for traditional financial intermediaries.</p>

      <div className="feature-section">
        <h3>Key Features:</h3>
        <ul>
          <li><strong>Decentralization:</strong> Eazy Tr4n5er operates on a decentralized network, ensuring transparency and security through blockchain technology.</li>
          <li><strong>P2P Transactions:</strong> Users can directly lend or borrow funds from each other without involving banks or other financial institutions.</li>
          <li><strong>Smart Contracts:</strong> The application uses smart contracts to automate loan agreements, ensuring trustless and tamper-proof execution of terms.</li>
          <li><strong>Cryptocurrency Support:</strong> Eazy Tr4n5er supports transactions in cryptocurrency, allowing users to borrow and lend in digital assets.</li>
        </ul>
      </div>

      <div className="how-it-works-section">
        <h3>How It Works:</h3>
        <p>
          Borrowers create loan requests specifying the loan amount, interest rate, and repayment period. Lenders can then fund these loans directly using the Eazy Tr4n5er platform. Smart contracts handle the loan agreements, automatically executing the terms upon fulfillment.
        </p>
      </div>

      <div className="security-section">
        <h3>Security and Trust:</h3>
        <p>
          Eazy Tr4n5er leverages blockchain technology to enhance security and trust in P2P transactions. Every transaction is recorded on the blockchain, providing an immutable and transparent ledger of all lending and borrowing activities.
        </p>
      </div>

      <div className="get-started-section">
        <h3>Get Started:</h3>
        <p>
          To get started, simply log in, create a loan request or fund an existing one, and experience the seamless P2P lending and borrowing process on Eazy Tr4n5er.
        </p>
      </div>
    </div>
  );
};

export default About;
