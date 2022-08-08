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
  const toast = useRef(null);
  const dt = useRef(null);
  let idProduct = product.id;

  
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
    deleteProduct(idProduct).then(() => {
      setDeleteProductDialog(false);
      setProduct(emptyProduct);
      getData();
    });

    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Product Deleted",
      life: 3000,
    });
  };

  const saveProduct = () => {
    setSubmitted(true);
    // if (validateAll()) {
    if (product.id) {
      updateProduct(product.id, product).then(() => {
        getData();
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Updated",
          life: 3000,
        });
        hideDialog();
      });
    } else {
      createProduct(product).then(() => {
        getData();
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Created",
          life: 3000,
        });
        hideDialog();
      });
    }
    // }
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
    return (
      <img
        src={`images/product/${rowData.image}`}
        onError={(e) =>
          (e.target.src =
            "https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png")
        }
        alt={rowData.image}
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
                field="asset"
                body={imageBodyTemplate}
                header="Images"
                sortable
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
            {/* <div className="field">
              <label htmlFor="asset">Full Name</label>
              <InputText
                id="asset"
                value={product.name}
                onChange={(e) => onInputChange(e, "asset")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !product.asset,
                })}
              />
              {submitted && !product.asset && (
                <small className="p-error">Product name is required.</small>
              )}
            </div> */}

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
