import React, { useState, useEffect } from "react";
import { classNames } from "primereact/utils";
import { Password } from "primereact/password";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useAuth } from "../hooks/useAuth";

const RegisterPage = ({ title }) => {
  const [submitted, setSubmitted] = useState(false);
  const [credential, setCredential] = useState({
    full_name: "",
    email: "",
    password: "", // create
    password_confirmation: "", // create
    address: "",
    phone: "",
  });

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
      case "confirmation":
        check = credential.password === credential.password_confirmation;
        break;
      case "phone":
        check = credential.phone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/);
        break;
      case "full_name":
        check = credential.full_name.match(/^.{6,}$/);
        break;
    }
    return !check;
  };

  const validateAll = () => {
    return credential.id
      ? credential.full_name &&
          credential.email &&
          credential.address &&
          credential.phone &&
          !(
            validate(credential.email, "email") &&
            validate(credential.phone, "phone") &&
            validate(credential.full_name, "full_name")
          )
      : credential.full_name &&
          credential.email &&
          credential.password &&
          credential.password_confirmation &&
          credential.address &&
          credential.phone &&
          !(
            validate(credential.email, "email") &&
            validate(credential.password, "password") &&
            validate(credential.password_confirmation, "confirmation") &&
            validate(credential.full_name, "full_name") &&
            validate(credential.phone, "phone")
          );
  };

  const { register } = useAuth();

  useEffect(() => {
    const listener = (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
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
    setSubmitted(true);
    if (validateAll()) {
      return register(credential);
    }
  };

  return (
    <div className="grid justify-content-center">
      <div className="col-6">
        <div className="card p-fluid">
          <h5>{title}</h5>

          {/*  */}
          {/* name */}
          <div className="field">
            <label htmlFor="full_name">Họ tên</label>
            <InputText
              id="full_name"
              value={credential.full_name}
              onChange={(e) =>
                setCredential({ ...credential, full_name: e.target.value })
              }
              required
              autoFocus
              minLength="6"
              className={classNames({
                "p-invalid":
                  submitted &&
                  (!credential.full_name ||
                    validate(credential.full_name, "full_name")),
              })}
            />
            {submitted &&
              (!credential.full_name ||
                validate(credential.full_name, "full_name")) && (
                <small className="p-error">
                  Full name{" "}
                  {!credential.full_name
                    ? " không được để trống"
                    : "phải trên 6 ký tự"}
                  .
                </small>
              )}
          </div>

          {/* email */}
          {!credential.id && (
            <div className="field">
              <label htmlFor="email">Email</label>
              <InputText
                id="email"
                value={credential.email}
                onChange={(e) =>
                  setCredential({ ...credential, email: e.target.value })
                }
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
          )}

          {/* pass */}
          {!credential.id && (
            <div className="field">
              <label htmlFor="password">Mật khẩu</label>
              <Password
                toggleMask
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
          )}

          {/* conf */}
          {!credential.id && (
            <div className="field">
              <label htmlFor="password_confirmation">Xác nhận mật khẩu</label>
              <Password
                toggleMask
                id="password_confirmation"
                value={credential.password_confirmation}
                onChange={(e) =>
                  setCredential({
                    ...credential,
                    password_confirmation: e.target.value,
                  })
                }
                required
                className={classNames({
                  "p-invalid":
                    submitted &&
                    (!credential.password_confirmation ||
                      validate(
                        credential.password_confirmation,
                        "confirmation"
                      )),
                })}
              />
              {submitted &&
                (!credential.password_confirmation ||
                  validate(
                    credential.password_confirmation,
                    "confirmation"
                  )) && (
                  <small className="p-error">
                    Xác nhận mật khẩu{" "}
                    {!credential.password_confirmation
                      ? " không được để trống"
                      : "sai"}
                    .
                  </small>
                )}
            </div>
          )}

          {/* address */}
          <div className="field">
            <label htmlFor="address">Địa chỉ</label>
            <InputText
              id="address"
              value={credential.address}
              onChange={(e) =>
                setCredential({
                  ...credential,
                  address: e.target.value,
                })
              }
              required
              className={classNames({
                "p-invalid": submitted && !credential.address,
              })}
            />
            {submitted && !credential.address && (
              <small className="p-error">Địa chỉ không được để trống.</small>
            )}
          </div>

          {/* phone */}
          <div className="field">
            <label htmlFor="phone">Số điện thoại</label>
            <InputText
              id="phone"
              value={credential.phone}
              onChange={(e) =>
                setCredential({ ...credential, phone: e.target.value })
              }
              required
              className={classNames({
                "p-invalid":
                  submitted &&
                  (!credential.phone || validate(credential.phone, "phone")),
              })}
            />
            {submitted &&
              (!credential.phone || validate(credential.phone, "phone")) && (
                <small className="p-error">
                  Số điện thoại{" "}
                  {!credential.phone ? " không được để trống." : "sai"}.
                </small>
              )}
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
