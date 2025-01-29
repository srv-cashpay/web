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
import { fetchUnits, createUnit,updateExistingUnit, bulkDeleteUnits } from './api'; // Pastikan jalur ini sesuai
import { deleteUnit as deleteUnitById } from './api';
import UnitCreateDialog from './Dialogs/UnitCreateDialog';  // Import komponen UnitDialog
import UnitUpdateDialog from './Dialogs/UnitUpdateDialog';
import { Badge } from 'primereact/badge';

const Inventory = () => {
    let emptyUnit = {
        id: null,
        user :{
            unit_name: '',
        },
    }; 

    const [units, setUnits] = useState(null);
    const [unitDialog, setUnitDialog] = useState(false);
    const [unitUpdateDialog, setUnitUpdateDialog] = useState(false);
    const [deleteUnitDialog, setDeleteUnitDialog] = useState(false);
    const [deleteUnitsDialog, setDeleteUnitsDialog] = useState(false);
    const [unit, setUnit] = useState(emptyUnit);
    const [selectedUnits, setSelectedUnits] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [rowsPerPage, setRowsPerPage] = useState(10); // Default 10

    const hideUnitDialog = () => {
        setShowUnitDialog(false);
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
                const response = await fetchUnits({ page: paginationData.page, limit: rowsPerPage,  totalPages: paginationData.totalPages});
                setUnits(Array.isArray(response.rows) ? response.rows : []);

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
        setUnit(emptyUnit);
        setSubmitted(false);
        setUnitDialog(true);
    };

    const openEdit = (unitData) => {
        setUnit({ ...unitData });
        setSubmitted(false);
        setUnitUpdateDialog(true);
    };
    

    const hideDialog = () => {
        setSubmitted(false);
        setUnitDialog(false);
    };

    const hideUpdateDialog = () => {
        setSubmitted(false);
        setUnitUpdateDialog(false);
    };

    const hideDeleteUnitDialog = () => {
        setDeleteUnitDialog(false);
    };

    const hideDeleteUnitsDialog = () => {
        setDeleteUnitsDialog(false);
    };

    const saveUnit = () => {
        saveDataToApi();        
    };

    const saveDataToApi = async () => {
        try { 
            const response = await createUnit(unit);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: response.message, life: 3000 });
        } catch (error) {
            console.error("Error saving data:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.response.data.meta.message, life: 3000 });
        }
    };

    const updateUnit = () => {
        updateDataToApi();
    };
    
    const updateDataToApi = async () => {
        try { 
            const response = await updateExistingUnit(unit); // Gantilah dengan fungsi update yang sesuai
            toast.current.show({ severity: 'success', summary: 'Updated', detail: response.message, life: 3000 });
        } catch (error) {
            console.error("Error updating data:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.response.data.meta.message, life: 3000 });
        }
    };

    const confirmDeleteUnit = (unit) => {
        setUnit(unit);
        setDeleteUnitDialog(true);
    };
    
    const deleteUnit = async () => {
        try {
            await deleteUnitById(unit.id); // Use the renamed function to delete by id
            const _units = units.filter((val) => val.id !== unit.id);
            setUnits(_units);
            setDeleteUnitDialog(false);
            setUnit(emptyUnit);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Unit Deleted', life: 3000 });
        } catch (error) {
            console.error("Error deleting unit:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete unit', life: 3000 });
        }
    };
    
    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteUnitsDialog(true);
    };

    const bulkDeleteSelectedUnits = async () => {
        try {
            const selectedUnitIds = selectedUnits.map((unit) => unit.id);
            await bulkDeleteUnits(selectedUnitIds);
            const _units = units.filter((unit) => !selectedUnitIds.includes(unit.id));
            setUnits(_units);
            setDeleteUnitsDialog(false);
            setSelectedUnits(null);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Units Deleted', life: 3000 });
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
                    <Button label="Bulk Delete" icon="pi pi-trash" className="p-button-danger mr-2" onClick={confirmDeleteSelected} disabled={!selectedUnits || !selectedUnits.length} />
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
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteUnit(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Units</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const deleteUnitDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteUnitDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteUnit} />
        </>
    );
    const deleteUnitsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteUnitsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={bulkDeleteSelectedUnits} />

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
                       selection={selectedUnits}
                       onSelectionChange={(e) => setSelectedUnits(e.value)}
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
                        <Column field="action" body={actionBodyTemplate} ></Column>
                    </DataTable>

                    <div className="paginator-buttons" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="flex justify-content-between align-items-center">
                        <Button icon="pi pi-angle-left" className="p-button-text" onClick={handlePreviousPage} disabled={paginationData.page === 1} />
                        <span>{`Page ${paginationData.page} of ${paginationData.totalPages }`}</span>
                        <Button icon="pi pi-angle-right" className="p-button-text" onClick={handleNextPage} disabled={paginationData.page === paginationData.totalPages} />
                        <span>{`Inventory ${paginationData.totalRows } Units`}</span>
                    </div>
                                <Dropdown
                        value={rowsPerPage}
                        options={[10, 25, 50]} // Opsi untuk jumlah baris per halaman
                            onChange={(e) => handleRowsPerPageChange(e.value)} // Panggil fungsi ketika nilai dropdown diubah
                            placeholder="Rows per page"
                            className="ml-2"
                        />
                </div>              
                        <UnitCreateDialog
                        visible={unitDialog}
                        unit={unit}
                        setUnit={setUnit}
                        hideDialog={hideDialog}
                        saveUnit={saveUnit}
                        submitted={submitted}
                        />
                         <UnitUpdateDialog
                            visible={unitUpdateDialog}
                            unit={unit}
                            setUnit={setUnit}
                            hideDialog={hideUpdateDialog}
                            updateUnit={updateUnit}
                            submitted={submitted}
                        />

                    <Dialog visible={deleteUnitDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUnitDialogFooter} onHide={hideDeleteUnitDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {unit && (
                                <span>
                                    Are you sure you want to delete <b>{unit.unit_name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteUnitsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUnitsDialogFooter} onHide={hideDeleteUnitsDialog}>
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
