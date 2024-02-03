import React from 'react';

const Login = ({ onLogin, onLogout, userLoggedIn }) => {
  return (
    <ul className="navbar-nav ml-auto top-right">
      <li className="nav-item">
        {userLoggedIn ? (
          <button className="btn btn-outline-danger my-2 my-sm-0" onClick={onLogout}>Logout</button>
        ) : (
          <button className="btn btn-outline-success my-2 my-sm-0" onClick={onLogin}>Login</button>
        )}
      </li>
    </ul>
  );
};

export default Login;
