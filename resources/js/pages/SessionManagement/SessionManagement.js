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
  createSession,
  getProduct,
  getSession,
  updateSession,
  deleteSession,
  getAuction,
} from "../../apiClient";

const SessionManagement = ({ title = "Empty Page" }) => {
  let emptySection = {
    start_price: "",
    price_step: "",
    product_id: [],
    auction_id: [],
  };

  const [dataSections, setDataSections] = useState([]);
  const [SectionDialog, setSectionDialog] = useState(false);
  const [deleteSectionDialog, setDeleteSectionDialog] = useState(false);
  const [Section, setSection] = useState(emptySection);
  const [selectedSections, setSelectedSections] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [products, setProducts] = useState([]); 
  const [auctions, setAutcions] = useState([]); 
  const toast = useRef(null);
  const dt = useRef(null);

  let idSection = Section.id;

  useEffect(() => {
    getSession().then((res) => {
      setDataSections(res.data.data);
      console.log("get sesstion: ",res);
    });

    getProduct().then((res) => {
      setProducts(res.data.data);
      console.log("get product: ", res);
    });

    getAuction().then((res) => {
      setAutcions(res.data.data);
      console.log("get Auction: ", res);
    });
  }, []);
  const openNew = () => {
    setSubmitted(false);
    setSectionDialog(true);
  };

  const hideDialog = () => {
    setSection(emptySection);
    setSubmitted(false);
    setSectionDialog(false);
  };

  const hideDeleteSectionDialog = () => {
    setDeleteSectionDialog(false);
  };

  const editSection = (row) => {
    const _row = { ...row };
    setSection(_row);
    setSectionDialog(true);
  };

  const confirmDeleteSection = (Section) => {
    setSection(Section);
    setDeleteSectionDialog(true);
  };

  const getData = () => {
    getSession().then((res) => setDataSections(res.data.data));
  };

  const delSection = () => {
    deleteSession(idSection).then(() => {
      setDeleteSectionDialog(false);
      setSection(emptySection);
      getData();
    });

    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Section Deleted",
      life: 3000,
    });
  };

  const saveSection = () => {
    setSubmitted(true);

    const _Section = { ...Section };

    // if (validateAll()) {
    if (_Section.id) {
      updateSession(_Section.id, Section).then(() => {
        getData();
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Section Updated",
          life: 3000,
        });
        hideDialog();
      });
    } else {
      createSession(_Section).then(() => {
        getData();
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Section Created",
          life: 3000,
        });
        hideDialog();
      });
    }
    // }
  };

  const onInputChange = (e, name) => {
    let _Section = { ...Section };
    var val;
    if (name === "start_time" || name === "end_time") val = e.value;
    val = (e.target && e.target.value) || "";
    _Section[`${name}`] = val;
    setSection(_Section);
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

  const sessionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editSection(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteSection(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className="table-header">
      <h5 className="mx-0 my-1">Manage Sections</h5>
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

  const SectionDialogFooter = (
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
        onClick={saveSection}
      />
    </React.Fragment>
  );

  const deleteSectionDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteSectionDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={delSection}
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
              value={dataSections}
              selection={selectedSections}
              onSelectionChange={(e) => setSelectedSections(e.value)}
              dataKey="id"
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Sections"
              globalFilter={globalFilter}
              header={header}
              responsiveLayout="scroll"
            >
              <Column field="id" header="ID" sortable></Column>
              <Column
                field="start_price"
                header="Start price"
                sortable
              ></Column>
              <Column field="price_step" header="Price step" sortable></Column>
              <Column
                field="highest_bid"
                header="Highest bid"
                sortable
              ></Column>
              <Column field="winner_id" header="Winner id" sortable></Column>
              <Column field="product_id" header="Product id" sortable></Column>
              <Column field="auction_id" header="Auction id" sortable></Column>

              <Column
                body={sessionBodyTemplate}
                exportable={false}
                style={{ minWidth: "8rem" }}
              ></Column>
            </DataTable>
          </div>

          <Dialog
            visible={SectionDialog}
            style={{ width: "450px" }}
            header={Section.id ? "Update Section" : "Create Section"}
            modal
            className="p-fluid"
            footer={SectionDialogFooter}
            onHide={hideDialog}
          >
            <div className="field">
              <label htmlFor="title">Title</label>
              <InputText
                id="title"
                value={Section.title}
                onChange={(e) => onInputChange(e, "title")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !Section.title,
                })}
              />
              {submitted && !Section.title && (
                <small className="p-error">Title is required.</small>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteSectionDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteSectionDialogFooter}
            onHide={hideDeleteSectionDialog}
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {Section && (
                <span>
                  Are you sure you want to{" "}
                  <b style={{ color: "red" }}>delete</b> <b>{Section.title}</b>?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default SessionManagement;
