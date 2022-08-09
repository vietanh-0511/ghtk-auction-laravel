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
  getProduct,
  updateProduct,
} from "../../apiClient";
import { Image } from "primereact/image";
import "../../../css/app.css";

const ProductManagement = ({ title = "Empty Page" }) => {
  let emptyProduct = {
    name: "",
    assets: [],
    description: "",
  };

  const [dataProducts, setDataProducts] = useState([]);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState([]);
  const toast = useRef(null);
  const dt = useRef(null);
  let idProduct = product.id;

  console.log(product);
  const uploadImage = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "ghtk-auction-laravel");
    data.append("cloud_name", "ghtk-auction-laravel");
    fetch("https://api.cloudinary.com/v1_1/ghtk-auction-laravel/auto/upload", {
      method: "post",
      body: data,
    })
      .then((resp) => resp.json())
      .then((data) => {
        const img = data.url;
        product.assets.push(img);
        setUrl(img);
      })
      .catch((err) => console.log(err));
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
      <h5 className="mx-0 my-1">Manage Products</h5>
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
    console.log(rowData.asset.file_name);

    return (
      <Image
        preview={true}
        width="150"
        src={`${rowData.asset.file_name}`}
        onError={(e) =>
          (e.target.src =
            "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
        }
        className="product-image"
      />
    );
  };

  const productDialogFooter = (
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
        onClick={saveProduct}
      />
    </React.Fragment>
  );

  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteProductDialog}
      />
      <Button
        label="Yes"
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
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Products"
              globalFilter={globalFilter}
              header={header}
              responsiveLayout="scroll"
            >
              <Column field="id" header="ID" sortable></Column>
              <Column field="name" header="Product Name" sortable></Column>
              <Column
                field="assets"
                body={imageBodyTemplate}
                header="Images"
              ></Column>
              <Column
                field="description"
                header="Description"
                sortable
              ></Column>
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
            header={product.id ? "Update Product" : "Create Product"}
            modal
            className="p-fluid"
            footer={productDialogFooter}
            onHide={hideDialog}
          >
            {/* name */}
            <div className="field">
              <label htmlFor="name">Full Name</label>
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
                <small className="p-error">Product name is required.</small>
              )}
            </div>

            {/* Asset */}
            <div className="field">
              <label htmlFor="assets">Images</label>
              <div className="upload">
                <div className="input-upload">
                  <input
                    id="assets"
                    multiple={true}
                    type="file"
                    required={true}
                    accept="image/*"
                    value={product.assets}
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                  {submitted && !product.assets && (
                    <small className="p-error">Image name is required.</small>
                  )}
                  <button onClick={uploadImage}>Upload</button>
                </div>
                <div className="list-images">
                  <div>
                    <Image
                      width="100"
                      className="image-product"
                      preview={true}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* description */}
            <div className="field">
              <label htmlFor="description">Description</label>
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
                <small className="p-error">Description is required.</small>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteProductDialog}
            style={{ width: "450px" }}
            header="Confirm"
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
                  Are you sure you want to{" "}
                  <b style={{ color: "red" }}>delete</b> <b>{product.name}</b>?
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
