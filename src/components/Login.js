// Login.js
import React from 'react';

const Login = ({ onLogin, onLogout, userLoggedIn }) => {
  return (
    <div className="top-right">
      {userLoggedIn ? (
        <button className="logout" onClick={onLogout}>Logout</button>
      ) : (
        <button className="login" onClick={onLogin}>Login</button>
      )}
    </div>
  );
};

export default Login;
