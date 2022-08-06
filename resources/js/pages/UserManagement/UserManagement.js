import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import "../../../css/DataTableComponent.css";
import { createUser, deleteUser, getUser, updateUser } from "../../apiClient";

const UserManagement = ({ title = "Empty Page" }) => {
  let emptyUser = {
    full_name: "",
    email: "",
    password: "", // create
    password_confirmation: "", // create
    address: "",
    phone: "",
  };

  const [dataUsers, setDataUsers] = useState([]);
  const [userDialog, setUserDialog] = useState(false);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [user, setUser] = useState(emptyUser);
  const [selectedUsers, setSelectedUsers] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  let idUser = user.id;

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
        check = user.password === user.password_confirmation;
        break;
      case "phone":
        check = user.phone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/);
        break;
    }
    return !check;
  };

  const validateAll = () => {
    return user.id
      ? user.full_name &&
          user.email &&
          user.address &&
          user.phone &&
          !(validate(user.email, "email") && validate(user.phone, "phone"))
      : user.full_name &&
          user.email &&
          user.password &&
          user.password_confirmation &&
          user.address &&
          user.phone &&
          !(
            validate(user.email, "email") &&
            validate(user.password, "password") &&
            validate(user.password_confirmation, "confirmation") &&
            validate(user.phone, "phone")
          );
  };

  useEffect(() => {
    getUser().then((res) => {
      setDataUsers(res.data.data);
    });
  }, []);

  const openNew = () => {
    setSubmitted(false);
    setUserDialog(true);
  };

  const hideDialog = () => {
    setUser(emptyUser);
    setSubmitted(false);
    setUserDialog(false);
  };

  const hideDeleteUserDialog = () => {
    setDeleteUserDialog(false);
  };

  const editUser = (user) => {
    setUser({ ...user });
    setUserDialog(true);
  };

  const confirmDeleteuser = (user) => {
    setUser(user);
    setDeleteUserDialog(true);
  };

  const getData = () => {
    getUser().then((res) => setDataUsers(res.data.data));
  };

  const deleteuser = () => {
    deleteUser(idUser).then(() => {
      setDeleteUserDialog(false);
      setUser(emptyUser);
      getData();
    });

    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "user Deleted",
      life: 3000,
    });
  };

  const saveUser = () => {
    setSubmitted(true);
    if (validateAll()) {
      if (user.id) {
        updateUser(user.id, user).then(() => {
          getData();
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "User Updated",
            life: 3000,
          });
          hideDialog();
        });
      } else {
        createUser(user).then(() => {
          getData();
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "User Created",
            life: 3000,
          });
          hideDialog();
        });
      }
    }
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _user = { ...user };
    _user[`${name}`] = val;
    setUser(_user);
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label="New"
          icon="pi pi-plus"
          className="p-button-success mr-2"
          onClick={openNew}
        />
      </React.Fragment>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editUser(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteuser(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className="table-header">
      <h5 className="mx-0 my-1">Manage users</h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </span>
    </div>
  );

  const userDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveUser}
      />
    </React.Fragment>
  );

  const deleteUserDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteUserDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteuser}
      />
    </React.Fragment>
  );

  return (
    <div className="grid">
      <div className="col-12">
        <div className="datatable-crud-demo">
          <Toast ref={toast} />
          <div className="card">
            <h5>{title}</h5>
            <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
            <DataTable
              ref={dt}
              value={dataUsers}
              selection={selectedUsers}
              onSelectionChange={(e) => setSelectedUsers(e.value)}
              dataKey="id"
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
              globalFilter={globalFilter}
              header={header}
              responsiveLayout="scroll"
            >
              <Column field="id" header="ID" sortable></Column>
              <Column field="full_name" header="Full Name" sortable></Column>
              <Column field="email" header="Email" sortable></Column>
              <Column field="address" header="Address" sortable></Column>
              <Column field="phone" header="Phone" sortable></Column>
              <Column
                body={actionBodyTemplate}
                exportable={false}
                style={{ minWidth: "8rem" }}
              ></Column>
            </DataTable>
          </div>

          <Dialog
            visible={userDialog}
            style={{ width: "450px" }}
            header={user.id ? "Update User" : "Create User"}
            modal
            className="p-fluid"
            footer={userDialogFooter}
            onHide={hideDialog}
          >
            {/* name */}
            <div className="field">
              <label htmlFor="full_name">Full Name</label>
              <InputText
                id="full_name"
                value={user.full_name}
                onChange={(e) => onInputChange(e, "full_name")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !user.full_name,
                })}
              />
              {submitted && !user.full_name && (
                <small className="p-error">Full name is required.</small>
              )}
            </div>

            {/* email */}
            {!user.id && (
              <div className="field">
                <label htmlFor="email">Email</label>
                <InputText
                  id="email"
                  value={user.email}
                  onChange={(e) => onInputChange(e, "email")}
                  required
                  className={classNames({
                    "p-invalid":
                      submitted &&
                      (!user.email || validate(user.email, "email")),
                  })}
                />
                {submitted &&
                  (!user.email || validate(user.email, "email")) && (
                    <small className="p-error">
                      Email is {!user.email ? "required" : "wrong"}.
                    </small>
                  )}
              </div>
            )}

            {/* pass */}
            {!user.id && (
              <div className="field">
                <label htmlFor="password">Password</label>
                <InputText
                  id="password"
                  value={user.password}
                  onChange={(e) => onInputChange(e, "password")}
                  required
                  className={classNames({
                    "p-invalid":
                      submitted &&
                      (!user.password || validate(user.password, "password")),
                  })}
                />
                {submitted &&
                  (!user.password || validate(user.password, "password")) && (
                    <small className="p-error">
                      Password is {!user.password ? "required" : "wrong"}.
                    </small>
                  )}
              </div>
            )}

            {/* conf */}
            {!user.id && (
              <div className="field">
                <label htmlFor="password_confirmation">
                  Password confirmation
                </label>
                <InputText
                  id="password_confirmation"
                  value={user.password_confirmation}
                  onChange={(e) => onInputChange(e, "password_confirmation")}
                  required
                  className={classNames({
                    "p-invalid":
                      submitted &&
                      (!user.password_confirmation ||
                        validate(user.password_confirmation, "confirmation")),
                  })}
                />
                {submitted &&
                  (!user.password_confirmation ||
                    validate(user.password_confirmation, "confirmation")) && (
                    <small className="p-error">
                      Password confirmation is{" "}
                      {!user.password_confirmation ? "required" : "wrong"}.
                    </small>
                  )}
              </div>
            )}

            {/* address */}
            <div className="field">
              <label htmlFor="address">Address</label>
              <InputText
                id="address"
                value={user.address}
                onChange={(e) => onInputChange(e, "address")}
                required
                className={classNames({
                  "p-invalid": submitted && !user.address,
                })}
              />
              {submitted && !user.address && (
                <small className="p-error">Address is required.</small>
              )}
            </div>

            {/* phone */}
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <InputText
                id="phone"
                value={user.phone}
                onChange={(e) => onInputChange(e, "phone")}
                required
                className={classNames({
                  "p-invalid":
                    submitted && (!user.phone || validate(user.phone, "phone")),
                })}
              />
              {submitted && (!user.phone || validate(user.phone, "phone")) && (
                <small className="p-error">
                  Phone is {!user.phone ? "required" : "wrong"}.
                </small>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteUserDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteUserDialogFooter}
            onHide={hideDeleteUserDialog}
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {user && (
                <span>
                  Are you sure you want to{" "}
                  <b style={{ color: "red" }}>delete</b> <b>{user.full_name}</b>
                  ?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
