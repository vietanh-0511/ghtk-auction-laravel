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
  let emptyuser = {
    id: null,
    full_name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  };

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

  let idUser = user.id;
  console.log(dataUsers);
  useEffect(() => {
    getUser().then((res) => {
      setDataUsers(res.data.data);
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
    getUser().then((res) => setDataUsers(res.data.data));
  };

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
      let newUser = { ...user };
      if (user.id) {
        updateUser(idUser).then((id) => {
          console.log(id);
          getData();
        });
        _users[idUser] = newUser;
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Updated",
          life: 3000,
        });
      } else {
        newUser.id = createId();
        _users.push(newUser);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Created",
          life: 3000,
        });
      }
      setDataUsers(_users);
      setUserDialog(false);
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
                <small className="p-error">Name is required.</small>
              )}
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <InputText
                id="email"
                value={user.email}
                onChange={(e) => onInputChange(e, "email")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !user.email,
                })}
              />
              {submitted && !user.email && (
                <small className="p-error">Email is required.</small>
              )}
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <InputText
                id="password"
                value={user.password}
                onChange={(e) => onInputChange(e, "password")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !user.password,
                })}
              />
              {submitted && !user.password && (
                <small className="p-error">Password is required.</small>
              )}
            </div>
            <div className="field">
              <label htmlFor="address">Address</label>
              <InputText
                id="address"
                value={user.address}
                onChange={(e) => onInputChange(e, "address")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !user.address,
                })}
              />
              {submitted && !user.address && (
                <small className="p-error">Address is required.</small>
              )}
            </div>
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <InputText
                id="phone"
                value={user.phone}
                onChange={(e) => onInputChange(e, "phone")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !user.phone,
                })}
              />
              {submitted && !user.phone && (
                <small className="p-error">Phone is required.</small>
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
