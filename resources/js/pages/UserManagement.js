import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import "primeicons/primeicons.css";
import { getUser } from "../apiClient";

const UserManagement = ({ title = "Empty Page" }) => {
  const [dataUser, getDataUer] = useState([]);

  useEffect(() => {
    getUser().then((res) => getDataUer(res.data.data.data));
  }, []);

  const textEditor = (options) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    );
  };

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <h5>{title}</h5>
          <div
            style={{
              display: "flex",
              marginBottom: "10px",
            }}
          >
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
            />
          </div>
          <DataTable
            value={dataUser}
            editMode="row"
            dataKey="id"
            paginator
            responsiveLayout="scroll"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
            rows={10}
            rowsPerPageOptions={[10, 20, 50]}
          >
            <Column
              field="id"
              header="id"
              editor={(options) => textEditor(options)}
              style={{ width: "20%" }}
            ></Column>
            <Column
              field="full_name"
              header="full_name"
              editor={(options) => textEditor(options)}
              style={{ width: "20%" }}
            ></Column>
            <Column
              field="email"
              header="email"
              editor={(options) => textEditor(options)}
              style={{ width: "20%" }}
            ></Column>
            <Column
              field="password"
              header="password"
              editor={(options) => textEditor(options)}
              style={{ width: "20%" }}
            ></Column>
            <Column
              field="address"
              header="address"
              editor={(options) => textEditor(options)}
              style={{ width: "20%" }}
            ></Column>
            <Column
              field="phone"
              header="phone"
              editor={(options) => textEditor(options)}
              style={{ width: "20%" }}
            ></Column>
            <Column
              header="Action"
              rowEditor
              headerStyle={{ width: "10%", minWidth: "8rem" }}
              style={{ textAlign: "center" }}
              bodyStyle={{ paddingRight: 0, textAlign: "center" }}
              colSpan={2}
              alignHeader={"center"}
            ></Column>
            <Column
              body={
                <Button
                  icon="pi pi-times"
                  className="p-button-rounded p-button-danger p-button-text"
                  aria-label="Cancel"
                />
              }
              style={{ paddingLeft: 0 }}
            ></Column>
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
