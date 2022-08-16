import React, { useState, useEffect, useRef } from "react";
import { classNames } from "primereact/utils";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from 'primereact/progressspinner';
import {
  createProduct,
  deleteAsset,
  deleteProduct,
  getProduct,
  getProductById,
  updateProduct,
  getImageProduct,
} from "../../apiClient";
import { FileUpload } from "primereact/fileupload";
import { Image } from "primereact/image";
import "../../../css/app.css";

const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };

const ProductManagement = ({ title = "Empty Page" }) => {
  let emptyProduct = {
    name: "",
    assets: [],
    description: "",
  };

  let emptyAssetDialog = { open: false, item: null };

  const [dataProducts, setDataProducts] = useState([]);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [temporaryAssets, setTemporaryAssets] = useState(0); // length
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [deleteAssetDialog, setDeleteAssetDialog] = useState(emptyAssetDialog);
  const toast = useRef(null);
  const dt = useRef(null);
  let idProduct = product.id;

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    console.log(product.assets),
      console.log(temporaryAssets)
  }, [product.assets, temporaryAssets])

  // upload new assets
  const newFormData = (v) => {
    const data = new FormData();
    data.append("file", v);
    data.append("upload_preset", "ghtk-auction-laravel");
    data.append("cloud_name", "ghtk-auction-laravel");
    return data;
  }
  const customUploadHandle = (e) => {
    if (e.files.length < 1) return;
    Promise.all(e.files.map(u =>
      fetch("https://api.cloudinary.com/v1_1/ghtk-auction-laravel/auto/upload", {
        method: "post",
        body: newFormData(u),
      })
    )).then(responses =>
      Promise.all(responses.map(res => res.json()))
    ).then(texts => {
      setTemporaryAssets(e.files.length);
      setProduct({
        ...product,
        assets: texts.map(i => i.url),
      });
      toast.current.show({
        severity: "info",
        summary: "Success",
        detail: "File Uploaded",
      })
    }).catch((err) => {
      toast.current.show({
        severity: "info",
        summary: "Failed",
      })
    });
  }

  const openNew = () => {
    setSubmitted(false);
    setProductDialog(true);
  };

  const hideDialog = () => {
    if (product.id && (product.assets.length + product.savedAssets.length < 1)) {
      toast.current.show({
        severity: "error",
        summary: "Notification",
        detail: "Bài đấu giá cần có ít nhất 1 ảnh",
        life: 5000,
      });
      return;
    }
    setProduct(emptyProduct);
    setSubmitted(false);
    setProductDialog(false);
    setTemporaryAssets(0);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const editProduct = (_product) => {
    setTemporaryAssets(0);
    getProductById(_product.id).then((res) => {
      const resData = res.data.data;
      setProduct({
        id: resData[0].id,
        name: resData[0].name,
        description: resData[0].description,
        savedAssets: resData.assets,
        assets: [],
      });
      setProductDialog(true);
    });
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };

  const getData = () => {
    getProduct().then((res) => setDataProducts(res.data.data));
  };

  const deleteAssetAuc = () => {
    deleteAsset(deleteAssetDialog.item.id).then((res) => {
      if (res.data.status !== true) {
        toast.current.show({
          severity: "error",
          summary: "Notification",
          detail: res.data.message || "Error Delete",
          life: 5000,
        });
      } else {
        getProductById(product.id).then((res) => {
          const resData = res.data.data;
          setProduct({
            id: resData[0].id,
            name: resData[0].name,
            description: resData[0].description,
            savedAssets: resData.assets,
            assets: [...product.assets],
          });
          setDeleteAssetDialog(emptyAssetDialog)
        });
        toast.current.show({
          severity: "success",
          summary: "Notification",
          detail: res.data.message,
          life: 5000,
        });
      }
    });
  };

  const deleteProductAuc = () => {
    deleteProduct(idProduct).then((res) => {
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
      setProduct(emptyProduct);
      setDeleteProductDialog(false);
    });
  };

  const saveProduct = async () => {
    setSubmitted(true);
    const _product = { ...product };

    if (!_product.id && _product.assets.length < 1 || _product.description.trim() === '' || _product.name.trim() === '') return;
    if (product.id && (product.assets.length + product.savedAssets.length < 1)) {
      toast.current.show({
        severity: "error",
        summary: "Notification",
        detail: "Bài đấu giá cần có ít nhất 1 ảnh",
        life: 5000,
      });
      return;
    }

    if (_product.id) {
      updateProduct(_product.id, _product).then((res) => {
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
      createProduct(_product).then((res) => {
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
          onClick={openNew} />
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
          placeholder="Tìm kiếm..."
        />
      </span>
    </div>
  );

  const imageBodyTemplate = (rowData) => {
    return (
      <Image
        preview={true}
        width="100"
        src={`${rowData.assets !== null && rowData.assets.length > 0
          ? rowData.assets[0].file_name
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
        icon={(product.assets.length === temporaryAssets) ? "pi pi-check" : null}
        className="p-button-text"
        onClick={saveProduct}
        disabled={!product.id && (temporaryAssets < 1 || (product.assets.length !== temporaryAssets))}
      >
        {(temporaryAssets > 0 && product.assets.length !== temporaryAssets) && <ProgressSpinner style={{ width: '20px', height: '20px' }} />}
      </Button >
    </React.Fragment>
  );

  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button
        label="Không"
        icon="pi pi-times"
        className="p-button-text"
        onClick={() => {
          product.id ?
            setDeleteAssetDialog(emptyAssetDialog)
            :
            hideDeleteProductDialog()
        }}
      />
      <Button
        label="Có"
        icon="pi pi-check"
        className="p-button-text"
        onClick={
          () => {
            deleteAssetDialog.item ?
              deleteAssetAuc()
              :
              deleteProductAuc()
          }}
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
                field="assets"
                body={imageBodyTemplate}
                header="Ảnh"
              ></Column>
              <Column
                field="description"
                header="Mô tả"
                sortable
              ></Column>
              <Column field="created_at" header="Thời gian tạo" sortable></Column>
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
              <label htmlFor="name">Tên sản phẩm</label>
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
                <small className="p-error">Tên sản phẩm không được để trống.</small>
              )}
            </div>

            {/* SavedAsset */}
            {product.savedAssets && product.savedAssets.length > 0 &&
              <div className="field">
                <label htmlFor="savedAssets">Ảnh đã lưu</label>
                <div className="upload">
                  <div style={{
                    display: "flex",
                    maxWidth: '400px',
                    width: '400px',
                    overflow: 'auto'
                  }}
                  >
                    {product.savedAssets.map((i, index) =>
                      <div key={index}
                        style={{
                          // border: '1px solid #000',
                          justifyContent: "center",
                          alignItems: "center",
                          display: "flex",
                          flexDirection: "column",
                          margin: "1rem",
                        }}
                      >
                        <Image src={i.file_name} alt={i.file_name} width="100" preview />
                        <Button icon="pi pi-times" className="p-button-rounded p-button-danger" aria-label="Cancel"
                          style={{
                            marginTop: '2px'
                          }}
                          onClick={(e) => {
                            setDeleteAssetDialog({
                              open: true,
                              item: i,
                            });
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>}

            {/* Asset */}
            <div className="field">
              <label htmlFor="assets">Ảnh</label>
              <div className="upload">
                <div className="input-upload">
                  <FileUpload
                    name="assets"
                    id="assets"
                    multiple={true}
                    accept="image/*"
                    customUpload
                    uploadHandler={customUploadHandle}
                    onSelect={(e) => setTemporaryAssets(e.files.length)}
                    onClear={(e) => {
                      setTemporaryAssets(0);
                      setProduct({
                        ...product,
                        assets: []
                      })
                    }}
                    emptyTemplate={
                      <p className="m-0">Kéo và thả tệp vào đây để tải lên.</p>
                    }
                  />
                  {submitted && product.assets.length < 1 && !product.id && (
                    temporaryAssets < 1 ? <small className="p-error">Ảnh không được để trống.</small> : <small className="p-error">Bấm Upload ảnh trước khi Lưu.</small>
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

            <Dialog visible={deleteAssetDialog.open}
              onHide={() => setDeleteAssetDialog(emptyAssetDialog)}
              footer={deleteProductDialogFooter}
            >
              {deleteAssetDialog.item && (
                <span style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                  <b style={{ color: "red" }}>Bạn có chắc muốn xóa?</b>
                  <br />
                  <Image src={deleteAssetDialog.item.file_name} alt={deleteAssetDialog.item.file_name} width="100" preview />
                </span>
              )}
            </Dialog>
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
                  Bạn có chắc là bạn muốn{" "}
                  <b style={{ color: "red" }}>xóa</b> <b>{product.name}</b>?
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
