import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useRef, useState } from 'react';
import withAuth from '../../../layout/context/withAuth';
import { Dropdown } from 'primereact/dropdown'; 
import { fetchProducts, createProduct,updateExistingProduct, bulkDeleteProducts } from '../../../services/inventory/api'; // Pastikan jalur ini sesuai
import { deleteProduct as deleteProductById } from '../../../services/inventory/api';
import ProductCreateDialog from '../../../components/dialogs/inventory/ProductCreateDialog';  // Import komponen MerkDialog
import ProductUpdateDialog from '../../../components/dialogs/inventory/ProductUpdateDialog';
import UploadImageDialog from '../../../components/dialogs/inventory/UploadImageDialog';
import { Badge } from 'primereact/badge';

const Inventory = () => {
    let emptyProduct = {
        id: null,
        user :{
            product_name: '',
        },
        image: null,
        description: '',
        category: '',
        quantity: 0,
        status: 0,
        minimal_stock: 0,
        merk:'',
        stock: 0,
        price: 0
    }; 

    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [productUpdateDialog, setProductUpdateDialog] = useState(false);
    const [uploadImageDialog, setProductUploadDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [rowsPerPage, setRowsPerPage] = useState(10); // Default 10
    const [stockAdjustmentDialog, setStockAdjustmentDialog] = useState(false);

    const handleRowsPerPageChange = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
        setPaginationData(prev => ({ ...prev, limit: newRowsPerPage, page: 1 })); // Reset ke halaman 1 saat limit berubah
    };
    
    const [paginationData, setPaginationData] = useState({
        page: 1, // Start from page 1 as per your requirement
        totaPages: 0,
        limit: 10, // Default limit to 10
        totalData: 0,
        totalRows: 0,
        nextPage: 0,
    });
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchProducts({ page: paginationData.page, limit: rowsPerPage,  totalPages: paginationData.totalPages});
                setProducts(Array.isArray(response.rows) ? response.rows : []);

                setPaginationData(prev => ({
                    ...prev,
                    totalPages: response.total_page,  // Ambil total halaman dari respons API
                    totalData: response.total_data,
                    totalRows: response.total_rows,
                    nextPage: response.next_page
                    
                }));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
        console.log("Updated Pagination Data:", paginationData);  // Log setiap kali paginationData berubah

    }, [paginationData.page, rowsPerPage, paginationData.totalPages]); 
   

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const openEdit = (productData) => {
        setProduct({ ...productData });
        setSubmitted(false);
        setProductUpdateDialog(true);
    };

    const openUpload = (productData) => {
        setProduct({ ...productData });
        setSubmitted(false);
        setProductUploadDialog(true);
    };    

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideUpdateDialog = () => {
        setSubmitted(false);
        setProductUpdateDialog(false);
    };

    const hideUploadDialog = () => {
        setSubmitted(false);
        setProductUploadDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        saveDataToApi();        
    };

    const saveDataToApi = async () => {
        try { 
            const response = await createProduct(product);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: response.message, life: 3000 });
        } catch (error) {
            console.error("Error saving data:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.response.data.meta.message, life: 3000 });
        }
    };

    const updateProduct = () => {
        updateDataToApi();
    };

    const handleUploadImage = async (file) => {
        const formData = new FormData();
        formData.append('image', file);
    
        try {
            const response = await uploadProductImage(product.id, formData);
            toast.current.show({ severity: 'success', summary: 'Uploaded', detail: response.message, life: 3000 });
            setProductUploadDialog(false);
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'Upload Failed',
                detail: error.message || 'Error uploading image',
                life: 3000,
            });
        }
    };
    
    
    const updateDataToApi = async () => {
        try { 
            const response = await updateExistingProduct(product); // Gantilah dengan fungsi update yang sesuai
            toast.current.show({ severity: 'success', summary: 'Updated', detail: response.message, life: 3000 });
        } catch (error) {
            console.error("Error updating data:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.response.data.meta.message, life: 3000 });
        }
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };
    
    const deleteProduct = async () => {
        try {
            await deleteProductById(product.id); // Use the renamed function to delete by id
            const _products = products.filter((val) => val.id !== product.id);
            setProducts(_products);
            setDeleteProductDialog(false);
            setProduct(emptyProduct);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete product', life: 3000 });
        }
    };
    
    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const showStockAdjustmentDialog = () => {
        setStockAdjustmentDialog(true);
    };
    
    const hideStockAdjustmentDialog = () => {
        setStockAdjustmentDialog(false);
    };

    const bulkDeleteSelectedProducts = async () => {
        try {
            const selectedProductIds = selectedProducts.map((product) => product.id);
            await bulkDeleteProducts(selectedProductIds);
            const _products = products.filter((product) => !selectedProductIds.includes(product.id));
            setProducts(_products);
            setDeleteProductsDialog(false);
            setSelectedProducts(null);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
        } catch (error) {
            console.error("Error deleting products:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete products', life: 3000 });
        }
    };    

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Bulk Delete" icon="pi pi-trash" className="p-button-danger mr-2" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
                    <Button
                        label="Stock Adjustment"
                        icon="pi pi-plus"
                        className="p-button-success mr-2"
                        onClick={showStockAdjustmentDialog}
                    />
            </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <span
            style={{
                cursor: 'pointer',
                color: 'blue',
                
            }}
            onClick={() => openEdit(rowData)}
        >
            {rowData.product_name}
        </span>
        );
    };

    const categoryBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Date</span>
                {rowData.created_at}
            </>
        );
    };

    const idBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">ID</span>
                {rowData.id}
            </>
        );
    };

    const stockBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Stock</span>
                {rowData.stock}
            </>
        );
    };

    const imageBodyTemplate = (rowData) => {
        return (
            <div style={{ textAlign: 'center' }}>
                {rowData.image && rowData.image.file_path ? (
                    <img
                        src={`http://103.127.134.78:2358/${rowData.image.file_path}`}
                        alt={rowData.product_name}
                        style={{
                            width: '70px',
                            height: '70px',
                            objectFit: 'cover',
                            borderRadius: '4px',
                        }}
                    />
                ) : (
                    <span>No Image</span>
                )}
            </div>
        );
    };
    

    const priceBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Price</span>
                {rowData.price}
            </>
        );
    };    

    const statusBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Status</span>
                <Badge
                    value={rowData.status === 1 ? 'Active' : 'Inactive'}
                    severity={rowData.status === 1 ? 'success' : 'danger'}
                    className="ml-2"
                />
            </>
        );
    };  

    const handleNextPage = () => {
        setPaginationData(prev => {
            const nextPage = prev.page + 1;
            return { ...prev, page: nextPage > prev.totalPages ? prev.totalPages : nextPage };
        });
    };
    const handlePreviousPage = () => {
        setPaginationData(prev => {
            const previousPage = prev.page - 1;
            return { ...prev, page: previousPage < 1 ? 1 : previousPage };
        });
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-image" className="p-button-rounded p-button-warning mr-1" onClick={() => openUpload(rowData)} />
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-1" onClick={() => openEdit (rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProduct(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Products</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={bulkDeleteSelectedProducts} />

        </>
    );

    const nomorBodyTemplate = (_, { rowIndex }) => {
        // Calculate the row number based on the current page and rows per page
        const nomor = (paginationData.page - 1) * rowsPerPage + rowIndex + 1;
        return (
            <span>{nomor}</span>
        );
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                       ref={dt}
                       value={products}
                       selection={selectedProducts}
                       onSelectionChange={(e) => setSelectedProducts(e.value)}
                       dataKey="id"
                       className="datatable-responsive"
                       globalFilter={globalFilter}
                       emptyMessage="No products found."
                       header={header}
                       responsiveLayout="scroll"                   
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="nomor" header="No" body={nomorBodyTemplate} style={{ width: '5%' }} />
                        <Column field="image" header="Image" body={imageBodyTemplate} />
                        <Column field="id" header="ID" body={idBodyTemplate} style={{ width: '5%' }} />
                        <Column field="product_name" header="Name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="created_at" header="Date" sortable body={categoryBodyTemplate}></Column>
                        <Column field="stock" header="Stock" body={stockBodyTemplate} />
                        <Column field="price" header="Price" body={priceBodyTemplate} />
                        <Column field="status" header="Status" body={statusBodyTemplate}></Column>
                        <Column field="action" body={actionBodyTemplate} ></Column>
                    </DataTable>

                    <div className="paginator-buttons" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="flex justify-content-between align-items-center">
                        <Button icon="pi pi-angle-left" className="p-button-text" onClick={handlePreviousPage} disabled={paginationData.page === 1} />
                        <span>{`Page ${paginationData.page} of ${paginationData.totalPages }`}</span>
                        <Button icon="pi pi-angle-right" className="p-button-text" onClick={handleNextPage} disabled={paginationData.page === paginationData.totalPages} />
                        <span>{`Inventory ${paginationData.totalRows } Products`}</span>
                    </div>
                                <Dropdown
                        value={rowsPerPage}
                        options={[10, 25, 50]} // Opsi untuk jumlah baris per halaman
                            onChange={(e) => handleRowsPerPageChange(e.value)} // Panggil fungsi ketika nilai dropdown diubah
                            placeholder="Rows per page"
                            className="ml-2"
                        />
                </div>              
                        <ProductCreateDialog
                        visible={productDialog}
                        product={product}
                        setProduct={setProduct}
                        hideDialog={hideDialog}
                        saveProduct={saveProduct}
                        submitted={submitted}
                        />
                         <ProductUpdateDialog
                            visible={productUpdateDialog}
                            product={product}
                            setProduct={setProduct}
                            hideDialog={hideUpdateDialog}
                            updateProduct={updateProduct}
                            submitted={submitted}
                        />
                         <UploadImageDialog
                            visible={uploadImageDialog}
                            product={product}
                            setProduct={setProduct}
                            hideDialog={hideUploadDialog}
                            onUpload={handleUploadImage} 
                            submitted={submitted}
                        />

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && (
                                <span>
                                    Are you sure you want to delete <b>{product.product_name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>Are you sure you want to delete the selected products?</span>}
                        </div>
                    </Dialog>

                    <Dialog
                    visible={stockAdjustmentDialog}
                    style={{ width: '30vw' }}
                    header="Stock Adjustment"
                    modal
                    onHide={hideStockAdjustmentDialog}
                >
                    <DataTable value={products} responsiveLayout="scroll">
                        <Column field="product_name" header="Name" />
                        <Column field="stock" header="Current Stock" />
                        <Column
                            field="adjustment"
                            header="Adjustment"
                            body={(rowData) => (
                                <InputText
                                style={{ width: '7vw' }}
                                    type="number"
                                    onChange={(e) => {
                                        const newProducts = products.map((product) =>
                                            product.id === rowData.id
                                                ? { ...product, adjustment: parseInt(e.target.value, 10) || 0 }
                                                : product
                                        );
                                        setProducts(newProducts);
                                    }}
                                />
                            )}
                        />
                    </DataTable>
                    <div className="flex justify-content-end mt-3">
                        <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideStockAdjustmentDialog} />
                        <Button label="Save" icon="pi pi-check" className="p-button-success" onClick={() => { /* Tambahkan fungsi simpan */ }} />
                    </div>
                </Dialog>
                </div>
            </div>
        </div>
    );
};

export default withAuth(Inventory);
