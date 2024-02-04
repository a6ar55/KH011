// server/controllers/authController.js
const mysql = require('mysql');

// Connect to your MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'a6ar55',
  password: 'a6ar55',
  database: 'USER',
});

db.connect();

// Controller function for user authentication
const authenticateUser = (req, res) => {
  const { username, walletAddress } = req.body;

  // Perform a query to check if the username and wallet address match in the database
  const query = `SELECT * FROM USER_AUTH WHERE username = ? AND adress = ?`;

  db.query(query, [username, walletAddress], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // You can include additional user information in the response if needed
    const user = results[0];

    return res.status(200).json({ success: true, user });
  });
};

module.exports = { authenticateUser };

