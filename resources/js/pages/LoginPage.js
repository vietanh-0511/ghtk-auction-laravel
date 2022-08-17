import React, { useState, useEffect } from "react";
import { classNames } from "primereact/utils";
import { Password } from "primereact/password";
import { InputText } from "primereact/inputtext";

import { useAuth } from "../hooks/useAuth";
import { Button } from "primereact/button";

const LoginPage = ({ title }) => {
  const [submitted, setSubmitted] = useState(false);
  const [credential, setCredential] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuth();

  const handleLogin = (e) => {
    setSubmitted(true);
    if (validateAll()) {
      return login(credential);
    }
  };

  const validate = (value, type) => {
    var check = false;
    switch (type) {
      case "email":
        check = value
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
        break;
      case "password":
        check = value.match(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        );
        break;
    }
    return !check;
  };

  const validateAll = () => {
    return (
      credential.email &&
      !validate(credential.email, "email") &&
      credential.password &&
      !validate(credential.password, "password")
    );
  };

  useEffect(() => {
    const listener = (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        handleLogin();
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

          {/*  */}
          {/* email */}
          <div className="field">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              value={credential.email}
              onChange={(e) =>
                setCredential({ ...credential, email: e.target.value })
              }
              autoFocus
              required
              className={classNames({
                "p-invalid":
                  submitted &&
                  (!credential.email || validate(credential.email, "email")),
              })}
            />
            {submitted &&
              (!credential.email || validate(credential.email, "email")) && (
                <small className="p-error">
                  Email {!credential.email ? " không được để trống" : "sai"}.
                </small>
              )}
          </div>

          {/* pass */}
          <div className="field">
            <label htmlFor="password">Mật khẩu</label>
            <Password
              id="password"
              value={credential.password}
              onChange={(e) =>
                setCredential({ ...credential, password: e.target.value })
              }
              required
              className={classNames({
                "p-invalid":
                  submitted &&
                  (!credential.password ||
                    validate(credential.password, "password")),
              })}
            />
            {submitted &&
              (!credential.password ||
                validate(credential.password, "password")) && (
                <small className="p-error">
                  Mật khẩu{" "}
                  {!credential.password ? " không được để trống" : "sai"}.
                </small>
              )}
          </div>
          {/*  */}

          {/* <div className="field">
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
            <label htmlFor="password">Mật khẩu</label>
            <InputText
              id="password"
              type="password"
              value={credential.password}
              onChange={(e) =>
                setCredential({ ...credential, password: e.target.value })
              }
            />
          </div> */}
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
