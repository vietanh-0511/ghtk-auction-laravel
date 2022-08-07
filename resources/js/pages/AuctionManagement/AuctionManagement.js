import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import {
  createAuction,
  deleteAuction,
  getAuction,
  updateAuction,
} from "../../apiClient";

const AuctionManagement = ({ title = "Empty Page" }) => {
  let emptyAuction = {
    id: null,
    title: "",
    status: "",
    start_time: "",
    end_time: "",
  };

  const [dataAuctions, setDataAuctions] = useState([]);
  const [AuctionDialog, setAuctionDialog] = useState(false);
  const [deleteAuctionDialog, setDeleteAuctionDialog] = useState(false);
  const [Auction, setAuction] = useState(emptyAuction);
  const [selectedAuctions, setSelectedAuctions] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  let idAuction = Auction.id;
  const status = dataAuctions.forEach((item) => item.status);
  console.log(status);
  const statusAuction = () => {
    const status = dataAuctions.map((item) => item.status);
  };
console.log()

  // const validate = (value, type) => {
  //   var check = false;
  //   switch (type) {
  //     case "email":
  //       check = value
  //         .toLowerCase()
  //         .match(
  //           /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  //         );
  //       break;
  //     case "password":
  //       check = value.match(
  //         /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
  //       );
  //       break;
  //     case "confirmation":
  //       check = Auction.password === Auction.password_confirmation;
  //       break;
  //     case "phone":
  //       check = Auction.phone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/);
  //       break;
  //   }
  //   return !check;
  // };

  // const validateAll = () => {
  //   return Auction.id
  //     ? Auction.full_name &&
  //         Auction.email &&
  //         Auction.address &&
  //         Auction.phone &&
  //         !(
  //           validate(Auction.email, "email") && validate(Auction.phone, "phone")
  //         )
  //     : Auction.full_name &&
  //         Auction.email &&
  //         Auction.password &&
  //         Auction.password_confirmation &&
  //         Auction.address &&
  //         Auction.phone &&
  //         !(
  //           validate(Auction.email, "email") &&
  //           validate(Auction.password, "password") &&
  //           validate(Auction.password_confirmation, "confirmation") &&
  //           validate(Auction.phone, "phone")
  //         );
  // };

  useEffect(() => {
    getAuction().then((res) => {
      setDataAuctions(res.data.data);
    });
  }, []);

  const openNew = () => {
    setSubmitted(false);
    setAuctionDialog(true);
  };

  const hideDialog = () => {
    setAuction(emptyAuction);
    setSubmitted(false);
    setAuctionDialog(false);
  };

  const hideDeleteAuctionDialog = () => {
    setDeleteAuctionDialog(false);
  };

  const editAuction = (Auction) => {
    setAuction({ ...Auction });
    setAuctionDialog(true);
  };

  const confirmDeleteAuction = (Auction) => {
    setAuction(Auction);
    setDeleteAuctionDialog(true);
  };

  const getData = () => {
    getAuction().then((res) => setDataAuctions(res.data.data));
  };

  const delAuction = () => {
    deleteAuction(idAuction).then(() => {
      setDeleteAuctionDialog(false);
      setAuction(emptyAuction);
      getData();
    });

    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Auction Deleted",
      life: 3000,
    });
  };

  const saveAuction = () => {
    setSubmitted(true);
    // if (validateAll()) {
    if (Auction.id) {
      updateAuction(Auction.id, Auction).then(() => {
        getData();
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Auction Updated",
          life: 3000,
        });
        hideDialog();
      });
    } else {
      createAuction(Auction).then(() => {
        getData();
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Auction Created",
          life: 3000,
        });
        hideDialog();
      });
    }
    // }
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _Auction = { ...Auction };
    _Auction[`${name}`] = val;
    setAuction(_Auction);
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
          onClick={() => editAuction(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteAuction(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className="table-header">
      <h5 className="mx-0 my-1">Manage Auctions</h5>
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

  const AuctionDialogFooter = (
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
        onClick={saveAuction}
      />
    </React.Fragment>
  );

  const deleteAuctionDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteAuctionDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={delAuction}
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
              value={dataAuctions}
              selection={selectedAuctions}
              onSelectionChange={(e) => setSelectedAuctions(e.value)}
              dataKey="id"
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Auctions"
              globalFilter={globalFilter}
              header={header}
              responsiveLayout="scroll"
            >
              <Column field="id" header="ID" sortable></Column>
              <Column field="title" header="Title" sortable></Column>
              <Column field="status" header="Status" sortable>
                abc
              </Column>
              <Column field="start_time" header="Start Time" sortable></Column>
              <Column field="end_time" header="End Time" sortable></Column>
              <Column field="created_at" header="Created At" sortable></Column>
              <Column
                body={actionBodyTemplate}
                exportable={false}
                style={{ minWidth: "8rem" }}
              ></Column>
            </DataTable>
          </div>

          <Dialog
            visible={AuctionDialog}
            style={{ width: "450px" }}
            header={Auction.id ? "Update Auction" : "Create Auction"}
            modal
            className="p-fluid"
            footer={AuctionDialogFooter}
            onHide={hideDialog}
          >
            {/* title */}
            <div className="field">
              <label htmlFor="title">Title</label>
              <InputText
                id="title"
                value={Auction.title}
                onChange={(e) => onInputChange(e, "title")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !Auction.title,
                })}
              />
              {submitted && !Auction.title && (
                <small className="p-error">Title is required.</small>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteAuctionDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteAuctionDialogFooter}
            onHide={hideDeleteAuctionDialog}
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {Auction && (
                <span>
                  Are you sure you want to{" "}
                  <b style={{ color: "red" }}>delete</b> <b>{Auction.title}</b>?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AuctionManagement;
