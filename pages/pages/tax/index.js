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
import { fetchTaxs, createTax,updateExistingTax, bulkDeleteTaxs } from './api'; // Pastikan jalur ini sesuai
import { deleteTax as deleteTaxById } from './api';
import TaxCreateDialog from './Dialogs/TaxCreateDialog';  // Import komponen TaxDialog
import TaxUpdateDialog from './Dialogs/TaxUpdateDialog';
import { Badge } from 'primereact/badge';

const Inventory = () => {
    let emptyTax = {
        id: null,
        user :{
            tax: '',
        },
        status: 0,
        description: ''
    }; 

    const [taxs, setTaxs] = useState(null);
    const [taxDialog, setTaxDialog] = useState(false);
    const [taxUpdateDialog, setTaxUpdateDialog] = useState(false);
    const [deleteTaxDialog, setDeleteTaxDialog] = useState(false);
    const [deleteTaxsDialog, setDeleteTaxsDialog] = useState(false);
    const [tax, setTax] = useState(emptyTax);
    const [selectedTaxs, setSelectedTaxs] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [rowsPerPage, setRowsPerPage] = useState(10); // Default 10

    const hideTaxDialog = () => {
        setShowTaxDialog(false);
    };
    
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
                const response = await fetchTaxs({ page: paginationData.page, limit: rowsPerPage,  totalPages: paginationData.totalPages});
                setTaxs(Array.isArray(response.rows) ? response.rows : []);

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
        setTax(emptyTax);
        setSubmitted(false);
        setTaxDialog(true);
    };

    const openEdit = (taxData) => {
        setTax({ ...taxData });
        setSubmitted(false);
        setTaxUpdateDialog(true);
    };
    

    const hideDialog = () => {
        setSubmitted(false);
        setTaxDialog(false);
    };

    const hideUpdateDialog = () => {
        setSubmitted(false);
        setTaxUpdateDialog(false);
    };

    const hideDeleteTaxDialog = () => {
        setDeleteTaxDialog(false);
    };

    const hideDeleteTaxsDialog = () => {
        setDeleteTaxsDialog(false);
    };

    const saveTax = () => {
        saveDataToApi();        
    };

    const saveDataToApi = async () => {
        try { 
            const response = await createTax(tax);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: response.message, life: 3000 });
        } catch (error) {
            console.error("Error saving data:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.response.data.meta.message, life: 3000 });
        }
    };

    const updateTax = () => {
        updateDataToApi();
    };
    
    const updateDataToApi = async () => {
        try { 
            const response = await updateExistingTax(tax); // Gantilah dengan fungsi update yang sesuai
            toast.current.show({ severity: 'success', summary: 'Updated', detail: response.message, life: 3000 });
        } catch (error) {
            console.error("Error updating data:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.response?.data?.meta?.message, life: 3000 });
        }
    };

    const confirmDeleteTax = (tax) => {
        setTax(tax);
        setDeleteTaxDialog(true);
    };
    
    const deleteTax = async () => {
        try {
            await deleteTaxById(tax.id); // Use the renamed function to delete by id
            const _taxs = taxs.filter((val) => val.id !== tax.id);
            setTaxs(_taxs);
            setDeleteTaxDialog(false);
            setTax(emptyTax);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Tax Deleted', life: 3000 });
        } catch (error) {
            console.error("Error deleting tax:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete tax', life: 3000 });
        }
    };
    
    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteTaxsDialog(true);
    };

    const bulkDeleteSelectedTaxs = async () => {
        try {
            const selectedTaxIds = selectedTaxs.map((tax) => tax.id);
            await bulkDeleteTaxs(selectedTaxIds);
            const _taxs = taxs.filter((tax) => !selectedTaxIds.includes(tax.id));
            setTaxs(_taxs);
            setDeleteTaxsDialog(false);
            setSelectedTaxs(null);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Taxs Deleted', life: 3000 });
        } catch (error) {
            console.error("Error deleting taxs:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete taxs', life: 3000 });
        }
    };    

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Bulk Delete" icon="pi pi-trash" className="p-button-danger mr-2" onClick={confirmDeleteSelected} disabled={!selectedTaxs || !selectedTaxs.length} />
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
            {rowData.tax}
        </span>
        );
    };

    const taxBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Created By</span>
                {rowData.created_by}
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-1" onClick={() => openEdit (rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteTax(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Taxs</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const deleteTaxDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteTaxDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteTax} />
        </>
    );
    const deleteTaxsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteTaxsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={bulkDeleteSelectedTaxs} />

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
                       value={taxs}
                       selection={selectedTaxs}
                       onSelectionChange={(e) => setSelectedTaxs(e.value)}
                       dataKey="id"
                       className="datatable-responsive"
                       globalFilter={globalFilter}
                       emptyMessage="No taxs found."
                       header={header}
                       responsiveLayout="scroll"                   
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="nomor" header="No" body={nomorBodyTemplate} style={{ width: '5%' }} />

                        <Column field="tax" header="Name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="created_by" header="Created By" sortable body={taxBodyTemplate}></Column>
                        <Column field="status" header="Status" body={statusBodyTemplate}></Column>
                        <Column field="action" body={actionBodyTemplate} ></Column>
                    </DataTable>

                    <div className="paginator-buttons" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="flex justify-content-between align-items-center">
                        <Button icon="pi pi-angle-left" className="p-button-text" onClick={handlePreviousPage} disabled={paginationData.page === 1} />
                        <span>{`Page ${paginationData.page} of ${paginationData.totalPages }`}</span>
                        <Button icon="pi pi-angle-right" className="p-button-text" onClick={handleNextPage} disabled={paginationData.page === paginationData.totalPages} />
                        <span>{`Inventory ${paginationData.totalRows } Taxs`}</span>
                    </div>
                                <Dropdown
                        value={rowsPerPage}
                        options={[10, 25, 50]} // Opsi untuk jumlah baris per halaman
                            onChange={(e) => handleRowsPerPageChange(e.value)} // Panggil fungsi ketika nilai dropdown diubah
                            placeholder="Rows per page"
                            className="ml-2"
                        />
                </div>              
                        <TaxCreateDialog
                        visible={taxDialog}
                        tax={tax}
                        setTax={setTax}
                        hideDialog={hideDialog}
                        saveTax={saveTax}
                        submitted={submitted}
                        />
                         <TaxUpdateDialog
                            visible={taxUpdateDialog}
                            tax={tax}
                            setTax={setTax}
                            hideDialog={hideUpdateDialog}
                            updateTax={updateTax}
                            submitted={submitted}
                        />

                    <Dialog visible={deleteTaxDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteTaxDialogFooter} onHide={hideDeleteTaxDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {tax && (
                                <span>
                                    Are you sure you want to delete <b>{tax.tax}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteTaxsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteTaxsDialogFooter} onHide={hideDeleteTaxsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {tax && <span>Are you sure you want to delete the selected taxs?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default withAuth(Inventory);
