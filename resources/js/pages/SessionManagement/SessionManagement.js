import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import {
  getProductnotinss,
  createSession,
  getProduct,
  getSession,
  updateSession,
  deleteSession,
  getAuction,
} from "../../apiClient";
import { parseInt } from "lodash";

const SessionManagement = ({ title = "Empty Page" }) => {
  let emptySection = {
    start_price: "",
    price_step: "",
    product_id: [],
    auction_id: [],
  };
  const [productnotss, setProductnotinss] = useState([]);
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
    });

    getProduct().then((res) => {
      setProducts(res.data.data);
    });
    getProductnotinss().then((res) => {
      setProductnotinss(res.data.data);
    });

    getAuction().then((res) => {
      setAutcions(res.data.data);
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
    deleteSession(idSection).then((res) => {
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
      setDeleteSectionDialog(false);
      setSection(emptySection);
    });
  };

  const saveSection = () => {
    setSubmitted(true);
    const _Section = { ...Section };
    _Section.price_step = parseInt(_Section.price_step);
    _Section.start_price = parseInt(_Section.start_price);
    if (_Section.id) {
      updateSession(_Section.id, _Section).then((res) => {
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
      createSession(_Section).then((res) => {
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
          hideDialog();
        }
      });
    }
  };

  const onInputChange = (e, name) => {
    let _Section = { ...Section };
    var val;
    if (name === "start_price" || name === "price_step") val = e.value;
    val = (e.target && e.target.value) || "";
    _Section[`${name}`] = val;
    setSection(_Section);
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
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Tìm kiếm..."
        />
      </span>
    </div>
  );

  const SectionDialogFooter = (
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
        onClick={saveSection}
      />
    </React.Fragment>
  );

  const deleteSectionDialogFooter = (
    <React.Fragment>
      <Button
        label="Không"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteSectionDialog}
      />
      <Button
        label="Có"
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
              currentPageReportTemplate="Hiển thị {first} đến {last} của {totalRecords} Sessions"
              globalFilter={globalFilter}
              header={header}
              responsiveLayout="scroll"
            >
              <Column field="id" header="ID" sortable></Column>
              <Column
                field="product.name"
                header="Tên sản phẩm"
                sortable
              ></Column>
              <Column
                field="auction.title"
                header="Tên phiên đấu giá"
                sortable
              ></Column>
              <Column
                field="start_price"
                header="Giá khởi điểm"
                sortable
              ></Column>
              <Column field="price_step" header="Bước giá" sortable></Column>
              <Column
                field="highest_bid"
                header="Giá cao nhất"
                sortable
              ></Column>
              <Column
                field="winner_id"
                header="Id thắng cuộc"
                sortable
              ></Column>
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
            header={Section.id ? "Cập nhật Session" : "Thêm mới Session"}
            modal
            className="p-fluid"
            footer={SectionDialogFooter}
            onHide={hideDialog}
          >
            {/* start price */}
            <div className="field">
              <label htmlFor="start_price">Giá khởi điểm</label>
              <InputText
                id="start_price"
                value={Section.start_price}
                onChange={(e) => onInputChange(e, "start_price")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !Section.start_price,
                })}
              />
              {submitted && !Section.start_price && (
                <small className="p-error">
                  Giá khởi điểm không được để trống.
                </small>
              )}
            </div>

            {/* price step */}
            <div className="field">
              <label htmlFor="price_step">Bước giá</label>
              <InputText
                id="price_step"
                value={Section.price_step}
                onChange={(e) => onInputChange(e, "price_step")}
                required
                className={classNames({
                  "p-invalid": submitted && !Section.price_step,
                })}
              />
              {submitted && !Section.price_step && (
                <small className="p-error">Bước giá không được để trống.</small>
              )}
            </div>

            {/* Mutil Select */}
            <div className="field">
              <label htmlFor="product_id">Tên sản phẩm</label>
              <Dropdown
                optionValue="id"
                value={Section.product_id}
                options={productnotss}
                defaultValue={undefined}
                onChange={(e) => onInputChange(e, "product_id")}
                placeholder="Select a Product"
                optionLabel="name"
                virtualScrollerOptions={{ itemSize: 38 }}
                required
                showClear
                className={classNames({
                  "p-invalid": submitted && Section.product_id.length <= 0,
                })}
              />
              {submitted && Section.product_id.length <= 0 && (
                <small className="p-error">
                  Tên sản phẩm không được để trống.
                </small>
              )}
            </div>
            <div className="field">
              <label htmlFor="auction_id">Phiên đấu giá</label>
              <Dropdown
                optionValue="id"
                defaultValue={undefined}
                value={Section.auction_id}
                options={auctions}
                onChange={(e) => onInputChange(e, "auction_id")}
                optionLabel="title"
                placeholder="Select a Auction"
                virtualScrollerOptions={{ itemSize: 38 }}
                required
                showClear
                className={classNames({
                  "p-invalid": submitted && Section.auction_id.length <= 0,
                })}
              />
              {submitted && Section.auction_id.length <= 0 && (
                <small className="p-error">
                  Tên phiên đấu giá không được để trống.
                </small>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteSectionDialog}
            style={{ width: "450px" }}
            header="Xác nhận"
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
                  Bạn có chắc là bạn muốn <b style={{ color: "red" }}>xóa</b>{" "}
                  <b>{}</b>?
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
