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
  createProduct,
  deleteProduct,
  getImageProduct,
  getProduct,
  updateProduct,
} from "../../apiClient";
import { FileUpload } from "primereact/fileupload";
import { Image } from "primereact/image";
import "../../../css/app.css";

const ProductManagement = ({ title = "Empty Page" }) => {
  let emptyProduct = {
    name: "",
    asset: [],
    description: "",
  };

  const [dataProducts, setDataProducts] = useState([]);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [images, setImages] = useState([]);
  const toast = useRef(null);
  const dt = useRef(null);

images.map(item => item.file_name)


  let idProduct = product.id;

  const handleUploadImage = (e) => {
    const data = new FormData();
    data.append("file", e.files[0]);
    data.append("upload_preset", "ghtk-auction-laravel");
    data.append("cloud_name", "ghtk-auction-laravel");
    fetch("https://api.cloudinary.com/v1_1/ghtk-auction-laravel/auto/upload", {
      method: "post",
      body: data,
    })
      .then((resp) => resp.json())
      .then((data) => {
        product.asset.push(data.url);
        toast.current.show({
          severity: "info",
          summary: "Success",
          detail: "File Uploaded",
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    getProduct().then((res) => {
      setDataProducts(res.data.data);
    });
  }, []);

  const openNew = () => {
    setSubmitted(false);
    setProductDialog(true);
  };

  const hideDialog = () => {
    setProduct(emptyProduct);
    setSubmitted(false);
    setProductDialog(false);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const editProduct = (product) => {
    getImageProduct(product.id).then((res) => {
      setImages(res.data.data.assets);
    });
    setProduct({ ...product });
    setProductDialog(true);
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };

  const getData = () => {
    getProduct().then((res) => setDataProducts(res.data.data));
  };

  const deleteProductAuc = () => {
    deleteProduct(idProduct).then((res) => {
      if (res.data.status !== true) {
        toast.current.show({
          severity: "error",
          summary: "Notification",
          detail: res.data.message || "Error Delete",
          life: 5000,
        });
      } else {
        getData();
        toast.current.show({
          severity: "success",
          summary: "Notification",
          detail: res.data.message,
          life: 5000,
        });
      }
      setDeleteProductDialog(false);
      setProduct(emptyProduct);
    });
  };

  const saveProduct = () => {
    setSubmitted(true);

    const _product = { ...product };

    if (_product.id) {
      updateProduct(_product.id, _product).then((res) => {
        if (res.data.status !== true) {
          toast.current.show({
            severity: "error",
            summary: "Notification",
            detail: res.data.message || "Error Update",
            life: 5000,
          });
        } else {
          getData();
          toast.current.show({
            severity: "success",
            summary: "Notification",
            detail: res.data.message,
            life: 5000,
          });
        }
        hideDialog();
      });
    } else {
      createProduct(_product).then((res) => {
        if (res.data.status !== true) {
          toast.current.show({
            severity: "error",
            summary: "Notification",
            detail: res.data.message || "Error Create",
            life: 5000,
          });
        } else {
          getData();
          toast.current.show({
            severity: "success",
            summary: "Notification",
            detail: res.data.message,
            life: 5000,
          });
          hideDialog();
        }
      });
    }
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _Product = { ...product };
    _Product[`${name}`] = val;
    setProduct(_Product);
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
          onClick={() => editProduct(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteProduct(rowData)}
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

  const imageBodyTemplate = (rowData) => {
    return (
      <Image
        preview={true}
        width="100"
        src={`${
          rowData.asset !== null
            ? rowData.asset.file_name
            : "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png"
        }`}
        className="product-image"
      />
    );
  };

  const productDialogFooter = (
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
        onClick={saveProduct}
      />
    </React.Fragment>
  );

  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button
        label="Không"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteProductDialog}
      />
      <Button
        label="Có"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteProductAuc}
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
              value={dataProducts}
              selection={selectedProducts}
              onSelectionChange={(e) => setSelectedProducts(e.value)}
              dataKey="id"
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Hiển thị {first} đến {last} của {totalRecords} sản phẩm"
              globalFilter={globalFilter}
              header={header}
              responsiveLayout="scroll"
            >
              <Column field="id" header="ID" sortable></Column>
              <Column field="name" header="Tên sản phẩm" sortable></Column>
              <Column
                field="asset"
                body={imageBodyTemplate}
                header="Ảnh"
              ></Column>
              <Column field="description" header="Mô tả" sortable></Column>
              <Column field="created_at" header="Created At" sortable></Column>
              <Column
                body={actionBodyTemplate}
                exportable={false}
                style={{ minWidth: "8rem" }}
              ></Column>
            </DataTable>
          </div>

          <Dialog
            visible={productDialog}
            style={{ width: "450px" }}
            header={product.id ? "Cập nhật sản phẩm" : "Thêm mới sản phẩm"}
            modal
            className="p-fluid"
            footer={productDialogFooter}
            onHide={hideDialog}
          >
            {/* name */}
            <div className="field">
              <label htmlFor="name">Tên sản pẩm</label>
              <InputText
                id="name"
                value={product.name}
                onChange={(e) => onInputChange(e, "name")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !product.name,
                })}
              />
              {submitted && !product.name && (
                <small className="p-error">
                  Tên sản phẩm không được để trống.
                </small>
              )}
            </div>

            {/* Asset */}
            <div className="field">
              <label htmlFor="asset">Ảnh</label>
              {/*  */}
              <ul className="list-image">
                {images.map((item) => (
                  <li key={item.id} className='item-image'>
                    <Image width="100" src={item.file_name} className='image'/>
                  </li>
                ))}
              </ul>
              {/*  */}
              <div className="upload">
                <div className="input-upload">
                  <FileUpload
                    id="asset"
                    multiple={true}
                    url="https://api.cloudinary.com/v1_1/ghtk-auction-laravel/auto/upload"
                    accept="image/*"
                    value={product.asset}
                    customUpload
                    uploadHandler={handleUploadImage}
                    emptyTemplate={
                      <p className="m-0">Kéo và thả tệp vào đây để tải lên.</p>
                    }
                  />
                  {submitted && !product.asset && (
                    <small className="p-error">Ảnh không được để trống.</small>
                  )}
                </div>
              </div>
            </div>

            {/* description */}
            <div className="field">
              <label htmlFor="description">Mô tả</label>
              <InputText
                id="description"
                value={product.description}
                onChange={(e) => onInputChange(e, "description")}
                required
                className={classNames({
                  "p-invalid": submitted && !product.description,
                })}
              />
              {submitted && !product.description && (
                <small className="p-error">Mô tả không được để trống.</small>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteProductDialog}
            style={{ width: "450px" }}
            header="Xác nhận"
            modal
            footer={deleteProductDialogFooter}
            onHide={hideDeleteProductDialog}
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {product && (
                <span>
                  Bạn có chắc là bạn muốn <b style={{ color: "red" }}>xóa</b>{" "}
                  <b>{product.name}</b>?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
