import React, { useState } from 'react';
import { useAuth } from "../hooks/useAuth";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const LoginPage = ({ title }) => {

  // @TODO: remove role here
  const [credential, setCredential] = useState({ email: '', password: '', role: 'admin' });

  const { login } = useAuth();

  const handleLogin = () => {
    login(credential)
  }

  return (
    <div className="grid justify-content-center">
      <div className="col-6">
        <div className="card p-fluid">
          <h5>{title}</h5>
          <div className="field">
            <label htmlFor="email">Email</label>
            <InputText id="email" type="email" value={credential.email}
              onChange={(e) => setCredential({ ...credential, email: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <InputText id="password" type="password" value={credential.password}
              onChange={(e) => setCredential({ ...credential, password: e.target.value })} />
          </div>
          <div className="field">
            <Button label="Đăng nhập" onClick={(e) => {
              handleLogin()
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
