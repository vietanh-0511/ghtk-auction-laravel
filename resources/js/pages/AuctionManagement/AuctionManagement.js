import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import {
  createAuction,
  deleteAuction,
  getAuction,
  updateAuction,
} from "../../apiClient";

function jsToSqlDate(jsDate) {
  var v = jsDate;
  return (
    v.getFullYear() +
    "-" +
    (v.getMonth() + 1) +
    "-" +
    v.getDate() +
    " " +
    (v.getHours() < 10 ? "0" + v.getHours() : v.getHours()) +
    ":" +
    (v.getMinutes() < 10 ? "0" + v.getMinutes() : v.getMinutes())
  );
}

function sqlToJsDate(sqlDate) {
  return new Date(Date.parse(sqlDate.replace(/-/g, "/")));
}

const AuctionManagement = ({ title = "Empty Page" }) => {
  let emptyAuction = {
    title: "",
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

  const editAuction = (row) => {
    const _row = { ...row };
    _row.start_time = sqlToJsDate(_row.start_time);
    _row.end_time = sqlToJsDate(_row.end_time);
    setAuction(_row);
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
    deleteAuction(idAuction).then((res) => {
      if (res.data.status !== true) {
        toast.current.show({
          severity: "error",
          summary: "Thông báo",
          detail: res.data.message || "Error Delete",
          life: 5000,
        });
      } else {
        getData();
        toast.current.show({
          severity: "success",
          summary: "Thông báo",
          detail: res.data.message,
          life: 5000,
        });
      }
      setDeleteAuctionDialog(false);
      setAuction(emptyAuction);
    });
  };

  const saveAuction = () => {
    setSubmitted(true);

    const _Auction = { ...Auction };
    _Auction.start_time = jsToSqlDate(_Auction.start_time);
    _Auction.end_time = jsToSqlDate(_Auction.end_time);

    if (_Auction.id) {
      updateAuction(_Auction.id, _Auction).then((res) => {
        if (res.data.status !== true) {
          toast.current.show({
            severity: "error",
            summary: "Thông báo",
            detail: res.data.message || "Error Update",
            life: 5000,
          });
        } else {
          getData();
          toast.current.show({
            severity: "success",
            summary: "Thông báo",
            detail: res.data.message,
            life: 5000,
          });
          hideDialog();
        }
      });
    } else {
      createAuction(_Auction).then((res) => {
        if (res.data.status !== true) {
          toast.current.show({
            severity: "error",
            summary: "Thông báo",
            detail: res.data.message || "Error Create",
            life: 5000,
          });
        } else {
          getData();
          toast.current.show({
            severity: "success",
            summary: "Thông báo",
            detail: res.data.message,
            life: 5000,
          });
        }
        hideDialog();
      });
    }
  };

  const onInputChange = (e, name) => {
    let _Auction = { ...Auction };
    var val;
    if (name === "start_time" || name === "end_time") val = e.value;
    val = (e.target && e.target.value) || "";
    _Auction[name] = val;
    setAuction(_Auction);
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label="Thêm mới"
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
        label="Hủy bỏ"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Lưu"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveAuction}
      />
    </React.Fragment>
  );

  const deleteAuctionDialogFooter = (
    <React.Fragment>
      <Button
        label="Không"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteAuctionDialog}
      />
      <Button
        label="Có"
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
              currentPageReportTemplate="Hiển thị {first} đến {last} của {totalRecords} phiên đấu giá"
              globalFilter={globalFilter}
              header={header}
              responsiveLayout="scroll"
            >
              <Column field="id" header="ID" sortable></Column>
              <Column field="title" header="Tên Auction" sortable></Column>
              <Column field="status" header="Trạng thái" sortable></Column>
              <Column
                field="start_time"
                header="Thời gian bắt đầu"
                sortable
              ></Column>
              <Column
                field="end_time"
                header="Thời gian kết thúc"
                sortable
              ></Column>
              <Column
                field="created_at"
                header="Thời gian tạo"
                sortable
              ></Column>
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
            header={Auction.id ? "Cập nhật phiên đấu giá" : "Tạo phiên đấu giá"}
            modal
            className="p-fluid"
            footer={AuctionDialogFooter}
            onHide={hideDialog}
          >
            {/* title */}
            <div className="field">
              <label htmlFor="title">Tên Auction</label>
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
                <small className="p-error">
                  Tên Auction không được để trống.
                </small>
              )}
            </div>

            {/* start time */}
            <div className="field">
              <label htmlFor="start_time">Thời gian bắt đầu</label>
              <Calendar
                id="start_time"
                value={Auction.start_time}
                showTime={true}
                showButtonBar={true}
                showIcon
                onChange={(e) => onInputChange(e, "start_time")}
                className={classNames({
                  "p-invalid": submitted && !Auction.start_time,
                })}
              />
              {submitted && !Auction.start_time && (
                <small className="p-error">
                  Thời gian bắt đầu không được để trống.
                </small>
              )}
            </div>

            {/* end time */}
            <div className="field">
              <label htmlFor="end_time">Thời gian kết thúc</label>
              <Calendar
                id="end_time"
                value={Auction.end_time}
                autoFocus
                showTime
                showButtonBar
                showIcon
                onChange={(e) => onInputChange(e, "end_time")}
              />
              {submitted && !Auction.end_time && (
                <small className="p-error">
                  Thời gian kết thúc không được để trống.
                </small>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteAuctionDialog}
            style={{ width: "450px" }}
            header="Xác nhận"
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
                  Bạn có chắc là bạn muốn <b style={{ color: "red" }}>xóa</b>{" "}
                  <b>{Auction.title}</b>?
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
