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
import { fetchRoleUserPermissions, createRoleUserPermission, updateExistingRole, bulkDeleteRoleUserPermissions } from '../../../services/roleuserpermission/api'; // Pastikan jalur ini sesuai
import { deleteRoleUserPermissionById } from '../../../services/roleuserpermission/api';
import RoleCreateDialog from '../../../components/dialogs/roleuserpermission/RoleUserPermissionCreateDialog';  // Import komponen RoleDialog
import RoleUpdateDialog from '../../../components/dialogs/roleuserpermission/RoleUserPermissionUpdateDialog';
import { Badge } from 'primereact/badge';

const Inventory = () => {
    let emptyRole = {
        id: null,
        roleuserpermission :{
            roleuserpermission: '',
        },
    }; 

    const [roleuserpermissions, setRoleUserPermissions] = useState(null);
    const [roleDialog, setRoleDialog] = useState(false);
    const [roleUpdateDialog, setRoleUpdateDialog] = useState(false);
    const [deleteRoleDialog, setDeleteRoleDialog] = useState(false);
    const [deleteRoleUserPermissionsDialog, setDeleteRoleUserPermissionsDialog] = useState(false);
    const [roleuserpermission, setRole] = useState(emptyRole);
    const [selectedRoleUserPermissions, setSelectedRoleUserPermissions] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [rowsPerPage, setRowsPerPage] = useState(10); // Default 10

    const hideRoleDialog = () => {
        setShowRoleDialog(false);
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
                const response = await fetchRoleUserPermissions({ page: paginationData.page, limit: rowsPerPage,  totalPages: paginationData.totalPages});
                setRoleUserPermissions(Array.isArray(response.rows) ? response.rows : []);

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
        setRole(emptyRole);
        setSubmitted(false);
        setRoleDialog(true);
    };

    const openEdit = (roleData) => {
        setRole({ ...roleData });
        setSubmitted(false);
        setRoleUpdateDialog(true);
    };
    

    const hideDialog = () => {
        setSubmitted(false);
        setRoleDialog(false);
    };

    const hideUpdateDialog = () => {
        setSubmitted(false);
        setRoleUpdateDialog(false);
    };

    const hideDeleteRoleDialog = () => {
        setDeleteRoleDialog(false);
    };

    const hideDeleteRoleUserPermissionsDialog = () => {
        setDeleteRoleUserPermissionsDialog(false);
    };

    const saveRole = () => {
        saveDataToApi();        
    };

    const saveDataToApi = async () => {
        try { 
            const response = await createRoleUserPermission(roleuserpermission);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: response.message, life: 3000 });
        } catch (error) {
            console.error("Error saving data:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.response.data.meta.message, life: 3000 });
        }
    };

    const updateRole = () => {
        updateDataToApi();
    };
    
    const updateDataToApi = async () => {
        try { 
            const response = await updateExistingRole(roleuserpermission); // Gantilah dengan fungsi update yang sesuai
            toast.current.show({ severity: 'success', summary: 'Updated', detail: response.message, life: 3000 });
        } catch (error) {
            console.error("Error updating data:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: error.response.data.meta.message, life: 3000 });
        }
    };

    const confirmDeleteRole = (roleuserpermission) => {
        setRole(roleuserpermission);
        setDeleteRoleDialog(true);
    };
    
    const deleteRole = async () => {
        try {
            await deleteRoleUserPermissionById(roleuserpermission.id); // Use the renamed function to delete by id
            const _roleuserpermissions = roleuserpermissions.filter((val) => val.id !== roleuserpermission.id);
            setRoleUserPermissions(_roleuserpermissions);
            setDeleteRoleDialog(false);
            setRole(emptyRole);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Role Deleted', life: 3000 });
        } catch (error) {
            console.error("Error deleting roleuserpermission:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete roleuserpermission', life: 3000 });
        }
    };
    
    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteRoleUserPermissionsDialog(true);
    };

    const bulkDeleteSelectedRoleUserPermissions = async () => {
        try {
            const selectedRoleIds = selectedRoleUserPermissions.map((roleuserpermission) => roleuserpermission.id);
            await bulkDeleteRoleUserPermissions(selectedRoleIds);
            const _roleuserpermissions = roleuserpermissions.filter((roleuserpermission) => !selectedRoleIds.includes(roleuserpermission.id));
            setRoleUserPermissions(_roleuserpermissions);
            setDeleteRoleUserPermissionsDialog(false);
            setSelectedRoleUserPermissions(null);
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'RoleUserPermissions Deleted', life: 3000 });
        } catch (error) {
            console.error("Error deleting roleuserpermissions:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to delete roleuserpermissions', life: 3000 });
        }
    };    

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Bulk Delete" icon="pi pi-trash" className="p-button-danger mr-2" onClick={confirmDeleteSelected} disabled={!selectedRoleUserPermissions || !selectedRoleUserPermissions.length} />
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

     const permissionidBodyTemplate = (rowData) => {
        return (
            <span
            style={{
                cursor: 'pointer',
                color: 'blue',
                
            }}
            onClick={() => openEdit(rowData)}
        >
            {rowData.permission_id}
        </span>
        );
    };

    const roleidBodyTemplate = (rowData) => {
        return (
            <span
            style={{
                cursor: 'pointer',
                color: 'blue',
                
            }}
            onClick={() => openEdit(rowData)}
        >
            {rowData.role_id}
        </span>
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
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteRole(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage RoleUserPermissions</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const deleteRoleDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteRoleDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteRole} />
        </>
    );
    const deleteRoleUserPermissionsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteRoleUserPermissionsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={bulkDeleteSelectedRoleUserPermissions} />

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
                       value={roleuserpermissions}
                       selection={selectedRoleUserPermissions}
                       onSelectionChange={(e) => setSelectedRoleUserPermissions(e.value)}
                       dataKey="id"
                       className="datatable-responsive"
                       globalFilter={globalFilter}
                       emptyMessage="No roleuserpermissions found."
                       header={header}
                       responsiveLayout="scroll"                   
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="nomor" header="No" body={nomorBodyTemplate} style={{ width: '5%' }} />
                        <Column field="role id" header="role ID" sortable body={roleidBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="permission id" header="permission ID" sortable body={permissionidBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="action" body={actionBodyTemplate} ></Column>
                    </DataTable>

                    <div className="paginator-buttons" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="flex justify-content-between align-items-center">
                        <Button icon="pi pi-angle-left" className="p-button-text" onClick={handlePreviousPage} disabled={paginationData.page === 1} />
                        <span>{`Page ${paginationData.page} of ${paginationData.totalPages }`}</span>
                        <Button icon="pi pi-angle-right" className="p-button-text" onClick={handleNextPage} disabled={paginationData.page === paginationData.totalPages} />
                        <span>{`Inventory ${paginationData.totalRows } RoleUserPermissions`}</span>
                    </div>
                                <Dropdown
                        value={rowsPerPage}
                        options={[10, 25, 50]} // Opsi untuk jumlah baris per halaman
                            onChange={(e) => handleRowsPerPageChange(e.value)} // Panggil fungsi ketika nilai dropdown diubah
                            placeholder="Rows per page"
                            className="ml-2"
                        />
                </div>              
                        <RoleCreateDialog
                        visible={roleDialog}
                        roleuserpermission={roleuserpermission}
                        setRole={setRole}
                        hideDialog={hideDialog}
                        saveRole={saveRole}
                        submitted={submitted}
                        />
                         <RoleUpdateDialog
                            visible={roleUpdateDialog}
                            roleuserpermission={roleuserpermission}
                            setRole={setRole}
                            hideDialog={hideUpdateDialog}
                            updateRole={updateRole}
                            submitted={submitted}
                        />

                    <Dialog visible={deleteRoleDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteRoleDialogFooter} onHide={hideDeleteRoleDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {roleuserpermission && (
                                <span>
                                    Are you sure you want to delete <b>{roleuserpermission.roleuserpermission}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteRoleUserPermissionsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteRoleUserPermissionsDialogFooter} onHide={hideDeleteRoleUserPermissionsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {roleuserpermission && <span>Are you sure you want to delete the selected roleuserpermissions?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default withAuth(Inventory);
