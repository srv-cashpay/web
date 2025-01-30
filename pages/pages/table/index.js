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
import { fetchTables, createTable,updateExistingTable, bulkDeleteTables } from '../../../services/table/api'; // Pastikan jalur ini sesuai
import { deleteTable as deleteTableById } from '../../../services/table/api';
import TableCreateDialog from './Dialogs/TableCreateDialog';  // Import komponen TableDialog
import TableUpdateDialog from './Dialogs/TableUpdateDialog';
import { Badge } from 'primereact/badge';

const Inventory = () => {
    let emptyTable = {
        id: null,
        user :{
            table: '',
        },
        status: 0,
        description: ''
    }; 

    const [tables, setTables] = useState(null);
    const [tableDialog, setTableDialog] = useState(false);
    const [tableUpdateDialog, setTableUpdateDialog] = useState(false);
    const [deleteTableDialog, setDeleteTableDialog] = useState(false);
    const [deleteTablesDialog, setDeleteTablesDialog] = useState(false);
    const [table, setTable] = useState(emptyTable);
    const [selectedTables, setSelectedTables] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [rowsPerPage, setRowsPerPage] = useState(10); // Default 10

    const hideTableDialog = () => {
        setShowTableDialog(false);
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
                const response = await fetchTables({ page: paginationData.page, limit: rowsPerPage,  totalPages: paginationData.totalPages});
                setTables(Array.isArray(response.rows) ? response.rows : []);

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
        setTable(emptyTable);
        setSubmitted(false);
        setTableDialog(true);
    };

    const openEdit = (tableData) => {
        setTable({ ...tableData });
        setSubmitted(false);
        setTableUpdateDialog(true);
    };
    

    const hideDialog = () => {
        setSubmitted(false);
        setTableDialog(false);
    };

    const hideUpdateDialog = () => {
        setSubmitted(false);
        setTableUpdateDialog(false);
    };

    const hideDeleteTableDialog = () => {
        setDeleteTableDialog(false);
    };

    const hideDeleteTablesDialog = () => {
        setDeleteTablesDialog(false);
    };

    const saveTable = () => {
        saveDataToApi();        
    };

    const saveDataToApi = async () => {
        try { 
            const response = await createTable(table);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: response.message, life: 3000 });
        } catch (error) {
            console.error("Error saving data:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.response.data.meta.message, life: 3000 });
        }
    };

    const updateTable = () => {
        updateDataToApi();
    };
    
    const updateDataToApi = async () => {
        try { 
            const response = await updateExistingTable(table); // Gantilah dengan fungsi update yang sesuai
            toast.current.show({ severity: 'success', summary: 'Updated', detail: response.message, life: 3000 });
        } catch (error) {
            console.error("Error updating data:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.response.data.meta.message, life: 3000 });
        }
    };

    const confirmDeleteTable = (table) => {
        setTable(table);
        setDeleteTableDialog(true);
    };
    
    const deleteTable = async () => {
        try {
            await deleteTableById(table.id); // Use the renamed function to delete by id
            const _tables = tables.filter((val) => val.id !== table.id);
            setTables(_tables);
            setDeleteTableDialog(false);
            setTable(emptyTable);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Table Deleted', life: 3000 });
        } catch (error) {
            console.error("Error deleting table:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete table', life: 3000 });
        }
    };
    
    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteTablesDialog(true);
    };

    const bulkDeleteSelectedTables = async () => {
        try {
            const selectedTableIds = selectedTables.map((table) => table.id);
            await bulkDeleteTables(selectedTableIds);
            const _tables = tables.filter((table) => !selectedTableIds.includes(table.id));
            setTables(_tables);
            setDeleteTablesDialog(false);
            setSelectedTables(null);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Tables Deleted', life: 3000 });
        } catch (error) {
            console.error("Error deleting tables:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete tables', life: 3000 });
        }
    };    

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Bulk Delete" icon="pi pi-trash" className="p-button-danger mr-2" onClick={confirmDeleteSelected} disabled={!selectedTables || !selectedTables.length} />
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
            {rowData.table}
        </span>
        );
    };

    const tableBodyTemplate = (rowData) => {
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
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteTable(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Tables</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const deleteTableDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteTableDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteTable} />
        </>
    );
    const deleteTablesDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteTablesDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={bulkDeleteSelectedTables} />

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
                       value={tables}
                       selection={selectedTables}
                       onSelectionChange={(e) => setSelectedTables(e.value)}
                       dataKey="id"
                       className="datatable-responsive"
                       globalFilter={globalFilter}
                       emptyMessage="No tables found."
                       header={header}
                       responsiveLayout="scroll"                   
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="nomor" header="No" body={nomorBodyTemplate} style={{ width: '5%' }} />

                        <Column field="table" header="Name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="created_by" header="Created By" sortable body={tableBodyTemplate}></Column>
                        <Column field="status" header="Status" body={statusBodyTemplate}></Column>
                        <Column field="action" body={actionBodyTemplate} ></Column>
                    </DataTable>

                    <div className="paginator-buttons" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="flex justify-content-between align-items-center">
                        <Button icon="pi pi-angle-left" className="p-button-text" onClick={handlePreviousPage} disabled={paginationData.page === 1} />
                        <span>{`Page ${paginationData.page} of ${paginationData.totalPages }`}</span>
                        <Button icon="pi pi-angle-right" className="p-button-text" onClick={handleNextPage} disabled={paginationData.page === paginationData.totalPages} />
                        <span>{`Inventory ${paginationData.totalRows } Tables`}</span>
                    </div>
                                <Dropdown
                        value={rowsPerPage}
                        options={[10, 25, 50]} // Opsi untuk jumlah baris per halaman
                            onChange={(e) => handleRowsPerPageChange(e.value)} // Panggil fungsi ketika nilai dropdown diubah
                            placeholder="Rows per page"
                            className="ml-2"
                        />
                </div>              
                        <TableCreateDialog
                        visible={tableDialog}
                        table={table}
                        setTable={setTable}
                        hideDialog={hideDialog}
                        saveTable={saveTable}
                        submitted={submitted}
                        />
                         <TableUpdateDialog
                            visible={tableUpdateDialog}
                            table={table}
                            setTable={setTable}
                            hideDialog={hideUpdateDialog}
                            updateTable={updateTable}
                            submitted={submitted}
                        />

                    <Dialog visible={deleteTableDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteTableDialogFooter} onHide={hideDeleteTableDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {table && (
                                <span>
                                    Are you sure you want to delete <b>{table.table}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteTablesDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteTablesDialogFooter} onHide={hideDeleteTablesDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {table && <span>Are you sure you want to delete the selected tables?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default withAuth(Inventory);
