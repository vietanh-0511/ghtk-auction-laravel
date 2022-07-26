import React from 'react';

const LoginPage = ({ title }) => {

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <h5>{ title }</h5>
          <p>Use this page to start from scratch and place your custom content.</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
