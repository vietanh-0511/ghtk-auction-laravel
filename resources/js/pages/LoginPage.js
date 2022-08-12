import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const LoginPage = ({ title }) => {
  const [credential, setCredential] = useState({
    email: "",
    password: ""
  });

  const { login } = useAuth();

  const handleLogin = (e) => {
    login(credential);
  };

  useEffect(() => {
    const listener = (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        login(credential);
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [credential]);

  return (
    <div className="grid justify-content-center">
      <div className="col-6">
        <div className="card p-fluid">
          <h5>{title}</h5>
          <div className="field">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              type="email"
              autoFocus
              value={credential.email}
              onChange={(e) =>
                setCredential({ ...credential, email: e.target.value })
              }
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <InputText
              id="password"
              type="password"
              value={credential.password}
              onChange={(e) =>
                setCredential({ ...credential, password: e.target.value })
              }
            />
          </div>
          <div className="field">
            <Button
              onKeyPress={(e) => e.key === "Enter" && handleLogin}
              label="Đăng nhập"
              onClick={() => {
                handleLogin();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
