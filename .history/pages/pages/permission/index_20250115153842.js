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
import { fetchPermissions, createPermission,updateExistingPermission, bulkDeletePermissions } from './api'; // Pastikan jalur ini sesuai
import { deletePermission as deletePermissionById } from './api';
import PermissionCreateDialog from './Dialogs/PermissionCreateDialog';  // Import komponen PermissionDialog
import PermissionUpdateDialog from './Dialogs/PermissionUpdateDialog';
import { Badge } from 'primereact/badge';

const Inventory = () => {
    let emptyPermission = {
        id: null,
        permission :{
            permission: '',
        },
    }; 

    const [permissions, setPermissions] = useState(null);
    const [permissionDialog, setPermissionDialog] = useState(false);
    const [permissionUpdateDialog, setPermissionUpdateDialog] = useState(false);
    const [deletePermissionDialog, setDeletePermissionDialog] = useState(false);
    const [deletePermissionsDialog, setDeletePermissionsDialog] = useState(false);
    const [permission, setPermission] = useState(emptyPermission);
    const [selectedPermissions, setSelectedPermissions] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [rowsPerPage, setRowsPerPage] = useState(10); // Default 10

    const hidePermissionDialog = () => {
        setShowPermissionDialog(false);
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
        totalPages:0,
        nextPage: 0,
    });
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchPermissions({ page: paginationData.page, limit: rowsPerPage,  totalPages: paginationData.totalPages});
                setPermissions(Array.isArray(response.rows) ? response.rows : []);

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
        setPermission(emptyPermission);
        setSubmitted(false);
        setPermissionDialog(true);
    };

    const openEdit = (permissionData) => {
        setPermission({ ...permissionData });
        setSubmitted(false);
        setPermissionUpdateDialog(true);
    };
    

    const hideDialog = () => {
        setSubmitted(false);
        setPermissionDialog(false);
    };

    const hideUpdateDialog = () => {
        setSubmitted(false);
        setPermissionUpdateDialog(false);
    };

    const hideDeletePermissionDialog = () => {
        setDeletePermissionDialog(false);
    };

    const hideDeletePermissionsDialog = () => {
        setDeletePermissionsDialog(false);
    };

    const savePermission = () => {
        saveDataToApi();        
    };

    const saveDataToApi = async () => {
        try { 
            const response = await createPermission(permission);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: response.message, life: 3000 });
        } catch (error) {
            console.error("Error saving data:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.response.data.meta.message, life: 3000 });
        }
    };

    const updatePermission = () => {
        updateDataToApi();
    };
    
    const updateDataToApi = async () => {
        try { 
            const response = await updateExistingPermission(permission); // Gantilah dengan fungsi update yang sesuai
            toast.current.show({ severity: 'success', summary: 'Updated', detail: response.message, life: 3000 });
        } catch (error) {
            console.error("Error updating data:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.response?.data?.meta?.message, life: 3000 });
        }
    };

    const confirmDeletePermission = (permission) => {
        setPermission(permission);
        setDeletePermissionDialog(true);
    };
    
    const deletePermission = async () => {
        try {
            await deletePermissionById(permission.id); // Use the renamed function to delete by id
            const _permissions = permissions.filter((val) => val.id !== permission.id);
            setPermissions(_permissions);
            setDeletePermissionDialog(false);
            setPermission(emptyPermission);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Permission Deleted', life: 3000 });
        } catch (error) {
            console.error("Error deleting permission:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete permission', life: 3000 });
        }
    };
    
    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeletePermissionsDialog(true);
    };

    const bulkDeleteSelectedPermissions = async () => {
        try {
            const selectedPermissionIds = selectedPermissions.map((permission) => permission.id);
            await bulkDeletePermissions(selectedPermissionIds);
            const _permissions = permissions.filter((permission) => !selectedPermissionIds.includes(permission.id));
            setPermissions(_permissions);
            setDeletePermissionsDialog(false);
            setSelectedPermissions(null);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Permissions Deleted', life: 3000 });
        } catch (error) {
            console.error("Error deleting permissions:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete permissions', life: 3000 });
        }
    };    

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Bulk Delete" icon="pi pi-trash" className="p-button-danger mr-2" onClick={confirmDeleteSelected} disabled={!selectedPermissions || !selectedPermissions.length} />
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
            {rowData.label}
        </span>
        );
    };

    const permissionBodyTemplate = (rowData) => {
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
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeletePermission(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Permissions</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const deletePermissionDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletePermissionDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deletePermission} />
        </>
    );
    const deletePermissionsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeletePermissionsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={bulkDeleteSelectedPermissions} />

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
                       value={permissions}
                       selection={selectedPermissions}
                       onSelectionChange={(e) => setSelectedPermissions(e.value)}
                       dataKey="id"
                       className="datatable-responsive"
                       globalFilter={globalFilter}
                       emptyMessage="No permissions found."
                       header={header}
                       responsiveLayout="scroll"                   
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="nomor" header="No" body={nomorBodyTemplate} style={{ width: '5%' }} />
                        <Column field="label" header="Label" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="created_by" header="Created By" sortable body={permissionBodyTemplate}></Column>
                        <Column field="action" body={actionBodyTemplate} ></Column>
                    </DataTable>

                    <div className="paginator-buttons" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="flex justify-content-between align-items-center">
                        <Button icon="pi pi-angle-left" className="p-button-text" onClick={handlePreviousPage} disabled={paginationData.page === 1} />
                        <span>{`Page ${paginationData.page} of ${paginationData.totalPages }`}</span>
                        <Button icon="pi pi-angle-right" className="p-button-text" onClick={handleNextPage} disabled={paginationData.page === paginationData.totalPages} />
                        <span>{`Inventory ${paginationData.totalRows } Permissions`}</span>
                    </div>
                                <Dropdown
                        value={rowsPerPage}
                        options={[10, 25, 50]} // Opsi untuk jumlah baris per halaman
                            onChange={(e) => handleRowsPerPageChange(e.value)} // Panggil fungsi ketika nilai dropdown diubah
                            placeholder="Rows per page"
                            className="ml-2"
                        />
                </div>              
                        <PermissionCreateDialog
                        visible={permissionDialog}
                        permission={permission}
                        setPermission={setPermission}
                        hideDialog={hideDialog}
                        savePermission={savePermission}
                        submitted={submitted}
                        />
                         <PermissionUpdateDialog
                            visible={permissionUpdateDialog}
                            permission={permission}
                            setPermission={setPermission}
                            hideDialog={hideUpdateDialog}
                            updatePermission={updatePermission}
                            submitted={submitted}
                        />

                    <Dialog visible={deletePermissionDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePermissionDialogFooter} onHide={hideDeletePermissionDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {permission && (
                                <span>
                                    Are you sure you want to delete <b>{permission.permission}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deletePermissionsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deletePermissionsDialogFooter} onHide={hideDeletePermissionsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {permission && <span>Are you sure you want to delete the selected permissions?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default withAuth(Inventory);
