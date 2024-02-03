// Login.js
import React from 'react';

const Login = ({ onLogin, onLogout, userLoggedIn }) => {
  return (
    <div>
      {userLoggedIn ? (
        <button onClick={onLogout}>Logout</button>
      ) : (
        <button onClick={onLogin}>Login</button>
      )}
    </div>
  );
};

export default Login;
