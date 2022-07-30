import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Form, Field } from "react-final-form";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import "./DataTableDemo.css";
import { createUser, deleteUser, getUser } from "../../apiClient";
import axios from "axios";

const UserManagement = ({ title = "Empty Page" }) => {
  let emptyuser = {
    id: null,
    full_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    address: "",
    phone: "",
  };

const [showMessage, setShowMessage] = useState(false);
const [formData, setFormData] = useState({});

  const [dataUsers, setDataUsers] = useState([]);
  const [userDialog, setUserDialog] = useState(false);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [deleteUsersDialog, setDeleteusersDialog] = useState(false);
  const [user, setUser] = useState(emptyuser);
  const [selectedUsers, setSelectedUsers] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  const validate = (data) => {
    let errors = {};

    if (!data.name) {
      errors.name = "Name is required.";
    }

    if (!data.email) {
      errors.email = "Email is required.";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
      errors.email = "Invalid email address. E.g. example@email.com";
    }

    if (!data.password) {
      errors.password = "Password is required.";
    }

    if (!data.accept) {
      errors.accept = "You need to agree to the terms and conditions.";
    }

    return errors;
  };

  const onSubmit = (data, form) => {
    setFormData(data);
    setShowMessage(true);

    form.restart();
  };

  const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
  const getFormErrorMessage = (meta) => {
    return (
      isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>
    );
  };

  const dialogFooter = (
    <div className="flex justify-content-center">
      <Button
        label="OK"
        className="p-button-text"
        autoFocus
        onClick={() => setShowMessage(false)}
      />
    </div>
  );
  const passwordHeader = <h6>Pick a password</h6>;
  const passwordFooter = (
    <React.Fragment>
      <Divider />
      <p className="mt-2">Suggestions</p>
      <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: "1.5" }}>
        <li>At least one lowercase</li>
        <li>At least one uppercase</li>
        <li>At least one numeric</li>
        <li>Minimum 8 characters</li>
      </ul>
    </React.Fragment>
  );


  useEffect(() => {
    getUser().then((res) => {
      setDataUsers(res.data.data.data);
    });
  }, []);

  const openNew = () => {
    setUser(emptyuser);
    setSubmitted(false);
    setUserDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setUserDialog(false);
  };

  const hideDeleteUserDialog = () => {
    setDeleteUserDialog(false);
  };

  const hideDeleteusersDialog = () => {
    setDeleteusersDialog(false);
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
    getUser().then((res) => setDataUsers(res.data.data.data));
  };

  let idUser = user.id;
  const deleteuser = () => {
    deleteUser(idUser).then(() => {
      setDeleteUserDialog(false);
      setUser(emptyuser);
      getData();
    });

    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "user Deleted",
      life: 3000,
    });
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < dataUsers.length; i++) {
      console.log(user.id);
      if (user[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const createId = () => {
    let id = "";
    let chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

   const saveUser = () => {
     setSubmitted(true);

     if (user.full_name.trim()) {
       let _users = [...dataUsers];
       let user = { ...user };
       if (user.id) {
         const index = findIndexById(user.id);

         _users[index] = user;
         toast.current.show({
           severity: "success",
           summary: "Successful",
           detail: "Product Updated",
           life: 3000,
         });
       } else {
         user.id = createId();
         _users.push(user);
         toast.current.show({
           severity: "success",
           summary: "Successful",
           detail: "Product Created",
           life: 3000,
         });
       }

       setDataUsers(_users);
       setUserDialog(false);
       setUser(emptyProduct);
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
          label="Back"
          icon="pi pi-replay"
          className="p-button-primary"
          style={{
            marginRight: "15px",
          }}
        />
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
              <Column field="password" header="Password" sortable></Column>
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
            header="Product Details"
            modal
            className="p-fluid"
            footer={userDialogFooter}
            onHide={hideDialog}
          >
            <div style={{padding:'1.5rem'}}>
              <Form
                onSubmit={onSubmit}
                initialValues={{
                  name: "",
                  email: "",
                  password: "",
                  date: null,
                  country: null,
                  accept: false,
                }}
                validate={validate}
                render={({ handleSubmit }) => (
                  <form onSubmit={handleSubmit} className="p-fluid">
                    <Field
                      name="name"
                      render={({ input, meta }) => (
                        <div className="field">
                          <span className="p-float-label">
                            <InputText
                              id="name"
                              {...input}
                              autoFocus
                              className={classNames({
                                "p-invalid": isFormFieldValid(meta),
                              })}
                            />
                            <label
                              htmlFor="name"
                              className={classNames({
                                "p-error": isFormFieldValid(meta),
                              })}
                            >
                              Name*
                            </label>
                          </span>
                          {getFormErrorMessage(meta)}
                        </div>
                      )}
                    />
                    <Field
                      name="email"
                      render={({ input, meta }) => (
                        <div className="field">
                          <span className="p-float-label p-input-icon-right">
                            <i className="pi pi-envelope" />
                            <InputText
                              id="email"
                              {...input}
                              className={classNames({
                                "p-invalid": isFormFieldValid(meta),
                              })}
                            />
                            <label
                              htmlFor="email"
                              className={classNames({
                                "p-error": isFormFieldValid(meta),
                              })}
                            >
                              Email*
                            </label>
                          </span>
                          {getFormErrorMessage(meta)}
                        </div>
                      )}
                    />
                    <Field
                      name="password"
                      render={({ input, meta }) => (
                        <div className="field">
                          <span className="p-float-label">
                            <Password
                              id="password"
                              {...input}
                              toggleMask
                              className={classNames({
                                "p-invalid": isFormFieldValid(meta),
                              })}
                              header={passwordHeader}
                              footer={passwordFooter}
                            />
                            <label
                              htmlFor="password"
                              className={classNames({
                                "p-error": isFormFieldValid(meta),
                              })}
                            >
                              Password*
                            </label>
                          </span>
                          {getFormErrorMessage(meta)}
                        </div>
                      )}
                    />

                    <Button type="submit" label="Submit" className="mt-2" />
                  </form>
                )}
              />
            </div>
            {/* <div className="field">
              <label htmlFor="name">Name</label>
              <InputText
                id="name"
                value={user.name}
                onChange={(e) => onInputChange(e, "name")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !user.name,
                })}
              />
              {submitted && !user.name && (
                <small className="p-error">Name is required.</small>
              )}
            </div> */}
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
                  Are you sure you want to delete <b>{user.name}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteUsersDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            onHide={hideDeleteusersDialog}
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {user && (
                <span>Are you sure you want to delete the selected users?</span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
