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
import { fetchMerks, createMerk,updateExistingMerk, bulkDeleteMerks } from './api'; // Pastikan jalur ini sesuai
import { deleteMerk as deleteMerkById } from './api';
import MerkCreateDialog from './Dialogs/MerkCreateDialog';  // Import komponen MerkDialog
import MerkUpdateDialog from './Dialogs/MerkUpdateDialog';
import { Badge } from 'primereact/badge';

const Inventory = () => {
    let emptyMerk = {
        id: null,
        user :{
            unit_name: '',
        },
        status: 0,
        description: ''
    }; 

    const [units, setMerks] = useState(null);
    const [unitDialog, setMerkDialog] = useState(false);
    const [unitUpdateDialog, setMerkUpdateDialog] = useState(false);
    const [deleteMerkDialog, setDeleteMerkDialog] = useState(false);
    const [deleteMerksDialog, setDeleteMerksDialog] = useState(false);
    const [unit, setMerk] = useState(emptyMerk);
    const [selectedMerks, setSelectedMerks] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [rowsPerPage, setRowsPerPage] = useState(10); // Default 10

    const hideMerkDialog = () => {
        setShowMerkDialog(false);
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
                const response = await fetchMerks({ page: paginationData.page, limit: rowsPerPage,  totalPages: paginationData.totalPages});
                setMerks(Array.isArray(response.rows) ? response.rows : []);

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
        setMerk(emptyMerk);
        setSubmitted(false);
        setMerkDialog(true);
    };

    const openEdit = (unitData) => {
        setMerk({ ...unitData });
        setSubmitted(false);
        setMerkUpdateDialog(true);
    };
    

    const hideDialog = () => {
        setSubmitted(false);
        setMerkDialog(false);
    };

    const hideUpdateDialog = () => {
        setSubmitted(false);
        setMerkUpdateDialog(false);
    };

    const hideDeleteMerkDialog = () => {
        setDeleteMerkDialog(false);
    };

    const hideDeleteMerksDialog = () => {
        setDeleteMerksDialog(false);
    };

    const saveMerk = () => {
        saveDataToApi();        
    };

    const saveDataToApi = async () => {
        try { 
            const response = await createMerk(unit);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: response.message, life: 3000 });
        } catch (error) {
            console.error("Error saving data:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.response.data.meta.message, life: 3000 });
        }
    };

    const updateMerk = () => {
        updateDataToApi();
    };
    
    const updateDataToApi = async () => {
        try { 
            const response = await updateExistingMerk(unit); // Gantilah dengan fungsi update yang sesuai
            toast.current.show({ severity: 'success', summary: 'Updated', detail: response.message, life: 3000 });
        } catch (error) {
            console.error("Error updating data:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.response?.data?.meta?.message, life: 3000 });
        }
    };

    const confirmDeleteMerk = (unit) => {
        setMerk(unit);
        setDeleteMerkDialog(true);
    };
    
    const deleteMerk = async () => {
        try {
            await deleteMerkById(unit.id); // Use the renamed function to delete by id
            const _units = units.filter((val) => val.id !== unit.id);
            setMerks(_units);
            setDeleteMerkDialog(false);
            setMerk(emptyMerk);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Merk Deleted', life: 3000 });
        } catch (error) {
            console.error("Error deleting unit:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete unit', life: 3000 });
        }
    };
    
    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteMerksDialog(true);
    };

    const bulkDeleteSelectedMerks = async () => {
        try {
            const selectedMerkIds = selectedMerks.map((unit) => unit.id);
            await bulkDeleteMerks(selectedMerkIds);
            const _units = units.filter((unit) => !selectedMerkIds.includes(unit.id));
            setMerks(_units);
            setDeleteMerksDialog(false);
            setSelectedMerks(null);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Merks Deleted', life: 3000 });
        } catch (error) {
            console.error("Error deleting units:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete units', life: 3000 });
        }
    };    

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Bulk Delete" icon="pi pi-trash" className="p-button-danger mr-2" onClick={confirmDeleteSelected} disabled={!selectedMerks || !selectedMerks.length} />
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
            {rowData.unit_name}
        </span>
        );
    };

    const unitBodyTemplate = (rowData) => {
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
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteMerk(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Merks</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const deleteMerkDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteMerkDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteMerk} />
        </>
    );
    const deleteMerksDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteMerksDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={bulkDeleteSelectedMerks} />

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
                       value={units}
                       selection={selectedMerks}
                       onSelectionChange={(e) => setSelectedMerks(e.value)}
                       dataKey="id"
                       className="datatable-responsive"
                       globalFilter={globalFilter}
                       emptyMessage="No units found."
                       header={header}
                       responsiveLayout="scroll"                   
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="nomor" header="No" body={nomorBodyTemplate} style={{ width: '5%' }} />

                        <Column field="unit_name" header="Name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="created_by" header="Created By" sortable body={unitBodyTemplate}></Column>
                        <Column field="status" header="Status" body={statusBodyTemplate}></Column>
                        <Column field="action" body={actionBodyTemplate} ></Column>
                    </DataTable>

                    <div className="paginator-buttons" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="flex justify-content-between align-items-center">
                        <Button icon="pi pi-angle-left" className="p-button-text" onClick={handlePreviousPage} disabled={paginationData.page === 1} />
                        <span>{`Page ${paginationData.page} of ${paginationData.totalPages }`}</span>
                        <Button icon="pi pi-angle-right" className="p-button-text" onClick={handleNextPage} disabled={paginationData.page === paginationData.totalPages} />
                        <span>{`Inventory ${paginationData.totalRows } Merks`}</span>
                    </div>
                                <Dropdown
                        value={rowsPerPage}
                        options={[10, 25, 50]} // Opsi untuk jumlah baris per halaman
                            onChange={(e) => handleRowsPerPageChange(e.value)} // Panggil fungsi ketika nilai dropdown diubah
                            placeholder="Rows per page"
                            className="ml-2"
                        />
                </div>              
                        <MerkCreateDialog
                        visible={unitDialog}
                        unit={unit}
                        setMerk={setMerk}
                        hideDialog={hideDialog}
                        saveMerk={saveMerk}
                        submitted={submitted}
                        />
                         <MerkUpdateDialog
                            visible={unitUpdateDialog}
                            unit={unit}
                            setMerk={setMerk}
                            hideDialog={hideUpdateDialog}
                            updateMerk={updateMerk}
                            submitted={submitted}
                        />

                    <Dialog visible={deleteMerkDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteMerkDialogFooter} onHide={hideDeleteMerkDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {unit && (
                                <span>
                                    Are you sure you want to delete <b>{unit.unit_name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteMerksDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteMerksDialogFooter} onHide={hideDeleteMerksDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {unit && <span>Are you sure you want to delete the selected units?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default withAuth(Inventory);
