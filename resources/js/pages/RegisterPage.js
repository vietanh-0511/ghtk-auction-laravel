import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useAuth } from "../hooks/useAuth";

const RegisterPage = ({ title }) => {
  const [credential, setCredential] = useState({
    full_name: "",
    email: "",
    password: "", // create
    password_confirmation: "", // create
    address: "",
    phone: "",
  });

  const { register } = useAuth();

  useEffect(() => {
    const listener = (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        console.log("Enter key was pressed. Run your function.");
        event.preventDefault();
        register(credential);
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [credential]);

  const handleRegister = () => {
    register(credential);
  };

  return (
    <div className="grid justify-content-center">
      <div className="col-6">
        <div className="card p-fluid">
          <h5>{title}</h5>
          <div className="field">
            <label htmlFor="full_name">Họ tên</label>
            <InputText
              type="text"
              autoFocus
              value={credential.full_name}
              onChange={(e) =>
                setCredential({ ...credential, full_name: e.target.value })
              }
            />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <InputText
              id="email"
              type="email"
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
          </div>
          <div className="field">
            <label htmlFor="password_confirmation">Nhập Lại Mật khẩu</label>
            <InputText
              id="password_confirmation"
              type="password"
              value={credential.password_confirmation}
              onChange={(e) =>
                setCredential({
                  ...credential,
                  password_confirmation: e.target.value,
                })
              }
            />
          </div>
          <div className="field">
            <label htmlFor="address">Địa chỉ</label>
            <InputText
              id="address"
              type="text"
              value={credential.address}
              onChange={(e) =>
                setCredential({ ...credential, address: e.target.value })
              }
            />
          </div>
          <div className="field">
            <label htmlFor="phone">Số điện thoại</label>
            <InputText
              id="phone"
              type="phone"
              value={credential.phone}
              onChange={(e) =>
                setCredential({ ...credential, phone: e.target.value })
              }
            />
          </div>
          <div className="field">
            <Button
              label="Đăng kí"
              onClick={(e) => {
                handleRegister();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
